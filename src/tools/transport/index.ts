import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 교통/이동 관련 도구 정의
export const transportTools: Tool[] = [
  {
    name: "check_transport_benefits",
    description: "어르신 교통 혜택을 안내합니다. 지하철 무료, 버스 할인, KTX 할인 등 다양한 교통 혜택을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        age: {
          type: "number",
          description: "나이 (만 나이)",
        },
        region: {
          type: "string",
          description: "거주 지역 (시/도)",
        },
        transport_type: {
          type: "string",
          enum: ["subway", "bus", "train", "taxi", "all"],
          description: "교통수단 (subway: 지하철, bus: 버스, train: 기차, taxi: 택시, all: 전체)",
        },
      },
      required: [],
    },
  },
  {
    name: "find_call_taxi",
    description: "어르신/장애인 콜택시 서비스를 찾아드립니다. 지역별 복지콜택시, 바우처 택시 정보를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        disability: {
          type: "boolean",
          description: "장애 여부",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "check_driving_license",
    description: "고령 운전자 관련 정보를 안내합니다. 면허 갱신, 자진 반납 혜택, 조건부 면허 등을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        age: {
          type: "number",
          description: "나이",
        },
        has_license: {
          type: "boolean",
          description: "현재 면허 보유 여부",
        },
      },
      required: [],
    },
  },
];

