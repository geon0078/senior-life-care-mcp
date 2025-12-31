import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 돌봄/요양 관련 도구 정의
export const careTools: Tool[] = [
  {
    name: "check_long_term_care",
    description: "장기요양등급 판정 기준과 서비스를 안내합니다. 어르신의 상태에 따른 예상 등급과 받을 수 있는 서비스를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        mobility: {
          type: "string",
          enum: ["independent", "assisted", "dependent"],
          description: "거동 상태 (independent: 혼자 가능, assisted: 도움 필요, dependent: 완전 의존)",
        },
        daily_activities: {
          type: "string",
          enum: ["independent", "partial", "dependent"],
          description: "일상생활 수행 (independent: 독립, partial: 부분 도움, dependent: 전적 도움)",
        },
        cognitive_state: {
          type: "string",
          enum: ["normal", "mild", "moderate", "severe"],
          description: "인지 상태 (normal: 정상, mild: 경증, moderate: 중등, severe: 중증)",
        },
      },
      required: [],
    },
  },
  {
    name: "find_care_service",
    description: "노인돌봄서비스를 찾아드립니다. 지역사회 돌봄, 방문요양, 주야간보호 등 다양한 돌봄서비스를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        service_type: {
          type: "string",
          enum: ["home_visit", "day_care", "short_stay", "all"],
          description: "서비스 유형 (home_visit: 방문돌봄, day_care: 주간보호, short_stay: 단기보호, all: 전체)",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "find_nursing_home",
    description: "요양원 및 주간보호센터 정보를 찾아드립니다. 지역, 비용, 시설 등급 정보를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        facility_type: {
          type: "string",
          enum: ["nursing_home", "day_care_center", "group_home"],
          description: "시설 유형 (nursing_home: 요양원, day_care_center: 주간보호센터, group_home: 공동생활가정)",
        },
        budget: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "예산 수준",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "check_caregiver_support",
    description: "가족요양보호사 제도를 안내합니다. 가족이 직접 요양보호사가 되어 돌봄을 제공하고 급여를 받는 방법을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        relationship: {
          type: "string",
          description: "돌봄 대상과의 관계 (예: 자녀, 배우자, 며느리 등)",
        },
        care_recipient_grade: {
          type: "string",
          enum: ["1", "2", "3", "4", "5", "cognitive"],
          description: "돌봄 대상자 장기요양등급",
        },
      },
      required: [],
    },
  },
];

