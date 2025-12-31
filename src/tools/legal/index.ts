import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 법률/상담 관련 도구 정의
export const legalTools: Tool[] = [
  {
    name: "find_legal_aid",
    description: "어르신 무료 법률 상담 서비스를 안내합니다. 법률구조공단, 대한법률구조재단 등 무료 법률 지원 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/도)",
        },
        issue_type: {
          type: "string",
          enum: ["inheritance", "real_estate", "family", "fraud", "all"],
          description: "상담 분야 (inheritance: 상속, real_estate: 부동산, family: 가족, fraud: 사기, all: 전체)",
        },
      },
      required: [],
    },
  },
  {
    name: "check_inheritance_info",
    description: "상속 관련 정보를 안내합니다. 상속 절차, 유언장 작성, 상속세 등 기본 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          enum: ["will", "procedure", "tax", "dispute", "all"],
          description: "상속 주제 (will: 유언장, procedure: 절차, tax: 상속세, dispute: 분쟁, all: 전체)",
        },
      },
      required: [],
    },
  },
  {
    name: "find_counseling_service",
    description: "어르신 심리상담 및 우울증 상담 서비스를 안내합니다. 노인상담센터, 정신건강복지센터 등 정보를 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        concern_type: {
          type: "string",
          enum: ["depression", "loneliness", "family", "health", "all"],
          description: "고민 유형 (depression: 우울, loneliness: 외로움, family: 가족갈등, health: 건강불안, all: 전체)",
        },
      },
      required: [],
    },
  },
  {
    name: "check_elder_abuse",
    description: "노인학대 관련 정보를 안내합니다. 학대 유형, 신고 방법, 보호 서비스 등을 알려드립니다.",
    inputSchema: {
      type: "object",
      properties: {
        info_type: {
          type: "string",
          enum: ["types", "report", "protection", "all"],
          description: "정보 유형 (types: 학대유형, report: 신고방법, protection: 보호서비스, all: 전체)",
        },
      },
      required: [],
    },
  },
];

