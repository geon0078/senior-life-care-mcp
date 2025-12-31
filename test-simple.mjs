// 간단한 MCP 테스트 - 디버깅용
import http from 'http';

console.log('🔗 SSE 연결 시작...\n');

const req = http.get('http://localhost:3000/sse', (res) => {
  let sessionId = null;
  let initialized = false;

  res.on('data', async (chunk) => {
    const data = chunk.toString();
    console.log('📥 SSE 수신:\n' + data);
    console.log('---');

    // 세션 ID 추출
    const match = data.match(/sessionId=([a-zA-Z0-9-]+)/);
    if (match && !sessionId) {
      sessionId = match[1];
      console.log('✅ 세션 ID:', sessionId);

      // 잠시 후 초기화 요청
      setTimeout(() => {
        console.log('\n📤 초기화 요청 전송...');
        sendMessage(sessionId, {
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'test', version: '1.0.0' }
          }
        });
      }, 500);
    }

    // 초기화 응답 확인
    if (data.includes('"id":1') && !initialized) {
      initialized = true;
      console.log('✅ 초기화 응답 수신!');

      // initialized 알림 전송
      setTimeout(() => {
        console.log('\n📤 initialized 알림 전송...');
        sendMessage(sessionId, {
          jsonrpc: '2.0',
          method: 'notifications/initialized'
        });
      }, 300);

      // 도구 호출 테스트
      setTimeout(() => {
        console.log('\n📤 도구 호출 테스트: check_basic_pension...');
        sendMessage(sessionId, {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: 'check_basic_pension',
            arguments: { age: 70, income: 1500000 }
          }
        });
      }, 800);

      // 신규 도구 테스트
      setTimeout(() => {
        console.log('\n📤 도구 호출 테스트: check_transport_benefits...');
        sendMessage(sessionId, {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: 'check_transport_benefits',
            arguments: { age: 70, region: '서울' }
          }
        });
      }, 1500);

      // 종료
      setTimeout(() => {
        console.log('\n✅ 테스트 완료!');
        process.exit(0);
      }, 3000);
    }
  });

  res.on('error', (e) => console.error('❌ 오류:', e));
});

req.on('error', (e) => console.error('❌ 연결 오류:', e));

function sendMessage(sessionId, message) {
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
      if (data) console.log('📤 POST 응답:', data.substring(0, 100));
    });
  });

  req.on('error', (e) => console.error('❌ POST 오류:', e));
  req.write(postData);
  req.end();
}

// 타임아웃
setTimeout(() => {
  console.log('⏰ 타임아웃 - 종료');
  process.exit(1);
}, 15000);