// 돌봄/요양 도구 핸들러
export async function handleCareTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_long_term_care":
      return checkLongTermCare(args);
    case "find_care_service":
      return findCareService(args);
    case "find_nursing_home":
      return findNursingHome(args);
    case "check_caregiver_support":
      return checkCaregiverSupport(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 장기요양등급 확인
async function checkLongTermCare(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const mobility = (args?.mobility as string) || "";
  const dailyActivities = (args?.daily_activities as string) || "";
  const cognitive = (args?.cognitive_state as string) || "";

  let estimatedGrade = "";
  let services = "";

  // 간단한 등급 예측 (실제로는 52개 항목 평가)
  if (mobility === "dependent" || cognitive === "severe") {
    estimatedGrade = "1~2등급";
    services = `
• 시설급여 (요양원 입소)
• 재가급여 (방문요양, 방문목욕, 방문간호)
• 주야간보호, 단기보호
• 복지용구 지원`;
  } else if (mobility === "assisted" || dailyActivities === "dependent" || cognitive === "moderate") {
    estimatedGrade = "3~4등급";
    services = `
• 재가급여 우선 (방문요양, 방문목욕)
• 주야간보호
• 복지용구 지원`;
  } else if (dailyActivities === "partial" || cognitive === "mild") {
    estimatedGrade = "5등급 또는 인지지원등급";
    services = `
• 주야간보호
• 방문요양 (일부)
• 인지활동형 프로그램`;
  } else {
    estimatedGrade = "등급 외 가능성";
    services = `
• 노인돌봄서비스 (비등급자 대상)
• 독거노인 생활지원
• 지역사회 통합돌봄`;
  }

  const result = `
📋 장기요양등급 안내

${mobility || dailyActivities || cognitive ? `
📊 입력하신 상태 기준:
${mobility ? `• 거동: ${mobility === "independent" ? "혼자 가능" : mobility === "assisted" ? "도움 필요" : "완전 의존"}` : ""}
${dailyActivities ? `• 일상생활: ${dailyActivities === "independent" ? "독립 수행" : dailyActivities === "partial" ? "부분 도움" : "전적 도움"}` : ""}
${cognitive ? `• 인지상태: ${cognitive === "normal" ? "정상" : cognitive === "mild" ? "경도" : cognitive === "moderate" ? "중등도" : "중증"}` : ""}

🎯 예상 등급: ${estimatedGrade}

📌 이용 가능 서비스:
${services}
` : ""}

🔹 장기요양등급이란?

만 65세 이상 또는 65세 미만 노인성 질환자 중
혼자서 일상생활이 어려운 분들에게 등급을 부여하고
요양서비스를 지원하는 제도예요.

📊 등급별 안내:
• 1등급: 95점 이상 (심신 기능 상태 장애로 전적 도움 필요)
• 2등급: 75~95점 미만 (상당 부분 도움 필요)
• 3등급: 60~75점 미만 (부분적 도움 필요)
• 4등급: 51~60점 미만 (일정 부분 도움 필요)
• 5등급: 45~51점 미만 (치매환자)
• 인지지원등급: 45점 미만 (치매환자)

📝 신청 방법:
1. 국민건강보험공단 방문 또는 전화 (1577-1000)
2. 신청서 작성 및 의사소견서 제출
3. 공단 직원 방문조사 (52개 항목)
4. 등급판정위원회 심의
5. 결과 통지 (신청 후 약 30일)

📞 장기요양 상담: 1577-1000

더 자세한 정보가 필요하시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 돌봄서비스 찾기
async function findCareService(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const serviceType = (args?.service_type as string) || "all";

  let serviceInfo = "";

  if (serviceType === "all" || serviceType === "home_visit") {
    serviceInfo += `
🏠 방문돌봄서비스

1️⃣ 노인맞춤돌봄서비스 (무료/저렴)
   • 대상: 만 65세 이상 돌봄 필요 어르신
   • 내용: 안부확인, 가사지원, 외출동행
   • 신청: 주민센터, 복지관

2️⃣ 방문요양서비스 (장기요양)
   • 대상: 장기요양등급 받은 분
   • 내용: 신체활동, 가사, 인지활동
   • 신청: 장기요양기관

3️⃣ 방문목욕서비스
   • 대상: 장기요양등급 받은 분
   • 내용: 가정에서 목욕 서비스

`;
  }

  if (serviceType === "all" || serviceType === "day_care") {
    serviceInfo += `
🌅 주간보호서비스

• 대상: 장기요양등급 받은 분
• 내용: 낮 시간 동안 보호, 식사, 프로그램
• 시간: 보통 오전 9시 ~ 오후 6시
• 비용: 등급에 따라 본인부담 15%
• 장점: 가족 부담 경감, 사회활동 참여

`;
  }

  if (serviceType === "all" || serviceType === "short_stay") {
    serviceInfo += `
🏨 단기보호서비스

• 대상: 장기요양등급 받은 분
• 내용: 단기간(월 9일 한도) 시설 이용
• 용도: 보호자 여행, 휴식, 긴급 상황
• 비용: 등급에 따라 본인부담 20%

`;
  }

  const result = `
👴 ${region} 노인돌봄서비스 안내

${serviceInfo}

📍 ${region} 지역 서비스 찾기:

1️⃣ 주민센터 (동사무소)
   • 노인맞춤돌봄서비스 신청
   • 돌봄서비스 상담

2️⃣ 노인복지관
   • 다양한 돌봄 프로그램
   • 재가서비스 연계

3️⃣ 장기요양기관
   • 방문요양, 주간보호 등
   • www.longtermcare.or.kr 에서 검색

📞 상담 연락처:
• 노인돌봄 종합안내: 129
• 장기요양 상담: 1577-1000
• ${region} 노인복지관: 지역번호 + 114 문의

어떤 서비스가 더 궁금하세요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 요양원/주간보호센터 찾기
async function findNursingHome(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const facilityType = (args?.facility_type as string) || "nursing_home";
  const budget = (args?.budget as string) || "";

  const facilityText =
    facilityType === "nursing_home" ? "요양원" :
    facilityType === "day_care_center" ? "주간보호센터" :
    facilityType === "group_home" ? "공동생활가정" : "요양시설";

  const result = `
🏥 ${region} ${facilityText} 찾기

📋 시설 유형별 안내:

🏠 요양원 (노인요양시설)
• 24시간 입소 생활
• 장기요양 1~2등급 우선
• 월 비용: 약 50~150만원 (본인부담)
• 국가 지원: 80~85% (등급에 따라)

🌞 주간보호센터
• 낮 시간만 이용 (가정에서 생활)
• 장기요양 전 등급 이용 가능
• 월 비용: 약 15~40만원 (본인부담)
• 국가 지원: 85% (등급에 따라)

🏘️ 공동생활가정 (그룹홈)
• 소규모 (5~9명) 가정 같은 분위기
• 치매어르신 특화
• 월 비용: 요양원과 비슷

${budget === "low" ? `
💰 비용 절감 팁:
• 국공립 시설 우선 신청
• 사회복지법인 운영 시설
• 본인부담금 경감 대상 확인 (기초수급자 등)
` : ""}

🔍 시설 검색 방법:

1️⃣ 장기요양기관 검색
   www.longtermcare.or.kr
   → 장기요양기관 → 지역 선택

2️⃣ 건강보험심사평가원
   www.hira.or.kr
   → 시설 평가등급 확인 (A~E등급)

3️⃣ 국민건강보험공단 상담
   ☎ 1577-1000
   → 맞춤 시설 추천

📌 시설 선택 체크리스트:
✓ 평가등급 (A등급 권장)
✓ 거리 (가족 방문 용이성)
✓ 시설 청결도
✓ 프로그램 다양성
✓ 의료진 상주 여부
✓ 식사 품질

💡 팁: 꼭 직접 방문해서 분위기를 확인하세요!

${region} 지역 추천 시설 정보가 필요하시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 가족요양보호사 지원 확인
async function checkCaregiverSupport(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const relationship = (args?.relationship as string) || "";
  const grade = (args?.care_recipient_grade as string) || "";

  const result = `
👨‍👩‍👧 가족요양보호사 제도 안내

가족이 직접 요양보호사 자격을 취득하여
어르신을 돌보고 급여를 받는 제도예요.

📋 자격 조건:

1️⃣ 요양보호사 자격증 취득
   • 교육: 240시간 → 가족돌봄 시 40시간
   • 비용: 약 40~50만원
   • 기간: 약 2~4주

2️⃣ 돌봄 대상자 조건
   • 장기요양등급 보유 (1~5등급, 인지지원등급)
   • 같은 가구 또는 가까운 거리 거주

${relationship ? `
📌 ${relationship}(으)로 가족요양 가능 여부:
• 배우자, 자녀, 며느리, 사위: 가능 ✓
• 형제자매: 가능 ✓
• 손자녀: 가능 (일부 제한)
` : ""}

💰 급여 안내:

${grade ? `
${grade}등급 기준 예상 급여:
` : "등급별 월 급여 (2024년 기준):"}

• 1등급: 월 약 60~90만원
• 2등급: 월 약 50~80만원
• 3등급: 월 약 40~60만원
• 4등급: 월 약 30~50만원
• 5등급: 월 약 25~40만원

⚠️ 가족요양 제한사항:
• 1일 60분 인정 (일반 요양보호사 대비 축소)
• 신체활동 중심 (가사활동 제한)
• 수급자 1인당 1명만 가능

📝 신청 절차:

1. 요양보호사 교육기관 등록 (40시간)
2. 자격시험 응시 및 합격
3. 장기요양기관에 취업
4. 급여 청구 및 수령

📞 상담 연락처:
• 국민건강보험공단: 1577-1000
• 요양보호사 교육기관 문의: 지역 노인복지관

가족요양 시작하시려면 더 자세히 안내해 드릴까요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