// 법률/상담 도구 핸들러
export async function handleLegalTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "find_legal_aid":
      return findLegalAid(args);
    case "check_inheritance_info":
      return checkInheritanceInfo(args);
    case "find_counseling_service":
      return findCounselingService(args);
    case "check_elder_abuse":
      return checkElderAbuse(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 무료 법률 상담 찾기
async function findLegalAid(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const issueType = (args?.issue_type as string) || "all";

  let legalInfo = "";

  if (issueType === "all" || issueType === "inheritance") {
    legalInfo += `
📜 상속/유언 관련
• 유언장 작성 상담
• 상속 재산 분할
• 상속세 문의
• 상속 포기/한정승인

`;
  }

  if (issueType === "all" || issueType === "real_estate") {
    legalInfo += `
🏠 부동산 관련
• 임대차 분쟁
• 전세 사기 피해
• 등기 문제
• 재개발/재건축

`;
  }

  if (issueType === "all" || issueType === "family") {
    legalInfo += `
👨‍👩‍👧 가족 관련
• 이혼 상담
• 양육권/면접권
• 부양의무
• 성년후견 제도

`;
  }

  if (issueType === "all" || issueType === "fraud") {
    legalInfo += `
⚠️ 사기/피해 관련
• 보이스피싱 피해
• 투자 사기
• 불법 채권 추심
• 소비자 피해

`;
  }

  const result = `
⚖️ ${region ? region + " " : ""}어르신 무료 법률 상담 안내

${legalInfo}

🏛️ 무료 법률 상담 기관:

1️⃣ 대한법률구조공단 (무료)
   📞 132
   • 대상: 만 60세 이상, 저소득층
   • 서비스: 법률상담, 소송대리
   • 방법: 전화, 방문, 온라인

2️⃣ 대한변호사협회 법률구조재단
   📞 02-3476-6515
   • 무료 법률상담
   • 전국 변호사 연계

3️⃣ 법률홈닥터
   📞 02-2038-0117
   • 어르신 전문 법률상담
   • 방문 상담 가능

4️⃣ 노인복지관 법률상담
   • 정기 무료 상담 (월 1~2회)
   • 가까운 복지관 문의

5️⃣ 주민센터 마을변호사
   • 무료 법률 상담
   • 매월 정해진 날

📱 온라인 상담:

• 대한법률구조공단: www.klac.or.kr
• 법률구조재단: www.legalaid.or.kr
• 국민신문고: www.epeople.go.kr

📋 상담 준비물:
• 신분증
• 관련 서류 (계약서, 등기부등본 등)
• 사건 경위 메모

💡 어르신 특별 지원:

• 만 60세 이상: 대한법률구조공단 무료
• 기초수급자: 소송비용 전액 지원
• 장애인: 우선 지원

📞 법률 상담 전화:
• 법률구조공단: 132
• 경찰 민원: 182
• 금융감독원: 1332

${region}에서 상담받으시려면 132에 전화해보세요!
필요하시면 가까운 상담소 정보 찾아드릴게요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 상속 정보 안내
async function checkInheritanceInfo(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const topic = (args?.topic as string) || "all";

  let inheritanceInfo = "";

  if (topic === "all" || topic === "will") {
    inheritanceInfo += `
📜 유언장 작성

🔹 유언의 종류:
1. 자필증서 유언
   • 본인이 직접 작성
   • 날짜, 주소, 성명 기재
   • 도장 또는 서명

2. 공증 유언
   • 공증인 앞에서 작성
   • 가장 확실한 방법
   • 비용: 10~30만원

3. 녹음 유언
   • 본인 육성 녹음
   • 증인 1인 필요

⚠️ 유언장 주의사항:
• 자필로 써야 해요 (타이핑 X)
• 날짜, 이름, 도장 필수
• 수정 시 정정 표시 필요

💡 공증 유언 추천 이유:
• 분쟁 예방
• 법적 효력 확실
• 공증사무소에서 보관

`;
  }

  if (topic === "all" || topic === "procedure") {
    inheritanceInfo += `
📋 상속 절차

🔹 상속 개시 시 해야 할 일:

1️⃣ 사망 신고 (1개월 이내)
   • 주민센터
   • 구비서류: 사망진단서

2️⃣ 상속재산 조회 (안심상속 원스톱)
   • 정부24 (www.gov.kr)
   • 금융, 부동산, 세금 한번에 조회

3️⃣ 상속 결정
   • 단순승인: 모든 재산/빚 상속
   • 한정승인: 재산 한도 내 빚 상속
   • 상속포기: 재산/빚 모두 포기
   • 기간: 상속 안 날로부터 3개월

4️⃣ 상속등기 (부동산)
   • 6개월 이내
   • 등기소에서 진행

5️⃣ 상속세 신고 (해당 시)
   • 6개월 이내
   • 세무서

`;
  }

  if (topic === "all" || topic === "tax") {
    inheritanceInfo += `
💰 상속세 안내

🔹 상속세 면제 한도:
• 기본공제: 5억원
• 배우자공제: 최소 5억원
• 자녀 공제: 1인당 5천만원
• 금융재산공제: 최대 2억원

💡 실제로 대부분의 가정은
상속세를 내지 않아요!

🔹 상속세 계산 예시:
• 상속재산 10억원
• 배우자 + 자녀 2명
• 공제: 5억 + 5억 = 10억
• 상속세: 0원

🔹 상속세 신고:
• 기간: 상속 후 6개월 이내
• 장소: 세무서
• 신고 안 하면: 가산세 20%

📞 상속세 상담:
• 국세청: 126
• 세무서 방문

`;
  }

  if (topic === "all" || topic === "dispute") {
    inheritanceInfo += `
⚖️ 상속 분쟁 해결

🔹 분쟁 유형:
1. 유류분 청구
   • 법정상속분의 1/2 보장
   • 유언으로도 침해 불가

2. 상속재산 분할
   • 협의 분할 우선
   • 협의 안 되면 법원 조정

3. 기여분 청구
   • 부모 부양한 자녀의 추가 몫
   • 입증 자료 필요

🔹 분쟁 해결 순서:
1. 가족 간 협의
2. 법률상담 (무료)
3. 조정 신청 (법원)
4. 소송 (최후 수단)

💡 분쟁 예방 팁:
• 생전에 유언장 작성
• 공증 유언 권장
• 가족과 미리 대화

📞 분쟁 상담:
• 대한법률구조공단: 132
• 대한가정법률복지상담원: 1644-7077

`;
  }

  const result = `
📋 상속 관련 정보 안내

${inheritanceInfo}

📍 상속 관련 기관:

• 법률상담: 132 (법률구조공단)
• 세금문의: 126 (국세청)
• 재산조회: www.gov.kr (안심상속)
• 등기: 대법원 인터넷등기소

💡 무료로 도움받는 방법:

1. 대한법률구조공단 (132)
   • 만 60세 이상 무료 상담
   • 소송 지원도 가능

2. 노인복지관 법률상담
   • 월 1~2회 무료 상담일

3. 주민센터 마을변호사
   • 무료 법률상담

상속 관련 더 궁금한 점 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 심리상담 서비스 찾기
async function findCounselingService(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const concernType = (args?.concern_type as string) || "all";

  let counselingInfo = "";

  if (concernType === "all" || concernType === "depression") {
    counselingInfo += `
😢 우울증 상담

🔹 증상:
• 2주 이상 우울한 기분
• 잠이 안 오거나 너무 많이 자요
• 식욕 변화
• 무기력, 의욕 저하
• 집중력 저하

🔹 도움받을 수 있는 곳:
• 정신건강복지센터 (무료)
• 보건소 (무료)
• 정신건강의학과 (보험 적용)

📞 우울증 상담: 1577-0199

`;
  }

  if (concernType === "all" || concernType === "loneliness") {
    counselingInfo += `
💙 외로움 상담

🔹 혼자 계신 어르신:
• 말벗 서비스 신청
• 노인복지관 프로그램 참여
• 경로당 이용

🔹 사회활동 참여:
• 노인일자리
• 자원봉사
• 취미 모임

📞 말벗 서비스: 129
📞 노인돌봄서비스: 1577-1000

`;
  }

  if (concernType === "all" || concernType === "family") {
    counselingInfo += `
👨‍👩‍👧 가족 갈등 상담

🔹 상담 가능한 곳:
• 건강가정지원센터 (무료)
• 가족상담센터
• 노인상담센터

🔹 상담 내용:
• 세대 간 갈등
• 고부 갈등
• 부양 문제
• 재산 분쟁

📞 가족상담: 1644-6621

`;
  }

  if (concernType === "all" || concernType === "health") {
    counselingInfo += `
🏥 건강 불안 상담

🔹 도움받을 수 있는 곳:
• 치매안심센터 (무료 검진)
• 정신건강복지센터
• 보건소

🔹 상담 내용:
• 건강 걱정
• 죽음 불안
• 통증 관리
• 질병 적응

📞 건강상담: 1339

`;
  }

  const result = `
💚 ${region ? region + " " : ""}어르신 상담 서비스 안내

${counselingInfo}

🏥 무료 상담 기관:

1️⃣ 정신건강복지센터
   📞 1577-0199 (정신건강위기상담)
   • 전국 250개 이상 설치
   • 우울, 불안, 스트레스 상담
   • 무료

2️⃣ 노인상담센터
   📞 1661-2132
   • 어르신 전문 상담
   • 학대, 우울, 가족 문제
   • 무료

3️⃣ 생명의전화
   📞 1588-9191 (24시간)
   • 자살예방 상담
   • 위기 상담
   • 무료

4️⃣ 노인복지관
   • 정서 지원 프로그램
   • 집단 상담
   • 무료

5️⃣ 보건소
   • 정신건강 상담
   • 우울증 검사
   • 무료

📱 비대면 상담:

• 마음이음: 마음건강 앱
• 카카오톡 플러스친구: 마음터

🌈 상담받는 것은 부끄러운 일이 아니에요!

마음이 힘드시면 언제든 전화해 주세요.
전문 상담사가 따뜻하게 들어드려요.

📞 지금 힘드시면: 1577-0199

더 도움이 필요하시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 노인학대 정보 안내
async function checkElderAbuse(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const infoType = (args?.info_type as string) || "all";

  let abuseInfo = "";

  if (infoType === "all" || infoType === "types") {
    abuseInfo += `
⚠️ 노인학대 유형

1️⃣ 신체적 학대
   • 때리거나 밀치는 행위
   • 꼬집거나 할퀴는 행위
   • 강제로 약을 먹이거나 묶는 행위

2️⃣ 정서적 학대
   • 모욕, 비난, 무시
   • 고함, 욕설
   • 위협, 협박

3️⃣ 성적 학대
   • 원치 않는 성적 접촉
   • 성희롱

4️⃣ 경제적 학대
   • 연금, 재산 빼앗기
   • 강제로 일 시키기
   • 사기

5️⃣ 방임
   • 식사, 약 안 챙겨주기
   • 필요한 돌봄 안 하기
   • 병원 안 데려가기

6️⃣ 유기
   • 버리고 가는 행위

`;
  }

  if (infoType === "all" || infoType === "report") {
    abuseInfo += `
📞 신고 방법

🚨 노인학대 신고전화:
📞 1577-0199 (24시간)

🔹 신고 방법:
1. 전화 신고: 1577-0199
2. 112 신고 (경찰)
3. 주민센터 신고
4. 노인보호전문기관 방문

🔹 신고 시 알려주실 내용:
• 학대 장소 (주소)
• 피해자 정보 (이름, 나이)
• 학대 행위자 정보
• 학대 상황 설명

💡 신고자 보호:
• 신고자 신원 비밀 보장
• 익명 신고 가능
• 신고자 보복 시 처벌

⚠️ 누구나 신고 의무가 있어요!
학대가 의심되면 신고해 주세요.

`;
  }

  if (infoType === "all" || infoType === "protection") {
    abuseInfo += `
🛡️ 보호 서비스

🔹 긴급 보호:
• 일시보호시설 입소
• 병원 치료 연계
• 법률 지원

🔹 단기 보호:
• 노인보호시설 이용
• 상담 및 치료
• 가해자 분리

🔹 장기 지원:
• 요양시설 연계
• 주거 지원
• 지속 모니터링

🔹 가해자 조치:
• 격리 조치
• 상담 명령
• 형사 고발

📍 노인보호전문기관:
• 전국 34개 설치
• 학대 조사 및 보호
• 사후 관리

`;
  }

  const result = `
🛡️ 노인학대 관련 정보

${abuseInfo}

📍 도움받을 수 있는 곳:

1️⃣ 중앙노인보호전문기관
   📞 1577-0199 (24시간)
   • 학대 신고 접수
   • 상담 및 조사

2️⃣ 경찰
   📞 112
   • 긴급 상황 시
   • 현장 출동

3️⃣ 주민센터
   • 복지 담당자 상담
   • 보호 서비스 연계

4️⃣ 노인복지관
   • 상담 서비스
   • 프로그램 연계

🔒 학대 예방 팁:

👴 어르신께:
• 혼자 결정하지 마세요
• 통장/도장 본인이 관리
• 힘들면 꼭 도움 요청

👨‍👩‍👧 가족께:
• 정기적인 안부 확인
• 어르신 존중
• 스트레스 관리

💚 학대받고 계시다면:

혼자 참지 마세요.
지금 바로 전화해 주세요.

📞 1577-0199 (24시간)

반드시 도움받으실 수 있어요.
용기 내주셔서 감사합니다. 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
