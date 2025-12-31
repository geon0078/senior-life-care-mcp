// MCP 도구 테스트 스크립트 - SSE 응답 수신 개선
import http from 'http';

const BASE_URL = 'http://localhost:3000';

let sseMessages = [];
let sseResolvers = [];

// SSE 연결 및 세션 ID 획득
function connectSSE() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/sse`, (res) => {
      let sessionId = null;

      res.on('data', (chunk) => {
        const data = chunk.toString();

        // 여러 이벤트가 한번에 올 수 있음
        const events = data.split('\n\n').filter(e => e.trim());

        for (const event of events) {
          // 세션 ID 추출
          const match = event.match(/sessionId=([a-zA-Z0-9-]+)/);
          if (match && !sessionId) {
            sessionId = match[1];
            console.log('✅ 세션 ID:', sessionId);
            resolve({ sessionId, response: res });
          }

          // JSON 응답 파싱
          const jsonMatch = event.match(/data: ({.*})/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[1]);
              console.log('\n📨 SSE 응답 수신:', JSON.stringify(parsed).substring(0, 300) + '...');
              sseMessages.push(parsed);

              // 대기 중인 resolver가 있으면 호출
              if (sseResolvers.length > 0) {
                const resolver = sseResolvers.shift();
                resolver(parsed);
              }
            } catch (e) {
              // JSON 파싱 실패 무시
            }
          }
        }
      });

      res.on('error', reject);
    });

    req.on('error', reject);

    setTimeout(() => {
      if (!sessionId) reject(new Error('세션 ID 획득 실패'));
    }, 5000);
  });
}

// SSE 응답 대기
function waitForSSEResponse(timeout = 5000) {
  return new Promise((resolve, reject) => {
    // 이미 수신된 메시지가 있으면 반환
    if (sseMessages.length > 0) {
      resolve(sseMessages.shift());
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error('SSE 응답 타임아웃'));
    }, timeout);

    sseResolvers.push((msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
  });
}

// MCP 메시지 전송 (응답은 SSE로 수신)
function sendMessage(sessionId, message) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(message);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/messages?sessionId=${sessionId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 도구 호출 테스트
async function testTool(sessionId, toolName, args = {}) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🔧 테스트: ${toolName}`);
  console.log('📝 인자:', JSON.stringify(args));

  const message = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  };

  // 메시지 전송
  await sendMessage(sessionId, message);

  // SSE 응답 대기
  try {
    const response = await waitForSSEResponse(3000);
    if (response.result && response.result.content) {
      const text = response.result.content[0]?.text || '';
      console.log('\n📄 결과 (처음 500자):');
      console.log(text.substring(0, 500));
      if (text.length > 500) console.log('...(생략)');
    }
    return response;
  } catch (e) {
    console.log('⚠️ 응답 대기 중 오류:', e.message);
    return null;
  }
}

// 메인 테스트
async function main() {
  console.log('🚀 MCP 테스트 시작\n');

  try {
    // 1. SSE 연결
    console.log('1️⃣ SSE 연결 중...');
    const { sessionId, response } = await connectSSE();

    await new Promise(r => setTimeout(r, 500));

    // 2. 초기화
    console.log('\n2️⃣ 초기화...');
    await sendMessage(sessionId, {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    });

    // 초기화 응답 대기
    await waitForSSEResponse(3000);
    console.log('✅ 초기화 완료');

    await new Promise(r => setTimeout(r, 300));

    // 3. 기존 도구 테스트
    console.log('\n3️⃣ 기존 도구 테스트...');

    await testTool(sessionId, 'check_basic_pension', { age: 70, income: 1500000 });
    await new Promise(r => setTimeout(r, 300));

    await testTool(sessionId, 'find_dementia_center', { region: '서울 강남구' });
    await new Promise(r => setTimeout(r, 300));

    // 4. 신규 도구 테스트
    console.log('\n\n4️⃣ 신규 도구 테스트...');

    await testTool(sessionId, 'check_transport_benefits', { age: 70, region: '서울' });
    await new Promise(r => setTimeout(r, 300));

    await testTool(sessionId, 'check_tax_benefits', { age: 70 });
    await new Promise(r => setTimeout(r, 300));

    await testTool(sessionId, 'find_senior_jobs', { region: '서울', job_type: 'public' });
    await new Promise(r => setTimeout(r, 300));

    await testTool(sessionId, 'find_legal_aid', { region: '서울' });
    await new Promise(r => setTimeout(r, 300));

    console.log('\n\n' + '='.repeat(50));
    console.log('✅ 모든 테스트 완료!');
    console.log('='.repeat(50));

    response.destroy();
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();
