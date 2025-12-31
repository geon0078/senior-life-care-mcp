import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 생활지원 관련 도구 정의
export const livingTools: Tool[] = [
  {
    name: "check_housing_support",
    description: "어르신 주거지원 제도를 안내합니다. 주거급여, 주택개조, 임대주택 등 주거 관련 복지를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        housing_type: {
          type: "string",
          enum: ["owned", "rental", "public", "none"],
          description: "현재 주거 형태 (owned: 자가, rental: 임대, public: 공공임대, none: 무주택)",
        },
        income_level: {
          type: "string",
          enum: ["low", "middle", "high"],
          description: "소득 수준 (low: 저소득, middle: 중간, high: 고소득)",
        },
        living_alone: {
          type: "boolean",
          description: "독거 여부",
        },
      },
      required: [],
    },
  },
  {
    name: "find_meal_service",
    description: "경로식당과 도시락 배달 서비스를 찾아드립니다. 저렴하거나 무료로 식사할 수 있는 곳을 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구/동)",
        },
        service_type: {
          type: "string",
          enum: ["restaurant", "delivery", "all"],
          description: "서비스 유형 (restaurant: 경로식당, delivery: 도시락 배달, all: 전체)",
        },
      },
      required: ["region"],
    },
  },
];

// 생활지원 도구 핸들러
export async function handleLivingTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_housing_support":
      return checkHousingSupport(args);
    case "find_meal_service":
      return findMealService(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 주거지원 확인
async function checkHousingSupport(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const housingType = (args?.housing_type as string) || "";
  const incomeLevel = (args?.income_level as string) || "";
  const livingAlone = (args?.living_alone as boolean) || false;

  let housingInfo = "";

  if (incomeLevel === "low" || !incomeLevel) {
    housingInfo += `
🏠 저소득 어르신 주거지원

1️⃣ 주거급여 (기초수급자/차상위)
   • 월세 지원: 지역별 최대 33만원
   • 수선유지비: 주택수리비 지원
   • 신청: 주민센터

2️⃣ 긴급복지 주거지원
   • 위기상황 시 임시거처 제공
   • 신청: 129 (보건복지콜센터)

3️⃣ 영구임대주택
   • 시세의 30% 수준 저렴
   • 기초수급자 우선
   • 신청: LH (1600-1004)

`;
  }

  if (livingAlone) {
    housingInfo += `
👴 독거노인 특별 지원

1️⃣ 주거환경 개선 사업
   • 도배, 장판, 보일러 수리
   • 난방비 지원
   • 신청: 주민센터

2️⃣ 고령자 주거 안전 지원
   • 안전손잡이 설치
   • 문턱 제거
   • 미끄럼 방지
   • 신청: 주민센터, 복지관

3️⃣ 독거노인 공동생활 홈
   • 여러 어르신이 함께 거주
   • 돌봄서비스 제공
   • 신청: 구청 노인복지과

`;
  }

  if (housingType === "rental" || !housingType) {
    housingInfo += `
🔑 임대주택 지원

1️⃣ 고령자복지주택
   • 만 65세 이상 우선
   • 복지서비스 연계
   • 신청: LH, SH

2️⃣ 매입임대주택
   • 시세의 30~50%
   • 수급자/저소득 우선
   • 신청: LH (1600-1004)

3️⃣ 전세임대주택
   • 전세금 대출 지원
   • 월 임대료만 납부
   • 신청: LH

`;
  }

  const result = `
🏡 어르신 주거지원 안내

${housingInfo}

📋 주거지원 신청 방법:

1️⃣ 주민센터 방문
   • 주거급여, 주거환경 개선

2️⃣ LH 마이홈 (www.myhome.go.kr)
   • 공공임대주택 신청

3️⃣ 복지로 (www.bokjiro.go.kr)
   • 주거복지 통합 안내

📞 상담 연락처:
• 주거복지 상담: 1600-1004 (LH)
• 보건복지콜센터: 129
• 긴급복지: 129

${livingAlone ? "\n💡 독거 어르신은 여러 지원을 동시에 받으실 수 있어요!" : ""}

더 궁금한 점 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 급식 서비스 찾기
async function findMealService(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const serviceType = (args?.service_type as string) || "all";

  let mealInfo = "";

  if (serviceType === "all" || serviceType === "restaurant") {
    mealInfo += `
🍚 경로식당 (무료/저렴한 점심)

• 이용 대상: 만 60~65세 이상 어르신
• 이용 시간: 점심 (11:30~13:00)
• 이용 비용: 무료 ~ 1,000원

📍 경로식당 찾는 방법:
1. 주민센터에 문의
2. 노인복지관 경로식당
3. 종교단체 무료급식소

💡 경로식당 이용 팁:
• 회원 등록 필요한 곳도 있어요
• 사전 예약이 필요한 곳도 있어요
• 주말은 운영 안 하는 곳이 많아요

`;
  }

  if (serviceType === "all" || serviceType === "delivery") {
    mealInfo += `
🚗 도시락 배달 서비스

• 이용 대상: 거동 불편, 독거 어르신
• 배달 시간: 점심/저녁
• 비용: 무료 (저소득), 일부 부담 (일반)

📋 도시락 배달 종류:

1️⃣ 재가노인 식사배달
   • 장기요양등급자
   • 주 3~5회 배달
   • 신청: 장기요양기관

2️⃣ 독거노인 도시락
   • 저소득 독거 어르신
   • 무료 또는 저렴
   • 신청: 주민센터

3️⃣ 민간 도시락 서비스
   • 사회복지법인, 종교단체
   • 대부분 무료
   • 신청: 복지관, 주민센터

`;
  }

  const result = `
🍱 ${region} 어르신 급식 서비스 안내

${mealInfo}

📞 급식 서비스 신청:

1️⃣ 주민센터
   • 독거노인 도시락 신청
   • 경로식당 안내

2️⃣ 노인복지관
   • 경로식당 이용
   • 반찬 나눔 서비스

3️⃣ 129 (보건복지콜센터)
   • 급식 서비스 종합 안내

📍 ${region} 경로식당/급식소:
• ${region} 주민센터: 지역번호 + 114 문의
• ${region} 노인복지관 경로식당

⏰ 식사 시간:
• 점심: 11:30 ~ 13:00 (가장 많음)
• 저녁: 17:00 ~ 18:30 (일부)

💡 혼자 계신 어르신이라면:
도시락 배달 신청해보세요!
주민센터에서 도와드려요.

식사 관련 더 도움이 필요하시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
