import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 금융/세금 관련 도구 정의
export const financeTools: Tool[] = [
  {
    name: "check_tax_benefits",
    description: "어르신 세금 감면 혜택을 안내합니다. 소득세, 재산세, 자동차세 등 각종 세금 감면 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        age: {
          type: "number",
          description: "나이 (만 나이)",
        },
        tax_type: {
          type: "string",
          enum: ["income", "property", "car", "all"],
          description: "세금 종류 (income: 소득세, property: 재산세, car: 자동차세, all: 전체)",
        },
        income_level: {
          type: "string",
          enum: ["low", "middle", "high"],
          description: "소득 수준",
        },
      },
      required: [],
    },
  },
  {
    name: "check_utility_discount",
    description: "공과금 및 통신비 할인을 안내합니다. 전기, 가스, 수도, 휴대폰 요금 할인 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        utility_type: {
          type: "string",
          enum: ["electricity", "gas", "water", "phone", "all"],
          description: "공과금 종류 (electricity: 전기, gas: 가스, water: 수도, phone: 통신, all: 전체)",
        },
        income_level: {
          type: "string",
          enum: ["low", "middle", "high"],
          description: "소득 수준",
        },
      },
      required: [],
    },
  },
  {
    name: "check_financial_support",
    description: "어르신 금융 지원 제도를 안내합니다. 긴급생활자금, 소액대출, 금융사기 예방 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        support_type: {
          type: "string",
          enum: ["loan", "emergency", "fraud_prevention", "all"],
          description: "지원 유형 (loan: 대출, emergency: 긴급지원, fraud_prevention: 사기예방, all: 전체)",
        },
      },
      required: [],
    },
  },
];

