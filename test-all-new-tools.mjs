// 신규 도구 전체 테스트
import http from 'http';

const BASE_URL = 'http://localhost:3000';
let sessionId = null;
let testResults = [];

// SSE 연결
function connectSSE() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/sse`, (res) => {
      res.on('data', (chunk) => {
        const data = chunk.toString();
        const match = data.match(/sessionId=([a-zA-Z0-9-]+)/);
        if (match && !sessionId) {
          sessionId = match[1];
          resolve(res);
        }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

// 메시지 전송
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(message);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: `/messages?sessionId=${sessionId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// SSE 응답 대기
function waitForResponse(sseRes, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), timeout);

    const handler = (chunk) => {
      const data = chunk.toString();
      const jsonMatch = data.match(/data: ({.*})/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.result) {
            clearTimeout(timer);
            sseRes.removeListener('data', handler);
            resolve(parsed);
          }
        } catch (e) {}
      }
    };

    sseRes.on('data', handler);
  });
}

// 도구 테스트
async function testTool(sseRes, name, args, description) {
  console.log(`\n📋 ${description}`);
  console.log(`   도구: ${name}`);

  const message = {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: { name, arguments: args }
  };

  await sendMessage(message);

  try {
    const response = await waitForResponse(sseRes, 5000);
    const text = response.result?.content?.[0]?.text || '';
    const preview = text.substring(0, 150).replace(/\n/g, ' ');
    console.log(`   ✅ 성공: ${preview}...`);
    testResults.push({ name, status: 'success' });
  } catch (e) {
    console.log(`   ❌ 실패: ${e.message}`);
    testResults.push({ name, status: 'failed' });
  }
}

async function main() {
  console.log('🚀 신규 MCP 도구 테스트 시작\n');
  console.log('=' .repeat(60));

  try {
    // 연결
    const sseRes = await connectSSE();
    console.log(`✅ SSE 연결 성공 (세션: ${sessionId})`);

    // 초기화
    await sendMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0.0' }
      }
    });
    await waitForResponse(sseRes);
    console.log('✅ 초기화 완료\n');

    await sendMessage({ jsonrpc: '2.0', method: 'notifications/initialized' });
    await new Promise(r => setTimeout(r, 300));

    // === 교통 도구 테스트 ===
    console.log('\n🚗 교통/이동 도구 테스트');
    console.log('-'.repeat(40));

    await testTool(sseRes, 'check_transport_benefits',
      { age: 70, region: '서울' },
      '교통 혜택 확인');

    await testTool(sseRes, 'find_call_taxi',
      { region: '서울' },
      '콜택시 서비스 찾기');

    await testTool(sseRes, 'check_driving_license',
      { age: 75, has_license: true },
      '운전면허 정보 확인');

    // === 금융 도구 테스트 ===
    console.log('\n\n💰 금융/세금 도구 테스트');
    console.log('-'.repeat(40));

    await testTool(sseRes, 'check_tax_benefits',
      { age: 70 },
      '세금 혜택 확인');

    await testTool(sseRes, 'check_utility_discount',
      { region: '서울', household_type: 'single' },
      '공과금 할인 확인');

    await testTool(sseRes, 'check_financial_support',
      { region: '서울' },
      '금융 지원 정보');

    // === 일자리 도구 테스트 ===
    console.log('\n\n👔 일자리 도구 테스트');
    console.log('-'.repeat(40));

    await testTool(sseRes, 'find_senior_jobs',
      { region: '서울', job_type: 'public', age: 68 },
      '노인 일자리 찾기');

    await testTool(sseRes, 'check_job_training',
      { region: '서울', interest: '바리스타' },
      '직업훈련 프로그램');

    await testTool(sseRes, 'find_senior_club',
      { region: '강남구' },
      '시니어클럽 찾기');

    // === 법률/상담 도구 테스트 ===
    console.log('\n\n⚖️ 법률/상담 도구 테스트');
    console.log('-'.repeat(40));

    await testTool(sseRes, 'find_legal_aid',
      { region: '서울', issue_type: 'inheritance' },
      '법률 상담 서비스');

    await testTool(sseRes, 'check_inheritance_info',
      {},
      '상속 정보 안내');

    await testTool(sseRes, 'find_counseling_service',
      { region: '서울' },
      '심리상담 서비스');

    await testTool(sseRes, 'check_elder_abuse',
      {},
      '노인학대 정보');

    // 결과 요약
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 테스트 결과 요약');
    console.log('='.repeat(60));

    const success = testResults.filter(r => r.status === 'success').length;
    const failed = testResults.filter(r => r.status === 'failed').length;

    console.log(`✅ 성공: ${success}개`);
    console.log(`❌ 실패: ${failed}개`);
    console.log(`📋 총계: ${testResults.length}개 도구 테스트 완료`);

    if (failed > 0) {
      console.log('\n실패한 도구:');
      testResults.filter(r => r.status === 'failed').forEach(r => {
        console.log(`  - ${r.name}`);
      });
    }

    sseRes.destroy();
    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ 오류:', error.message);
    process.exit(1);
  }
}

main();