// 교통/이동 도구 핸들러
export async function handleTransportTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "check_transport_benefits":
      return checkTransportBenefits(args);
    case "find_call_taxi":
      return findCallTaxi(args);
    case "check_driving_license":
      return checkDrivingLicense(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 교통 혜택 확인
async function checkTransportBenefits(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const age = (args?.age as number) || 65;
  const region = (args?.region as string) || "";
  const transportType = (args?.transport_type as string) || "all";

  let benefits = "";

  if (transportType === "all" || transportType === "subway") {
    benefits += `
🚇 지하철 무료 이용

• 대상: 만 65세 이상
• 혜택: 전 구간 무료
• 이용 방법: 경로우대용 교통카드 또는 신분증 제시

📍 지역별 안내:
• 서울: 지하철 1~9호선, 경의중앙선 등 무료
• 부산: 도시철도 전 구간 무료
• 대구: 도시철도 전 구간 무료
• 광주, 대전: 도시철도 무료

💡 경로우대 교통카드 발급:
• 지하철역 고객센터
• 주민센터
• 신분증 지참

`;
  }

  if (transportType === "all" || transportType === "bus") {
    benefits += `
🚌 버스 할인

• 대상: 만 65세 이상
• 혜택: 지역에 따라 다름

📍 지역별 버스 혜택:
• 서울: 무료 (경로우대카드)
• 경기도: 50% 할인 (일부 무료)
• 부산: 무료 (시내버스)
• 대구: 무료 (시내버스)
• 인천: 무료 (시내버스)

💡 이용 방법:
• 경로우대용 교통카드 사용
• 또는 신분증 제시

⚠️ 광역버스, 직행버스는 할인 적용 안 되는 경우도 있어요.

`;
  }

  if (transportType === "all" || transportType === "train") {
    benefits += `
🚄 KTX/기차 할인

• 대상: 만 65세 이상
• 혜택: 운임 30% 할인

📋 할인 조건:
• KTX: 30% 할인
• ITX-새마을: 30% 할인
• 무궁화호: 30% 할인
• 주중/주말 동일 적용

💡 이용 방법:
1. 역 창구에서 신분증 제시
2. 코레일톡 앱에서 경로할인 선택
3. 인터넷 예매 시 경로할인 적용

📞 코레일 고객센터: 1544-7788

⚠️ 특실, 우등실은 할인 제외

`;
  }

  if (transportType === "all" || transportType === "taxi") {
    benefits += `
🚕 택시 할인/지원

• 바우처 택시: 저소득 어르신 택시비 지원
• 복지콜택시: 장애인/거동불편 어르신 전용

📋 바우처 택시 (교통약자 이동지원):
• 대상: 만 65세 이상 저소득층
• 지원: 월 일정 금액 택시비 지원
• 신청: 주민센터

📋 어르신 콜택시:
• 일부 지역 운영
• 저렴한 요금
• 예약 운행

💡 신청 방법:
• 주민센터 문의
• 구청 교통과 문의

`;
  }

  const result = `
🚗 ${age >= 65 ? `만 ${age}세` : "어르신"} 교통 혜택 안내
${region ? `📍 ${region} 지역 기준\n` : ""}
${benefits}

📌 교통카드 발급 안내:

1️⃣ 경로우대 교통카드
   • 지하철역, 주민센터에서 발급
   • 신분증 지참
   • 무료 또는 소액

2️⃣ 발급 후 혜택:
   • 지하철 무료 탑승
   • 버스 할인/무료 (지역별)
   • 환승 할인 적용

📞 교통 관련 문의:
• 서울 다산콜센터: 120
• 경기콜센터: 031-120
• 코레일: 1544-7788

더 궁금한 교통 혜택이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 콜택시 찾기
async function findCallTaxi(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const hasDisability = (args?.disability as boolean) || false;

  // 지역별 콜택시 정보 (예시)
  const callTaxiInfo: Record<string, { name: string; phone: string; desc: string }[]> = {
    "서울": [
      { name: "서울시 장애인콜택시", phone: "1588-4388", desc: "장애인 전용, 24시간" },
      { name: "서울시 어르신콜택시", phone: "02-120", desc: "만 65세 이상" },
    ],
    "부산": [
      { name: "부산시 두리발콜택시", phone: "1588-6565", desc: "장애인/어르신 전용" },
    ],
    "대구": [
      { name: "대구시 행복콜택시", phone: "1588-8255", desc: "교통약자 전용" },
    ],
    "인천": [
      { name: "인천시 누리콜", phone: "1588-4007", desc: "장애인/어르신 전용" },
    ],
    "광주": [
      { name: "광주시 사랑콜택시", phone: "062-710-1010", desc: "교통약자 전용" },
    ],
  };

  let taxiList = callTaxiInfo[region] || [];

  // 서울 기본값
  if (taxiList.length === 0) {
    taxiList = callTaxiInfo["서울"];
  }

  let result = `
🚕 ${region || "전국"} 콜택시 서비스 안내

`;

  if (hasDisability) {
    result += `♿ 장애인 전용 콜택시 위주로 안내해 드릴게요.\n\n`;
  }

  result += `📍 ${region || "지역"} 콜택시:\n\n`;

  taxiList.forEach((taxi, i) => {
    result += `${i + 1}. ${taxi.name}
   📞 ${taxi.phone}
   ℹ️ ${taxi.desc}

`;
  });

  result += `
🔹 콜택시 종류:

1️⃣ 장애인콜택시
   • 대상: 등록 장애인
   • 특징: 휠체어 탑승 가능 차량
   • 요금: 일반 택시의 50~70%
   • 예약: 전화 또는 앱

2️⃣ 어르신콜택시
   • 대상: 만 65세 이상
   • 특징: 병원, 관공서 이동 지원
   • 요금: 저렴 또는 무료 (지역별)
   • 예약: 전화

3️⃣ 바우처택시
   • 대상: 저소득 교통약자
   • 특징: 월 일정 금액 지원
   • 신청: 주민센터

📝 이용 신청 방법:

1. 주민센터에서 이용자 등록
2. 장애인증명서/신분증 지참
3. 콜센터 또는 앱으로 예약

📞 전국 장애인콜택시: 1588-4388

${region}에서 이용하시려면 주민센터나 구청에 문의해보세요!
콜택시 예약 도와드릴까요? 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 고령 운전자 안내
async function checkDrivingLicense(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const age = (args?.age as number) || 65;
  const hasLicense = (args?.has_license as boolean) ?? true;

  let result = `
🚗 ${age}세 고령 운전자 안내

`;

  if (hasLicense) {
    result += `
📋 면허 갱신 안내:

• 만 65세~74세: 5년마다 적성검사
• 만 75세 이상: 3년마다 적성검사 + 교통안전교육

🔹 75세 이상 의무 교통안전교육:
• 시간: 2시간
• 내용: 노화와 운전, 안전운전 요령
• 장소: 면허시험장, 경찰서
• 비용: 무료

`;

    if (age >= 75) {
      result += `
⚠️ ${age}세시니 3년마다 적성검사와 교통안전교육이 필요해요.

📝 적성검사 준비물:
• 운전면허증
• 신분증 (주민등록증)
• 사진 2매 (3.5×4.5cm)

📍 적성검사 장소:
• 운전면허시험장
• 경찰서 민원실

`;
    }

    result += `
🎁 면허 자진 반납 혜택:

만 65세 이상 면허를 반납하시면 다양한 혜택이 있어요!

💰 지원금:
• 서울: 10만원 교통카드
• 경기: 10~15만원 교통카드
• 부산: 10만원 교통카드
• 대구: 10만원 교통카드
• 지역마다 다름!

🎫 추가 혜택:
• 대중교통 무료 이용권
• 택시 바우처
• 자전거, 전동킥보드 쿠폰
• 지역 상품권

📝 반납 방법:
1. 운전면허시험장 방문
2. 경찰서 민원실 방문
3. 면허증, 신분증 지참

💡 반납 후에도:
• 신분증으로 사용 가능한 확인증 발급
• 언제든 재취득 가능

`;
  } else {
    result += `
면허가 없으시군요.

🚌 면허 없이 이동하는 방법:

1️⃣ 대중교통
   • 지하철: 만 65세 이상 무료
   • 버스: 무료 또는 할인

2️⃣ 콜택시
   • 어르신 콜택시
   • 복지콜택시

3️⃣ 이동지원 서비스
   • 구청 어르신 이동지원
   • 복지관 셔틀버스

📞 이동 지원 문의:
• 주민센터
• 구청 교통과

`;
  }

  result += `
📞 관련 문의처:

• 도로교통공단: 1577-1120
• 경찰청 운전면허: 182
• 지자체 콜센터: 120

더 궁금한 점 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
