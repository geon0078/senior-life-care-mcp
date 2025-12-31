import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 안전/긴급 관련 도구 정의
export const safetyTools: Tool[] = [
  {
    name: "emergency_contacts",
    description: "어르신에게 필요한 긴급 연락처를 안내합니다. 응급상황, 복지상담, 신고 전화번호를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["emergency", "welfare", "report", "all"],
          description: "연락처 분류 (emergency: 응급, welfare: 복지상담, report: 신고, all: 전체)",
        },
      },
      required: [],
    },
  },
  {
    name: "check_safety_service",
    description: "독거노인 안전확인 서비스를 안내합니다. 정기 안부확인, 응급안전알림, 가스안전 서비스 등을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        living_alone: {
          type: "boolean",
          description: "독거 여부",
        },
        has_chronic_disease: {
          type: "boolean",
          description: "만성질환 보유 여부",
        },
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
      },
      required: [],
    },
  },
];

// 안전/긴급 도구 핸들러
export async function handleSafetyTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "emergency_contacts":
      return getEmergencyContacts(args);
    case "check_safety_service":
      return checkSafetyService(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 긴급 연락처 안내
async function getEmergencyContacts(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const category = (args?.category as string) || "all";

  let contactInfo = "";

  if (category === "all" || category === "emergency") {
    contactInfo += `
🚨 응급 연락처 (24시간)

📞 119 - 소방/응급/구급
   • 화재, 구조, 응급환자
   • 가슴 통증, 호흡곤란, 의식 잃음
   • 낙상, 골절 등 응급상황

📞 112 - 경찰
   • 범죄 신고
   • 실종 신고
   • 교통사고

📞 1339 - 응급의료 상담
   • 24시간 의료 상담
   • 응급실 안내
   • 응급처치 안내

📞 109 - 자살예방 상담
   • 24시간 상담
   • 위기상담
   • 심리상담 연결

💡 응급상황 대처 요령:
• 당황하지 마시고 천천히 말씀하세요
• 주소를 먼저 말씀하세요
• 전화 끊지 말고 안내를 따르세요

`;
  }

  if (category === "all" || category === "welfare") {
    contactInfo += `
💚 복지 상담 연락처

📞 129 - 보건복지콜센터
   • 복지 서비스 종합 안내
   • 연금, 의료, 돌봄 상담
   • 긴급복지 지원 연결
   • 운영: 24시간

📞 1577-1000 - 노인돌봄서비스
   • 독거노인 돌봄 상담
   • 응급안전알림 서비스
   • 안전확인 서비스
   • 운영: 평일 09:00~18:00

📞 1899-9988 - 중앙치매센터
   • 치매 상담
   • 치매환자 돌봄 안내
   • 실종 예방 등록
   • 운영: 24시간

📞 1644-8013 - 노인장기요양보험
   • 장기요양등급 안내
   • 요양서비스 상담
   • 운영: 평일 09:00~18:00

📞 1355 - 국민연금
   • 연금 수령 상담
   • 가입/납부 문의
   • 운영: 평일 09:00~18:00

📞 1577-1000 - 건강보험
   • 건강보험 상담
   • 건강검진 안내
   • 운영: 평일 09:00~18:00

`;
  }

  if (category === "all" || category === "report") {
    contactInfo += `
📢 신고 연락처

📞 1577-0199 - 노인학대 신고
   • 노인 학대 신고
   • 긴급 보호 요청
   • 운영: 24시간
   • 신고자 비밀 보장

📞 182 - 실종자 신고
   • 어르신 실종 신고
   • 치매환자 찾기
   • 운영: 24시간

📞 110 - 정부민원 상담
   • 각종 민원 상담
   • 복지제도 문의
   • 운영: 평일 09:00~18:00

📞 1600-1004 - 주거복지 상담
   • 임대주택 상담
   • 주거급여 문의
   • 운영: 평일 09:00~18:00

📞 1350 - 고용노동부
   • 노인 일자리 문의
   • 고용 상담
   • 운영: 평일 09:00~18:00

`;
  }

  const result = `
📱 어르신을 위한 긴급/상담 연락처

${contactInfo}

💡 연락처 저장 팁:

1️⃣ 휴대폰에 저장해두세요
   • 119, 112, 129는 꼭 기억하세요!

2️⃣ 냉장고나 전화기 옆에 붙여두세요
   • 긴급 연락처 목록 출력

3️⃣ 가족에게도 알려주세요
   • 자녀/보호자와 공유

🆘 응급상황에는 주저하지 말고
119에 전화하세요!

더 필요한 연락처가 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 독거노인 안전서비스 확인
async function checkSafetyService(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const livingAlone = (args?.living_alone as boolean) || false;
  const hasChronicDisease = (args?.has_chronic_disease as boolean) || false;
  const region = (args?.region as string) || "";

  let safetyInfo = "";

  // 기본 안전서비스 안내
  safetyInfo += `
🏠 독거노인 안전확인 서비스

📋 서비스 대상:
• 만 65세 이상 독거 어르신
• 소득 기준 없음 (누구나 신청 가능)
• 거동 불편, 건강 취약 어르신 우선

`;

  if (livingAlone || !args?.living_alone) {
    safetyInfo += `
📞 노인맞춤돌봄서비스 (무료)

1️⃣ 안전확인 서비스
   • 주 1~3회 전화 안부 확인
   • 주 1회 방문 안전 확인
   • 생활실태 점검
   • 신청: 주민센터, 129

2️⃣ 생활지원 서비스
   • 식사 지원 연계
   • 외출 동행
   • 가사 지원 연계
   • 신청: 주민센터

3️⃣ 사회참여 서비스
   • 문화여가 활동
   • 자조모임 연결
   • 평생교육 연계
   • 신청: 복지관, 주민센터

`;
  }

  if (hasChronicDisease || !args?.has_chronic_disease) {
    safetyInfo += `
🚨 응급안전알림 서비스 (무료)

• 대상: 독거노인, 장애인
• 내용: 24시간 응급 모니터링

📱 제공 장비:
• 응급호출기 (목걸이형)
• 화재/가스 감지기
• 활동 감지 센서

💡 작동 방식:
1. 응급 버튼 누르면 → 119 자동 연결
2. 화재/가스 감지 → 자동 신고
3. 일정 시간 움직임 없으면 → 안전 확인

📞 신청: 주민센터, 1577-1000

`;
  }

  safetyInfo += `
🔥 가스안전 서비스

• 대상: 저소득 독거 어르신
• 내용: 가스 안전 점검 및 장치 설치

📌 제공 서비스:
• 가스 안전 점검 (무료)
• 가스타이머 설치
• 가스누출 차단기 설치
• 노후 배관 교체 지원

📞 신청: 한국가스안전공사 1544-4500

🚗 이동지원 서비스

• 대상: 거동 불편 어르신
• 내용: 병원, 관공서 이동 지원

📌 서비스 종류:
• 복지콜 차량 (장애인/고령자)
• 지자체 어르신 이동 서비스
• 복지관 셔틀버스

📞 신청: 구청 노인복지과, 복지관

`;

  const result = `
🛡️ ${region ? region + " " : ""}어르신 안전 서비스 안내

${safetyInfo}

📝 안전 서비스 신청 방법:

1️⃣ 주민센터 방문
   • 노인맞춤돌봄서비스 신청
   • 응급안전알림 신청
   • 가장 빠른 방법!

2️⃣ 129 전화 (보건복지콜센터)
   • 서비스 안내 및 신청
   • 24시간 상담 가능

3️⃣ 복지로 (www.bokjiro.go.kr)
   • 온라인 신청
   • 서비스 조회

4️⃣ 노인돌봄서비스 1577-1000
   • 돌봄서비스 전문 상담

${livingAlone ? `
💡 독거 어르신이시라면:
응급안전알림 서비스를 꼭 신청하세요!
버튼 하나로 119에 연결됩니다.
` : ""}

${hasChronicDisease ? `
💊 만성질환이 있으시다면:
정기적인 안전확인 서비스와
응급알림 서비스를 함께 이용하세요!
` : ""}

안전 서비스 관련 더 궁금한 점 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
