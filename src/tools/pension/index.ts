import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 연금/수당 관련 도구 정의
export const pensionTools: Tool[] = [
  {
    name: "check_basic_pension",
    description: "기초연금 수급자격 및 예상 금액을 확인합니다. 만 65세 이상 어르신의 기초연금 수급 가능 여부와 예상 수령액을 안내해드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        age: {
          type: "number",
          description: "나이 (만 나이)",
        },
        household_type: {
          type: "string",
          enum: ["single", "couple"],
          description: "가구 형태 (single: 단독가구, couple: 부부가구)",
        },
        monthly_income: {
          type: "number",
          description: "월 소득인정액 (만원 단위, 대략적인 금액)",
        },
      },
      required: ["age"],
    },
  },
  {
    name: "calculate_national_pension",
    description: "국민연금 예상 수령액을 계산합니다. 가입 기간과 평균 소득을 기반으로 노령연금 예상액을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        contribution_years: {
          type: "number",
          description: "국민연금 가입 기간 (년)",
        },
        average_monthly_income: {
          type: "number",
          description: "가입 기간 중 평균 월소득 (만원)",
        },
        current_age: {
          type: "number",
          description: "현재 나이",
        },
      },
      required: ["contribution_years"],
    },
  },
  {
    name: "check_disability_pension",
    description: "장애인연금 수급 자격을 확인합니다. 중증 장애인을 위한 연금 지원 자격과 금액을 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        disability_grade: {
          type: "string",
          enum: ["severe", "mild"],
          description: "장애 정도 (severe: 중증, mild: 경증)",
        },
        age: {
          type: "number",
          description: "나이",
        },
        monthly_income: {
          type: "number",
          description: "월 소득인정액 (만원)",
        },
      },
      required: ["disability_grade", "age"],
    },
  },
  {
    name: "check_veteran_benefits",
    description: "국가유공자 혜택을 조회합니다. 보훈 대상자를 위한 다양한 지원 혜택을 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        veteran_type: {
          type: "string",
          description: "유공자 유형 (예: 참전유공자, 독립유공자, 국가유공자 등)",
        },
        benefit_category: {
          type: "string",
          enum: ["medical", "education", "housing", "all"],
          description: "혜택 분야 (medical: 의료, education: 교육, housing: 주거, all: 전체)",
        },
      },
      required: [],
    },
  },
];

