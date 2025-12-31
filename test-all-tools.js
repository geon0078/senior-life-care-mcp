// 모든 도구 테스트 스크립트
import { handlePensionTool } from './dist/tools/pension/index.js';
import { handleHealthTool } from './dist/tools/health/index.js';
import { handleCareTool } from './dist/tools/care/index.js';
import { handleLeisureTool } from './dist/tools/leisure/index.js';
import { handleLivingTool } from './dist/tools/living/index.js';
import { handleSafetyTool } from './dist/tools/safety/index.js';

const testCases = [
  // 연금/복지 (4개)
  { category: 'pension', name: 'check_basic_pension', args: { age: 70, household_type: 'single' }, handler: handlePensionTool },
  { category: 'pension', name: 'calculate_national_pension', args: { age: 65, contribution_years: 20, average_income: 2500000 }, handler: handlePensionTool },
  { category: 'pension', name: 'check_disability_pension', args: { disability_grade: 1, age: 65 }, handler: handlePensionTool },
  { category: 'pension', name: 'check_veteran_benefits', args: { veteran_type: 'general' }, handler: handlePensionTool },

  // 건강/의료 (5개)
  { category: 'health', name: 'check_health_screening', args: { age: 70, gender: 'male' }, handler: handleHealthTool },
  { category: 'health', name: 'find_dementia_center', args: { region: '서울 강남구' }, handler: handleHealthTool },
  { category: 'health', name: 'dementia_self_check', args: { answers: [1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1] }, handler: handleHealthTool },
  { category: 'health', name: 'find_senior_hospital', args: { region: '서울 강남구', department: 'internal' }, handler: handleHealthTool },
  { category: 'health', name: 'check_medical_expense_support', args: { income_level: 'low', has_chronic_disease: true }, handler: handleHealthTool },

  // 돌봄/요양 (4개)
  { category: 'care', name: 'check_long_term_care', args: { age: 75, care_needs: 'high' }, handler: handleCareTool },
  { category: 'care', name: 'find_care_service', args: { region: '서울 강남구', service_type: 'home_care' }, handler: handleCareTool },
  { category: 'care', name: 'find_nursing_home', args: { region: '서울 강남구', facility_type: 'nursing_home' }, handler: handleCareTool },
  { category: 'care', name: 'check_caregiver_support', args: { caregiver_type: 'family' }, handler: handleCareTool },

  // 여가/문화 (3개)
  { category: 'leisure', name: 'find_senior_center', args: { region: '서울 강남구', facility_type: 'all' }, handler: handleLeisureTool },
  { category: 'leisure', name: 'get_welfare_programs', args: { region: '서울 강남구', category: 'health' }, handler: handleLeisureTool },
  { category: 'leisure', name: 'find_senior_education', args: { region: '서울 강남구', subject: '스마트폰' }, handler: handleLeisureTool },

  // 생활지원 (2개)
  { category: 'living', name: 'check_housing_support', args: { housing_type: 'rental', income_level: 'low', living_alone: true }, handler: handleLivingTool },
  { category: 'living', name: 'find_meal_service', args: { region: '서울 강남구', service_type: 'all' }, handler: handleLivingTool },

  // 안전/긴급 (2개)
  { category: 'safety', name: 'emergency_contacts', args: { category: 'all' }, handler: handleSafetyTool },
  { category: 'safety', name: 'check_safety_service', args: { living_alone: true, has_chronic_disease: true, region: '서울 강남구' }, handler: handleSafetyTool },
];

async function runTests() {
  console.log('='.repeat(60));
  console.log('시니어 라이프 케어 MCP - 전체 도구 테스트');
  console.log('='.repeat(60));
  console.log(`총 ${testCases.length}개 도구 테스트 시작\n`);

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    try {
      console.log(`\n${'─'.repeat(50)}`);
      console.log(`[${test.category.toUpperCase()}] ${test.name}`);
      console.log(`입력: ${JSON.stringify(test.args)}`);
      console.log('─'.repeat(50));

      const result = await test.handler(test.name, test.args);

      if (result && result.content && result.content.length > 0) {
        const text = result.content[0].text;
        // 처음 500자만 출력
        const preview = text.length > 500 ? text.substring(0, 500) + '...' : text;
        console.log(preview);
        console.log(`\n✅ 성공 (응답 길이: ${text.length}자)`);
        passed++;
      } else {
        console.log('⚠️ 응답 없음');
        failed++;
      }
    } catch (error) {
      console.log(`❌ 실패: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('테스트 결과 요약');
  console.log('='.repeat(60));
  console.log(`✅ 성공: ${passed}개`);
  console.log(`❌ 실패: ${failed}개`);
  console.log(`📊 성공률: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
}

runTests().catch(console.error);
