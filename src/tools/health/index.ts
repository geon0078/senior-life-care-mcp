import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { findRegionData } from "../../utils/regionMatcher.js";

// 건강/의료 관련 도구 정의
export const healthTools: Tool[] = [
  {
    name: "check_health_screening",
    description: "무료 건강검진 대상 여부와 일정을 확인합니다. 국가건강검진 대상자 여부, 검진 항목, 가까운 검진기관을 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        age: {
          type: "number",
          description: "나이",
        },
        gender: {
          type: "string",
          enum: ["male", "female"],
          description: "성별 (male: 남성, female: 여성)",
        },
        region: {
          type: "string",
          description: "지역 (시/구/동)",
        },
      },
      required: ["age"],
    },
  },
  {
    name: "find_dementia_center",
    description: "가까운 치매안심센터를 찾아드립니다. 무료 치매 검진, 상담, 돌봄 서비스를 제공하는 센터 정보를 안내합니다.",
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
  {
    name: "dementia_self_check",
    description: "간단한 치매 자가진단을 진행합니다. KDSQ-P(한국형 치매 선별 설문) 기반으로 치매 위험도를 확인할 수 있습니다.",
    inputSchema: {
      type: "object",
      properties: {
        start: {
          type: "boolean",
          description: "자가진단 시작 여부",
        },
        answers: {
          type: "array",
          items: { type: "number" },
          description: "각 질문에 대한 답변 (0: 아니오, 1: 가끔, 2: 자주)",
        },
      },
      required: [],
    },
  },
  {
    name: "find_senior_hospital",
    description: "노인전문병원 및 요양병원을 찾아드립니다. 지역, 진료과목별로 적합한 병원 정보를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        department: {
          type: "string",
          description: "진료과목 (예: 내과, 재활의학과, 신경과 등)",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "check_medical_expense_support",
    description: "의료비 지원제도를 안내합니다. 어르신을 위한 다양한 의료비 감면 및 지원 제도를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        income_level: {
          type: "string",
          enum: ["low", "middle", "high"],
          description: "소득 수준 (low: 저소득, middle: 중간, high: 고소득)",
        },
        disease_type: {
          type: "string",
          description: "질환 유형 (예: 암, 희귀질환, 만성질환 등)",
        },
      },
      required: [],
    },
  },
];

