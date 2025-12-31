import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { findRegionData } from "../../utils/regionMatcher.js";

// 일자리 관련 도구 정의
export const jobsTools: Tool[] = [
  {
    name: "find_senior_jobs",
    description: "어르신 일자리 사업을 안내합니다. 공익활동, 사회서비스형, 시장형 등 다양한 노인일자리 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        job_type: {
          type: "string",
          enum: ["public", "social", "market", "all"],
          description: "일자리 유형 (public: 공익활동, social: 사회서비스형, market: 시장형, all: 전체)",
        },
        age: {
          type: "number",
          description: "나이",
        },
      },
      required: [],
    },
  },
  {
    name: "check_job_training",
    description: "어르신 직업훈련 및 교육 프로그램을 안내합니다. 취업 연계 교육, 창업 교육 등을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        interest: {
          type: "string",
          description: "관심 분야 (예: 요양보호사, 바리스타, 사무직 등)",
        },
      },
      required: [],
    },
  },
  {
    name: "find_senior_club",
    description: "시니어클럽 및 노인인력개발센터를 찾아드립니다. 일자리 연계, 창업 지원 기관 정보를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
      },
      required: ["region"],
    },
  },
];

// 일자리 도구 핸들러
export async function handleJobsTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "find_senior_jobs":
      return findSeniorJobs(args);
    case "check_job_training":
      return checkJobTraining(args);
    case "find_senior_club":
      return findSeniorClub(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 노인 일자리 찾기
async function findSeniorJobs(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const jobType = (args?.job_type as string) || "all";
  const age = (args?.age as number) || 65;

  let jobInfo = "";

  if (jobType === "all" || jobType === "public") {
    jobInfo += `
📋 공익활동형 (가장 많은 일자리)

🔹 대상: 만 65세 이상
🔹 활동: 월 30~50시간
🔹 급여: 월 27~29만원

📌 활동 종류:
• 노노케어: 독거노인 안부 확인, 말벗
• 스쿨존 지킴이: 학교 앞 교통안전 봉사
• 환경지킴이: 공원, 거리 환경 정화
• 공공시설 봉사: 도서관, 복지관 업무 보조
• 경륜전수: 초등학생 돌봄, 학습 지도

✅ 장점:
• 안정적인 월급
• 사회공헌 보람
• 건강 유지

`;
  }

  if (jobType === "all" || jobType === "social") {
    jobInfo += `
💼 사회서비스형

🔹 대상: 만 65세 이상
🔹 활동: 월 60시간 이상
🔹 급여: 월 59~71만원

📌 활동 종류:
• 아이돌보미: 손자녀 또래 아이 돌봄
• 장애인 활동 보조: 장애인 일상 지원
• 시니어 컨설턴트: 경력 활용 멘토링
• 취약계층 지원: 복지서비스 연계

✅ 장점:
• 공익활동보다 높은 급여
• 전문성 활용 가능

`;
  }

  if (jobType === "all" || jobType === "market") {
    jobInfo += `
🏪 시장형/취업알선형

🔹 대상: 만 60세 이상
🔹 활동: 기업/매장에서 근무
🔹 급여: 최저임금 이상 (시급제/월급제)

📌 일자리 종류:

1️⃣ 시장형 사업단
   • 식품제조 (반찬, 도시락)
   • 세차장, 주차장 관리
   • 카페, 매점 운영
   • 택배, 배송

2️⃣ 취업알선형
   • 아파트 경비
   • 건물 청소
   • 주유소, 편의점
   • 요양보호사

✅ 장점:
• 일반 시장 수준 급여
• 정규 근무 경험

`;
  }

  const result = `
👴 ${region ? region + " " : ""}어르신 일자리 안내

${age < 60 ? "⚠️ 노인일자리는 만 60세 이상부터 참여 가능해요.\n" : ""}

${jobInfo}

📝 신청 방법:

1️⃣ 노인일자리 통합관리시스템
   • www.seniorno.or.kr
   • 온라인으로 지원 가능

2️⃣ 수행기관 방문
   • 노인복지관
   • 시니어클럽
   • 대한노인회
   • 구청 노인복지과

📅 모집 시기:
• 공익활동: 매년 12월~1월 (연초 시작)
• 사회서비스형: 수시 모집
• 시장형: 상시 모집

📌 준비물:
• 신분증
• 주민등록등본
• 통장사본

📞 일자리 상담:
• 노인일자리 상담: 1661-3030
• ${region || "지역"} 시니어클럽
• ${region || "지역"} 노인복지관

💡 팁: 인기 있는 일자리는 빨리 마감돼요!
12월~1월에 미리 신청하세요!

일자리 신청 도와드릴까요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 직업훈련 안내
async function checkJobTraining(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const interest = (args?.interest as string) || "";

  let trainingInfo = "";

  // 관심 분야별 훈련 정보
  if (!interest || interest.includes("요양") || interest.includes("돌봄")) {
    trainingInfo += `
👨‍⚕️ 요양보호사 자격증 과정

• 교육 기간: 240시간 (약 1.5~2개월)
• 비용: 약 40~50만원 (국비지원 시 무료)
• 자격: 별도 제한 없음

📋 교육 내용:
• 요양보호 개론
• 신체활동 지원
• 가사 및 일상생활 지원
• 치매 케어

💰 취업 후 급여:
• 시설: 월 200~230만원
• 재가: 시급 15,000~17,000원

💡 국비지원 받으려면:
• 고용센터 내일배움카드 신청
• 복지관 무료 교육 과정

`;
  }

  if (!interest || interest.includes("바리스타") || interest.includes("카페")) {
    trainingInfo += `
☕ 바리스타/카페 과정

• 교육 기간: 1~3개월
• 비용: 무료~30만원 (국비지원)
• 자격: 바리스타 2급 자격증

📋 교육 내용:
• 커피 이론
• 에스프레소 추출
• 라떼 아트
• 카페 운영

💰 취업처:
• 시니어 카페
• 복지관 카페
• 일반 카페 (시간제)

`;
  }

  if (!interest || interest.includes("컴퓨터") || interest.includes("사무")) {
    trainingInfo += `
💻 컴퓨터/사무 과정

• 교육 기간: 1~3개월
• 비용: 무료 (국비지원)
• 자격: ITQ, 컴퓨터활용능력

📋 교육 내용:
• 한글, 엑셀, 파워포인트
• 인터넷 활용
• 문서작성
• 사무보조

💰 취업처:
• 복지관 사무보조
• 아파트 관리사무소
• 일반 사무직

`;
  }

  if (!interest) {
    trainingInfo += `
🎨 기타 인기 과정

• 전통음식 조리사
• 반찬가게 창업
• 실버시터 (아이돌봄)
• 청소/세탁 전문가
• 원예치료사
• 숲해설가

`;
  }

  const result = `
📚 ${region ? region + " " : ""}어르신 직업훈련 안내

${interest ? `🔍 "${interest}" 관련 훈련 과정:\n` : ""}

${trainingInfo}

🏫 교육 기관:

1️⃣ 한국노인인력개발원
   • 시니어 맞춤형 직업훈련
   • www.kordi.or.kr

2️⃣ 시니어클럽
   • 창업 교육
   • 취업 연계 훈련

3️⃣ 직업훈련기관
   • 폴리텍 (50+)
   • 고용센터 내일배움카드

4️⃣ 평생교육원
   • 대학 부설 교육원
   • 자격증 과정

💳 국비지원 받는 방법:

1. 고용센터 방문 (1350)
2. 내일배움카드 발급
3. 원하는 과정 수강
4. 훈련비 지원 (최대 300만원)

📞 직업훈련 상담:
• 고용노동부: 1350
• 시니어클럽: ${region || "지역"} 시니어클럽
• 노인복지관: ${region || "지역"} 노인복지관

💡 50세 이상은 내일배움카드로
무료 또는 저렴하게 교육받을 수 있어요!

관심있는 분야가 있으시면 더 자세히 알려드릴게요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 시니어클럽 찾기
async function findSeniorClub(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";

  // 지역별 시니어클럽 예시 데이터
  const seniorClubs: Record<string, { name: string; address: string; phone: string }[]> = {
    "서울": [
      { name: "서울시니어클럽", address: "서울시 중구 정동길 21", phone: "02-2075-0420" },
      { name: "강남시니어클럽", address: "서울시 강남구 학동로 426", phone: "02-547-3930" },
    ],
    "강남구": [
      { name: "강남시니어클럽", address: "서울시 강남구 학동로 426", phone: "02-547-3930" },
    ],
    "부산": [
      { name: "부산시니어클럽", address: "부산시 연제구 중앙대로 1000", phone: "051-866-5091" },
    ],
    "대구": [
      { name: "대구시니어클럽", address: "대구시 중구 국채보상로 139길", phone: "053-256-0092" },
    ],
  };

  // 유연한 지역 매칭 사용
  const regionResult = findRegionData(region, seniorClubs, "서울");
  const clubs = regionResult?.value || seniorClubs["서울"];
  const matchedRegion = regionResult?.key || "서울";
  const isMatched = regionResult?.matched || false;

  let result = `
🏢 ${region || "전국"} 시니어클럽 안내

`;

  if (isMatched) {
    result += `📍 "${matchedRegion}" 시니어클럽:\n\n`;
  } else if (region) {
    result += `💡 "${region}" 정확한 정보를 찾기 어려워요.\n"${matchedRegion}" 대표 센터 정보를 안내해 드릴게요.\n\n`;
  } else {
    result += `📍 대표 시니어클럽:\n\n`;
  }

  clubs.forEach((club, i) => {
    result += `${i + 1}. ${club.name}
   📍 ${club.address}
   📞 ${club.phone}

`;
  });

  result += `
🔹 시니어클럽이란?

어르신들의 일자리와 사회참여를 돕는 기관이에요.

📌 제공 서비스:

1️⃣ 일자리 사업
   • 공익활동형 일자리
   • 사회서비스형 일자리
   • 시장형 사업단

2️⃣ 창업 지원
   • 창업 교육
   • 창업 컨설팅
   • 사업단 운영

3️⃣ 취업 연계
   • 이력서 작성
   • 면접 코칭
   • 기업 연결

4️⃣ 교육 프로그램
   • 직무 교육
   • 역량 강화
   • 자격증 취득

🔍 시니어클럽 찾기:

1. 한국시니어클럽협회
   www.silverpower.or.kr

2. 노인일자리 여기
   www.seniorno.or.kr

3. 구청 노인복지과 문의

📞 시니어클럽 상담: 1661-3030

💡 시니어클럽은 전국 300개 이상 있어요!
가까운 곳에서 일자리를 찾아보세요.

시니어클럽 방문 예약 도와드릴까요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
