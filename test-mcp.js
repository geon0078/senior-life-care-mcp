// MCP 도구 테스트 스크립트
const http = require('http');

const BASE_URL = 'http://localhost:3000';

// SSE 연결 및 세션 ID 획득
function connectSSE() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/sse`, (res) => {
      let sessionId = null;

      res.on('data', (chunk) => {
        const data = chunk.toString();
        console.log('📥 SSE 수신:', data.substring(0, 200));

        // 세션 ID 추출
        const match = data.match(/sessionId=([a-zA-Z0-9-]+)/);
        if (match && !sessionId) {
          sessionId = match[1];
          console.log('✅ 세션 ID:', sessionId);
          resolve({ sessionId, response: res });
        }
      });

      res.on('error', reject);
    });

    req.on('error', reject);

    // 5초 타임아웃
    setTimeout(() => {
      if (!sessionId) reject(new Error('세션 ID 획득 실패'));
    }, 5000);
  });
}

// MCP 메시지 전송
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
        console.log('📤 응답:', data.substring(0, 500));
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
  console.log(`\n🔧 테스트: ${toolName}`);
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

  return sendMessage(sessionId, message);
}

// 도구 목록 조회
async function listTools(sessionId) {
  console.log('\n📋 도구 목록 조회...');

  const message = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/list',
    params: {}
  };

  return sendMessage(sessionId, message);
}

// 메인 테스트
async function main() {
  console.log('🚀 MCP 테스트 시작\n');

  try {
    // 1. SSE 연결
    console.log('1️⃣ SSE 연결 중...');
    const { sessionId, response } = await connectSSE();

    // 잠시 대기
    await new Promise(r => setTimeout(r, 1000));

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

    await new Promise(r => setTimeout(r, 500));

    // 3. 기존 도구 테스트
    console.log('\n3️⃣ 기존 도구 테스트...');

    // 기초연금 확인
    await testTool(sessionId, 'check_basic_pension', { age: 70, income: 1500000 });
    await new Promise(r => setTimeout(r, 500));

    // 치매센터 찾기
    await testTool(sessionId, 'find_dementia_center', { region: '서울 강남구' });
    await new Promise(r => setTimeout(r, 500));

    // 4. 신규 도구 테스트
    console.log('\n4️⃣ 신규 도구 테스트...');

    // 교통 혜택
    await testTool(sessionId, 'check_transport_benefits', { age: 70, region: '서울' });
    await new Promise(r => setTimeout(r, 500));

    // 세금 혜택
    await testTool(sessionId, 'check_tax_benefits', { age: 70 });
    await new Promise(r => setTimeout(r, 500));

    // 일자리 찾기
    await testTool(sessionId, 'find_senior_jobs', { region: '서울', job_type: 'public' });
    await new Promise(r => setTimeout(r, 500));

    // 법률 상담
    await testTool(sessionId, 'find_legal_aid', { region: '서울' });
    await new Promise(r => setTimeout(r, 500));

    console.log('\n✅ 모든 테스트 완료!');

    // 연결 종료
    response.destroy();
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();