// 건강/의료 도구 핸들러
export async function handleHealthTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_health_screening":
      return checkHealthScreening(args);
    case "find_dementia_center":
      return findDementiaCenter(args);
    case "dementia_self_check":
      return dementiaSelfCheck(args);
    case "find_senior_hospital":
      return findSeniorHospital(args);
    case "check_medical_expense_support":
      return checkMedicalExpenseSupport(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 건강검진 확인
async function checkHealthScreening(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const age = (args?.age as number) || 65;
  const gender = (args?.gender as string) || "male";
  const region = (args?.region as string) || "";

  const genderText = gender === "female" ? "여성" : "남성";
  const isEvenYear = new Date().getFullYear() % 2 === 0;
  const birthYearEven = age % 2 === 0;

  // 올해 검진 대상자인지 확인 (짝수년생-짝수년도, 홀수년생-홀수년도)
  const isTargetYear = birthYearEven === isEvenYear;

  let result = `
🏥 ${age}세 ${genderText} 건강검진 안내

`;

  if (isTargetYear) {
    result += `✅ 올해 국가건강검진 대상자세요!\n\n`;
  } else {
    result += `📅 올해는 검진 대상이 아니에요. 내년에 검진 받으실 수 있어요.\n\n`;
  }

  result += `
📋 검진 항목 (${age}세 기준):

🔹 일반건강검진 (2년마다)
• 신체계측, 혈압, 혈액검사
• 시력, 청력 검사
• 흉부 X-ray
• 구강검진

`;

  // 나이별 추가 검진
  if (age >= 40) {
    result += `🔹 암검진
• 위암: 2년마다 (40세 이상)
• 대장암: 1년마다 분변검사 (50세 이상)
• 간암: 6개월마다 (고위험군)
`;

    if (gender === "female") {
      result += `• 유방암: 2년마다 (40세 이상 여성)
• 자궁경부암: 2년마다 (20세 이상 여성)
`;
    }

    if (age >= 54 && gender === "male") {
      result += `• 폐암: 2년마다 (54~74세 고위험 흡연자)
`;
    }
  }

  if (age >= 66) {
    result += `
🔹 생애전환기 검진 (66세)
• 골밀도 검사 (여성)
• 노인신체기능검사
• 인지기능검사 (치매선별)
`;
  }

  result += `
📍 검진기관 찾기:
• 국민건강보험 홈페이지 (www.nhis.or.kr)
• 건강보험공단 고객센터: 1577-1000
${region ? `• "${region}" 지역 검진기관을 찾아드릴까요?` : "• 지역을 알려주시면 가까운 검진기관을 찾아드릴게요!"}

💡 검진 받으실 때:
• 검진 전날 저녁 9시 이후 금식
• 신분증 지참
• 편한 옷 착용

검진 예약 도움이 필요하시면 말씀해 주세요! 😊
`;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 치매안심센터 찾기
async function findDementiaCenter(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";

  // 실제로는 API 연동 필요, 여기서는 예시 데이터
  const sampleCenters: Record<string, { name: string; address: string; phone: string }[]> = {
    "서울": [
      { name: "서울시 광역치매센터", address: "서울시 중구 퇴계로 14길 6", phone: "02-2022-1111" },
    ],
    "성동구": [
      { name: "성동구 치매안심센터", address: "서울시 성동구 왕십리로 335", phone: "02-2286-7788" },
    ],
    "강남구": [
      { name: "강남구 치매안심센터", address: "서울시 강남구 삼성로 75길 8", phone: "02-3423-9620" },
    ],
    "부산": [
      { name: "부산시 광역치매센터", address: "부산시 서구 구덕로 179", phone: "051-242-0071" },
    ],
  };

  // 유연한 지역 매칭 사용
  const regionResult = findRegionData(region, sampleCenters, "서울");
  const centers = regionResult?.value || sampleCenters["서울"];
  const matchedRegion = regionResult?.key || "서울";
  const isMatched = regionResult?.matched || false;

  let result = `
🧠 ${region || "전국"} 치매안심센터 안내

`;

  if (isMatched) {
    result += `📍 "${matchedRegion}" 치매안심센터:\n\n`;
  } else if (region) {
    result += `💡 "${region}" 지역 정보를 찾기 어려워요.\n"${matchedRegion}" 대표 센터 정보를 안내해 드릴게요.\n\n`;
  } else {
    result += `📍 대표 치매안심센터:\n\n`;
  }

  centers.forEach((center, i) => {
    result += `${i + 1}. ${center.name}
   📍 ${center.address}
   📞 ${center.phone}

`;
  });

  result += `
🆓 치매안심센터 무료 서비스:

1️⃣ 치매 조기검진 (무료)
   • 선별검사 → 진단검사 → 감별검사

2️⃣ 치매예방 프로그램
   • 인지훈련, 두뇌운동

3️⃣ 치매환자 돌봄 서비스
   • 주간보호, 가족 상담

4️⃣ 치매환자 등록관리
   • 배회감지기 지원
   • 인식표 발급

📞 치매상담콜센터: 1899-9988 (24시간)

💡 치매는 조기 발견이 중요해요!
무료 검사 받아보시는 건 어떠세요?

예약 도와드릴까요? 😊
`;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 치매 자가진단
async function dementiaSelfCheck(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const start = args?.start as boolean | undefined;
  const answers = args?.answers as number[] | undefined;

  // KDSQ-P (한국형 치매선별 설문) 질문
  const questions = [
    "오늘이 몇 월이고, 무슨 요일인지 잘 모른다",
    "자기가 놔둔 물건을 찾지 못한다",
    "같은 질문을 반복해서 한다",
    "약속을 하고서 잊어버린다",
    "물건을 가지러 갔다가 까먹고 그냥 온다",
    "물건이나 사람의 이름을 대기가 힘들어 머뭇거린다",
    "대화 중 내용이 이해되지 않아 반복해서 물어본다",
    "길을 잃거나 헤맨 적이 있다",
    "예전보다 계산 능력이 떨어졌다",
    "예전보다 성격이 변했다",
  ];

  if (!start && !answers) {
    const result = `
🧠 치매 자가진단 (KDSQ-P)

이 검사는 치매를 진단하는 것이 아니라,
전문 검진이 필요한지 알아보는 선별검사예요.

📝 검사 방법:
• 총 10개 질문
• 각 질문에 0~2점으로 답변
• 약 5분 소요

점수 기준:
• 0점: 전혀 아니다
• 1점: 가끔 그렇다
• 2점: 자주 그렇다

시작하시겠어요?
"시작"이라고 말씀해 주시면 질문을 드릴게요! 😊
    `;
    return { content: [{ type: "text", text: result.trim() }] };
  }

  if (start && !answers) {
    let result = `
🧠 치매 자가진단 시작

각 질문에 0, 1, 2로 답해주세요:
• 0: 전혀 아니다
• 1: 가끔 그렇다
• 2: 자주 그렇다

`;

    questions.forEach((q, i) => {
      result += `Q${i + 1}. ${q}\n`;
    });

    result += `
---
예시 답변: "0,1,0,1,2,0,0,0,1,0"

답변을 알려주세요!
    `;
    return { content: [{ type: "text", text: result.trim() }] };
  }

  if (answers && answers.length >= 10) {
    const totalScore = answers.slice(0, 10).reduce((a, b) => a + b, 0);

    let interpretation = "";
    let recommendation = "";

    if (totalScore <= 3) {
      interpretation = "정상 범위입니다";
      recommendation = `
💚 현재 인지기능이 양호해 보여요!

💡 예방을 위해:
• 규칙적인 운동 (걷기, 체조)
• 두뇌 활동 (독서, 퍼즐, 새로운 취미)
• 사회활동 참여
• 건강한 식습관

1년에 한 번 정기 검진 받으시는 것도 좋아요!
      `;
    } else if (totalScore <= 5) {
      interpretation = "경계 수준입니다";
      recommendation = `
🟡 약간 주의가 필요해 보여요.

💡 권장사항:
• 치매안심센터 무료 정밀검사 추천
• 일상에서 두뇌운동 늘리기
• 규칙적인 생활습관

너무 걱정하지 마세요!
정밀검사 받아보시면 더 정확히 알 수 있어요.
치매안심센터 찾아드릴까요?
      `;
    } else {
      interpretation = "전문 상담이 필요합니다";
      recommendation = `
🔴 전문가 상담을 받아보시는 게 좋겠어요.

💡 다음 단계:
1. 가까운 치매안심센터 방문 (무료 검진)
2. 신경과 전문의 상담
3. 정밀 인지기능 검사

📞 치매상담콜센터: 1899-9988 (24시간)

일찍 발견하면 진행을 늦출 수 있어요!
걱정하지 마시고 전문가와 상담해보세요.
치매안심센터 정보 알려드릴까요?
      `;
    }

    const result = `
🧠 치매 자가진단 결과

📊 총점: ${totalScore}점 / 20점

📋 결과: ${interpretation}

${recommendation}

⚠️ 주의:
이 검사는 참고용이며, 정확한 진단은
전문 의료기관에서 받으셔야 해요.

더 궁금한 점 있으시면 물어봐 주세요! 😊
    `;

    return { content: [{ type: "text", text: result.trim() }] };
  }

  return {
    content: [{ type: "text", text: "답변 형식을 확인해주세요. 예: 0,1,0,1,2,0,0,0,1,0" }],
  };
}

// 노인전문병원 찾기
async function findSeniorHospital(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const department = (args?.department as string) || "";

  // 실제로는 API 연동 필요
  const result = `
🏥 ${region} 노인전문병원/요양병원 안내

📍 검색 조건:
• 지역: ${region || "전체"}
• 진료과: ${department || "전체"}

🔍 추천 검색 방법:

1️⃣ 건강보험심사평가원 (www.hira.or.kr)
   • 병원평가정보 확인 가능
   • 진료비, 환자 만족도 비교

2️⃣ 요양병원 정보 (www.longtermcare.or.kr)
   • 장기요양기관 정보
   • 등급, 시설 정보

3️⃣ 국민건강보험공단 (1577-1000)
   • 가까운 요양병원 안내
   • 장기요양등급 상담

💡 요양병원 선택 시 체크포인트:
✓ 건강보험심사평가원 등급 (1등급 권장)
✓ 의료진 상주 여부
✓ 재활치료 프로그램
✓ 시설 청결도
✓ 방문 가능 여부

📞 요양병원 상담 필요하시면:
장기요양 상담센터: 1577-1000

${department ? `\n${department} 전문 병원 정보가 필요하시면 더 자세히 찾아드릴게요!` : ""}

어떤 도움이 더 필요하세요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 의료비 지원 확인
async function checkMedicalExpenseSupport(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const incomeLevel = (args?.income_level as string) || "";
  const diseaseType = (args?.disease_type as string) || "";

  let result = `
💊 어르신 의료비 지원제도 안내

`;

  if (incomeLevel === "low" || !incomeLevel) {
    result += `
🔹 기초생활수급자/차상위 의료지원

1️⃣ 의료급여
   • 1종: 본인부담 거의 없음
   • 2종: 본인부담 15~25%
   • 신청: 주민센터

2️⃣ 긴급복지 의료지원
   • 위기상황 시 300만원 한도
   • 신청: 129 (보건복지콜센터)

`;
  }

  result += `
🔹 질환별 지원

`;

  if (diseaseType.includes("암") || !diseaseType) {
    result += `• 암환자 의료비 지원
   - 소아암: 백혈병 3천만원/년, 기타 2천만원/년
   - 성인암: 본인부담금 200~300만원 한도
   - 신청: 국립암센터, 보건소

`;
  }

  if (diseaseType.includes("희귀") || !diseaseType) {
    result += `• 희귀질환자 의료비 지원
   - 진료비, 보조기구 지원
   - 신청: 보건소

`;
  }

  result += `
🔹 노인 특화 의료지원

1️⃣ 노인 틀니/임플란트 지원
   • 65세 이상 건강보험 가입자
   • 틀니: 본인부담 30%
   • 임플란트: 본인부담 30% (평생 2개)

2️⃣ 노인 안검진 지원
   • 65세 이상
   • 안과 검진비 지원

3️⃣ 치매치료관리비 지원
   • 치매 진단 후 약제비 월 3만원 한도
   • 신청: 보건소

📞 상담 연락처:
• 보건복지콜센터: 129
• 국민건강보험: 1577-1000
• 암환자 상담: 1577-8899

${diseaseType ? `\n"${diseaseType}" 관련 더 자세한 지원정보가 필요하시면 말씀해주세요!` : ""}

어떤 지원이 더 궁금하세요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