// 금융/세금 도구 핸들러
export async function handleFinanceTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_tax_benefits":
      return checkTaxBenefits(args);
    case "check_utility_discount":
      return checkUtilityDiscount(args);
    case "check_financial_support":
      return checkFinancialSupport(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 세금 감면 확인
async function checkTaxBenefits(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const age = (args?.age as number) || 65;
  const taxType = (args?.tax_type as string) || "all";
  const incomeLevel = (args?.income_level as string) || "";

  let taxInfo = "";

  if (taxType === "all" || taxType === "income") {
    taxInfo += `
💰 소득세 감면

🔹 연금소득 공제
• 국민연금: 연 900만원까지 비과세
• 기초연금: 전액 비과세
• 개인연금: 연 1,200만원까지 분리과세 선택 가능

🔹 근로소득 공제 (일하시는 어르신)
• 근로소득공제 적용
• 추가 인적공제 100만원 (만 70세 이상)

🔹 의료비 공제
• 연간 총급여 3% 초과분 공제
• 65세 이상은 의료비 한도 없음!

🔹 기부금 공제
• 종교단체, 사회복지단체 기부금 공제

`;
  }

  if (taxType === "all" || taxType === "property") {
    taxInfo += `
🏠 재산세 감면

🔹 1세대 1주택 감면 (만 60세 이상)
• 10~30% 감면 (보유기간에 따라)

🔹 주택연금 가입자
• 재산세 25% 감면

🔹 저소득 어르신
• 기초수급자: 재산세 면제
• 차상위: 50~100% 감면

📋 신청 방법:
• 구청 세무과 방문
• 위택스(www.wetax.go.kr) 온라인

`;
  }

  if (taxType === "all" || taxType === "car") {
    taxInfo += `
🚗 자동차세 감면

🔹 장애인 차량
• 자동차세 전액 면제
• 1~3급 장애인 명의 차량

🔹 경차 (1,000cc 이하)
• 자동차세 50% 감면

🔹 친환경차
• 전기차: 최대 140만원 감면
• 하이브리드: 최대 40만원 감면

🔹 국가유공자
• 자동차세 면제

📋 신청 방법:
• 구청 세무과 방문
• 위택스(www.wetax.go.kr)

`;
  }

  const result = `
💵 ${age >= 65 ? `만 ${age}세` : "어르신"} 세금 감면 혜택 안내

${taxInfo}

📌 종합 세금 감면 팁:

1️⃣ 연말정산 때 챙기세요:
   • 의료비 공제 (한도 없음)
   • 추가 인적공제 (70세 이상)

2️⃣ 재산세 감면 신청:
   • 매년 6월 전에 신청
   • 구청 세무과

3️⃣ 국세청 홈택스 활용:
   • 세금 신고/납부
   • 감면 신청

📞 세금 관련 문의:

• 국세청 상담센터: 126
• 구청 세무과: 지역번호 + 120
• 국세청 홈택스: www.hometax.go.kr
• 위택스 (지방세): www.wetax.go.kr

${incomeLevel === "low" ? "\n💡 저소득 어르신은 더 많은 감면 혜택이 있어요!\n주민센터에서 상담받아 보세요." : ""}

더 궁금한 세금 혜택이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 공과금/통신비 할인 확인
async function checkUtilityDiscount(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const utilityType = (args?.utility_type as string) || "all";
  const incomeLevel = (args?.income_level as string) || "";

  let discountInfo = "";

  if (utilityType === "all" || utilityType === "electricity") {
    discountInfo += `
⚡ 전기요금 할인

🔹 독거노인/장애인 할인
• 월 16,000원 한도 할인
• 신청: 한국전력 (123)

🔹 기초수급자
• 월 16,000원 한도 할인
• 여름/겨울 추가 할인

🔹 차상위계층
• 월 10,000원 한도 할인

🔹 대가족 할인
• 3자녀 이상: 30% 할인

📞 한국전력: 123

`;
  }

  if (utilityType === "all" || utilityType === "gas") {
    discountInfo += `
🔥 도시가스 할인

🔹 기초수급자
• 동절기 난방비 지원
• 월 최대 6,500원 할인

🔹 차상위계층
• 월 최대 3,300원 할인

🔹 장애인 가구
• 월 최대 6,500원 할인

🔹 독거노인
• 동절기 난방비 지원 (지자체별)

📞 지역 도시가스 회사 문의

`;
  }

  if (utilityType === "all" || utilityType === "water") {
    discountInfo += `
💧 수도요금 감면

🔹 기초수급자
• 수도요금 감면 (지자체별 다름)
• 월 10㎥ 무료 또는 50% 감면

🔹 차상위계층
• 50% 감면 (지자체별)

🔹 다자녀 가구
• 30~50% 감면

🔹 독거노인
• 일부 지자체 감면 혜택

📞 지역 상수도사업소 문의

`;
  }

  if (utilityType === "all" || utilityType === "phone") {
    discountInfo += `
📱 통신비 할인

🔹 기초연금 수급자 (만 65세 이상)
• 통신비 월 11,000원 감면
• SKT, KT, LG U+ 모두 적용

🔹 기초생활수급자
• 월 26,000원 감면 (이동전화)
• 월 11,000원 감면 (인터넷)

🔹 장애인
• 월 최대 35% 감면

🔹 차상위계층
• 월 11,000원 감면

📝 신청 방법:
1. 통신사 대리점 방문
2. 고객센터 전화
3. 복지로(www.bokjiro.go.kr) 신청

📞 통신사 고객센터:
• SKT: 114 (무료)
• KT: 100 (무료)
• LG U+: 101 (무료)

💡 알뜰폰도 할인 적용 돼요!

`;
  }

  const result = `
💡 공과금/통신비 할인 안내

${discountInfo}

📌 한 번에 신청하는 방법:

1️⃣ 복지로 (www.bokjiro.go.kr)
   • 통신비, 전기요금 할인 신청
   • 감면 자격 조회

2️⃣ 주민센터 방문
   • 복지 담당자와 상담
   • 여러 할인 한 번에 신청

3️⃣ 129 (보건복지콜센터)
   • 감면 혜택 종합 안내
   • 신청 방법 안내

${incomeLevel === "low" ? `
💚 저소득 어르신 추가 혜택:

• 에너지 바우처: 냉난방비 지원
• 긴급복지 에너지 지원
• 지자체 공과금 지원

주민센터에서 자세히 상담받아 보세요!
` : ""}

더 궁금한 할인 혜택이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 금융 지원 확인
async function checkFinancialSupport(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const supportType = (args?.support_type as string) || "all";

  let supportInfo = "";

  if (supportType === "all" || supportType === "loan") {
    supportInfo += `
🏦 어르신 대출 지원

🔹 햇살론 (서민금융진흥원)
• 대상: 저소득, 저신용자
• 금리: 연 10% 내외
• 한도: 최대 1,500만원
• 문의: 1397 (서민금융콜센터)

🔹 미소금융
• 대상: 저소득 취약계층
• 금리: 연 4.5% 내외
• 한도: 최대 2,000만원
• 문의: 1600-3500

🔹 긴급생계자금
• 대상: 기초수급자, 차상위
• 금리: 무이자~저금리
• 한도: 50~100만원
• 문의: 주민센터

🔹 주택담보 노후연금 (주택연금)
• 대상: 만 55세 이상 주택 소유자
• 내용: 집에 살면서 매월 연금 수령
• 문의: 한국주택금융공사 1688-8114

`;
  }

  if (supportType === "all" || supportType === "emergency") {
    supportInfo += `
🆘 긴급 금융 지원

🔹 긴급복지 생계지원
• 대상: 갑작스러운 위기 상황
• 지원: 최대 162만원 (4인 기준)
• 신청: 129 또는 주민센터

🔹 재난적 의료비 지원
• 대상: 과도한 의료비 발생 시
• 지원: 최대 3,000만원
• 신청: 국민건강보험공단

🔹 에너지 바우처
• 대상: 기초수급자, 차상위
• 지원: 냉난방비 (계절별 다름)
• 신청: 주민센터

🔹 긴급전세자금
• 대상: 저소득 무주택자
• 지원: 전세금 대출
• 신청: 주택도시기금

📞 긴급 지원 전화: 129

`;
  }

  if (supportType === "all" || supportType === "fraud_prevention") {
    supportInfo += `
🛡️ 금융사기 예방 안내

⚠️ 주의해야 할 사기 유형:

1️⃣ 보이스피싱
   • "검찰/경찰/금감원입니다" → 100% 사기!
   • 계좌이체, 현금인출 요구 → 무조건 거절!
   • "가족이 사고 났다" → 직접 확인 먼저!

2️⃣ 메신저피싱
   • 자녀/지인 사칭 문자
   • "돈 급히 보내줘" → 전화로 확인!
   • 카카오톡 프로필 도용 주의

3️⃣ 대출 사기
   • "무조건 대출 가능" → 사기!
   • 선입금 요구 → 사기!
   • 수수료 먼저 내라 → 사기!

4️⃣ 투자 사기
   • "원금 보장 고수익" → 사기!
   • 유명인 사칭 투자 유도 → 사기!

🔒 예방 방법:

✓ 모르는 전화/문자 의심하기
✓ 절대 계좌번호/비밀번호 알려주지 않기
✓ 출처 불명 링크 클릭하지 않기
✓ 의심되면 가족/경찰에 먼저 확인

📞 사기 신고/상담:
• 경찰청: 112
• 금융감독원: 1332
• 보이스피싱 신고: 118

💡 피해 발생 시:
1. 112 신고
2. 은행에 지급정지 요청
3. 금감원 상담 (1332)

`;
  }

  const result = `
💳 어르신 금융 지원 안내

${supportInfo}

📌 금융 관련 상담 연락처:

• 서민금융콜센터: 1397
• 금융감독원: 1332
• 국민연금: 1355
• 건강보험: 1577-1000
• 주택금융공사: 1688-8114

📍 방문 상담:

• 주민센터: 복지 상담
• 은행: 금융 상담
• 서민금융통합지원센터: 대출 상담

💡 어르신 금융 꿀팁:

1. 통장/카드 비밀번호 정기 변경
2. 가족에게 금융거래 알리기
3. 의심 전화는 끊고 확인하기
4. 금융교육 받아보기 (복지관, 은행)

더 궁금한 금융 정보가 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