// 연금/수당 도구 핸들러
export async function handlePensionTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_basic_pension":
      return checkBasicPension(args);
    case "calculate_national_pension":
      return calculateNationalPension(args);
    case "check_disability_pension":
      return checkDisabilityPension(args);
    case "check_veteran_benefits":
      return checkVeteranBenefits(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 기초연금 확인
async function checkBasicPension(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const age = (args?.age as number) || 65;
  const householdType = (args?.household_type as string) || "single";
  const monthlyIncome = args?.monthly_income as number | undefined;

  // 2024년 기준 기초연금 정보
  const maxPension = 334810; // 2024년 기준 최대 금액
  const singleThreshold = 2130000; // 단독가구 소득인정액 기준
  const coupleThreshold = 3408000; // 부부가구 소득인정액 기준

  let result = "";

  if (age < 65) {
    result = `
어르신, 기초연금은 만 65세부터 받으실 수 있어요.

📅 현재 ${age}세이시니, ${65 - age}년 후에 신청하실 수 있습니다.

💡 미리 알아두시면 좋은 정보:
• 만 65세가 되는 달의 1개월 전부터 신청 가능해요
• 주민센터나 국민연금공단에서 신청하실 수 있어요
• 필요 서류: 신분증, 통장사본

더 궁금한 점 있으시면 말씀해 주세요! 😊
    `;
  } else {
    const threshold = householdType === "couple" ? coupleThreshold : singleThreshold;
    const householdText = householdType === "couple" ? "부부가구" : "단독가구";

    if (monthlyIncome !== undefined) {
      const incomeWon = monthlyIncome * 10000;
      const isEligible = incomeWon <= threshold;

      if (isEligible) {
        // 간단한 예상 금액 계산 (실제는 더 복잡함)
        const estimatedPension = Math.round(
          maxPension * (1 - (incomeWon / threshold) * 0.3)
        );

        result = `
🎉 어르신, 기초연금 받으실 수 있을 것 같아요!

📋 확인 결과:
• 나이: 만 ${age}세 ✓ (65세 이상)
• 가구형태: ${householdText}
• 소득인정액: 약 ${monthlyIncome}만원

💰 예상 수령액: 월 약 ${estimatedPension.toLocaleString()}원
   (최대 ${maxPension.toLocaleString()}원)

📝 신청 방법:
1. 가까운 주민센터 방문
2. 국민연금공단 지사 방문
3. 복지로(www.bokjiro.go.kr) 온라인 신청

📌 필요 서류:
• 신분증
• 통장사본
• 배우자 동의서 (부부가구인 경우)

신청하시면 보통 1~2개월 내에 결과가 나와요.
더 궁금한 점 있으시면 물어봐 주세요! 😊
        `;
      } else {
        result = `
어르신, 현재 소득 기준으로는 기초연금이 어려울 수 있어요.

📋 확인 결과:
• 나이: 만 ${age}세 ✓
• 가구형태: ${householdText}
• 소득인정액: 약 ${monthlyIncome}만원
• ${householdText} 기준: ${(threshold / 10000).toLocaleString()}만원 이하

⚠️ 소득인정액이 기준보다 높아 보여요.

💡 하지만!
• 정확한 소득인정액은 실제 신청 시 산정돼요
• 재산, 부채, 공제 항목에 따라 달라질 수 있어요
• 일단 신청해보시는 게 좋아요!

👉 주민센터에서 정확한 상담 받아보시겠어요?
        `;
      }
    } else {
      result = `
어르신, 만 ${age}세시니 기초연금 대상이세요! 🎉

📋 기초연금 안내:
• 대상: 만 65세 이상
• 금액: 월 최대 ${maxPension.toLocaleString()}원
• 기준: ${householdText} 소득인정액 ${(threshold / 10000).toLocaleString()}만원 이하

💰 정확한 금액을 알려드리려면:
• 혼자 사세요, 배우자분과 함께 사세요?
• 한 달 소득이 대략 얼마나 되세요?

알려주시면 받으실 수 있는지, 얼마나 받으실 수 있는지 더 정확히 알려드릴게요!
      `;
    }
  }

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 국민연금 계산
async function calculateNationalPension(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const years = (args?.contribution_years as number) || 10;
  const avgIncome = (args?.average_monthly_income as number) || 200;
  const currentAge = (args?.current_age as number) || 60;

  // 간단한 국민연금 계산 (실제 계산은 더 복잡함)
  // 기본연금액 = 1.2 × (A + B) × (1 + 0.05n/12)
  // A: 전체 가입자 평균소득, B: 본인 가입기간 평균소득
  const avgA = 2800000; // 전체 가입자 평균소득 (예시)
  const monthlyB = avgIncome * 10000;
  const baseAmount = 1.2 * (avgA + monthlyB) * (1 + 0.05 * years / 12) / 12;
  const estimatedPension = Math.round(baseAmount * (years / 40)); // 40년 기준 비율

  const retirementAge = 65; // 노령연금 수급 시작 나이
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);

  const result = `
📊 국민연금 예상 수령액 계산 결과

📋 입력하신 정보:
• 가입 기간: ${years}년
• 평균 월소득: 약 ${avgIncome}만원
• 현재 나이: ${currentAge}세

💰 예상 월 수령액: 약 ${estimatedPension.toLocaleString()}원

📅 수령 시작:
• 노령연금은 만 ${retirementAge}세부터 받으실 수 있어요
${yearsUntilRetirement > 0 ? `• ${yearsUntilRetirement}년 후부터 수령 가능` : "• 지금 바로 신청 가능해요!"}

💡 알아두시면 좋은 정보:
• 조기노령연금: 만 60세부터 받을 수 있지만, 금액이 줄어요
• 연기연금: 최대 5년 늦추면 금액이 늘어나요 (연 7.2%)
• 기초연금과 함께 받으실 수도 있어요

📞 정확한 금액은 국민연금공단(1355)에서 확인하실 수 있어요.

더 궁금한 점 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 장애인연금 확인
async function checkDisabilityPension(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const grade = (args?.disability_grade as string) || "severe";
  const age = (args?.age as number) || 18;
  const monthlyIncome = args?.monthly_income as number | undefined;

  // 2024년 기준 장애인연금 정보
  const basicPension = 323180; // 기초급여
  const additionalPension = 80000; // 부가급여 (최대)

  const gradeText = grade === "severe" ? "중증" : "경증";

  let result = "";

  if (age < 18) {
    result = `
장애인연금은 만 18세 이상부터 받으실 수 있어요.

📋 장애인연금 대상:
• 나이: 만 18세 이상 ~ 65세 미만
• 장애 정도: 중증 장애인
• 소득: 소득인정액 기준 이하

💡 만 18세 미만이시면:
• 장애아동수당을 받으실 수 있어요
• 주민센터에서 신청 가능합니다

더 자세한 안내가 필요하시면 말씀해 주세요!
    `;
  } else if (age >= 65) {
    result = `
어르신, 만 65세 이상이시면 장애인연금 대신 기초연금을 받으시게 돼요.

📋 안내:
• 장애인연금: 만 18세 ~ 65세 미만
• 기초연금: 만 65세 이상

💰 기초연금으로 전환:
• 장애인연금 받으시던 분은 자동으로 기초연금으로 전환돼요
• 장애인연금 부가급여는 계속 받으실 수 있어요

👉 기초연금 정보를 알려드릴까요?
    `;
  } else if (grade !== "severe") {
    result = `
장애인연금은 중증 장애인분들을 위한 제도예요.

📋 장애인연금 대상:
• 중증 장애인 (장애의 정도가 심한 장애인)
• 만 18세 이상 ~ 65세 미만
• 소득인정액 기준 이하

💡 경증 장애인분들을 위한 지원:
• 장애수당: 월 2~4만원
• 장애인 의료비 지원
• 장애인 활동지원서비스

자세한 장애인 복지 정보를 알려드릴까요?
    `;
  } else {
    result = `
${gradeText} 장애인이시고 만 ${age}세시군요.

📋 장애인연금 자격 확인:
• 장애 정도: ${gradeText} ✓
• 나이: 만 ${age}세 ✓ (18~65세 미만)

💰 장애인연금 금액:
• 기초급여: 월 최대 ${basicPension.toLocaleString()}원
• 부가급여: 월 최대 ${additionalPension.toLocaleString()}원
• 합계: 월 최대 ${(basicPension + additionalPension).toLocaleString()}원

📝 신청 방법:
1. 주민센터 방문 신청
2. 복지로(www.bokjiro.go.kr) 온라인 신청

📌 필요 서류:
• 신분증
• 장애인등록증
• 통장사본
• 소득재산 신고서

${monthlyIncome !== undefined ? `\n현재 소득 ${monthlyIncome}만원으로는 ` + (monthlyIncome < 130 ? "자격이 될 것 같아요! 😊" : "자세한 확인이 필요해요.") : ""}

더 궁금한 점 있으시면 물어봐 주세요!
    `;
  }

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 국가유공자 혜택 조회
async function checkVeteranBenefits(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const veteranType = (args?.veteran_type as string) || "";
  const category = (args?.benefit_category as string) || "all";

  let result = `
🎖️ 국가유공자 혜택 안내

`;

  if (veteranType) {
    result += `📋 ${veteranType} 관련 혜택을 알려드릴게요.\n\n`;
  }

  if (category === "all" || category === "medical") {
    result += `
🏥 의료 지원:
• 보훈병원 진료비 감면/무료
• 위탁병원 진료비 지원
• 보장구 지급
• 재활치료 지원

`;
  }

  if (category === "all" || category === "education") {
    result += `
📚 교육 지원:
• 자녀 학비 지원 (고등학교, 대학교)
• 취업 지원 프로그램
• 직업훈련 지원

`;
  }

  if (category === "all" || category === "housing") {
    result += `
🏠 주거 지원:
• 주택 우선 분양
• 주택 구입/전세 자금 대출
• 임대주택 우선 입주

`;
  }

  result += `
📞 자세한 상담:
• 국가보훈처 1577-0606
• 가까운 보훈지청 방문

💡 보훈 등록이 안 되어 있으시다면:
• 먼저 국가유공자 등록 신청이 필요해요
• 보훈지청에서 신청하실 수 있어요

더 자세히 알고 싶은 혜택이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
