import { Tool } from "@modelcontextprotocol/sdk/types.js";

// 여가/문화 관련 도구 정의
export const leisureTools: Tool[] = [
  {
    name: "find_senior_center",
    description: "가까운 경로당이나 노인복지관을 찾아드립니다. 시설 정보, 프로그램, 연락처를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구/동)",
        },
        facility_type: {
          type: "string",
          enum: ["senior_center", "welfare_center", "all"],
          description: "시설 유형 (senior_center: 경로당, welfare_center: 복지관, all: 전체)",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "get_welfare_programs",
    description: "노인복지관 프로그램을 조회합니다. 건강, 교육, 취미 등 다양한 프로그램 정보를 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        category: {
          type: "string",
          enum: ["health", "education", "hobby", "social", "all"],
          description: "프로그램 분야 (health: 건강, education: 교육, hobby: 취미, social: 사회활동, all: 전체)",
        },
        day_of_week: {
          type: "string",
          enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
          description: "요일 (선택)",
        },
      },
      required: ["region"],
    },
  },
  {
    name: "find_senior_education",
    description: "어르신 교육 프로그램을 찾아드립니다. 평생교육, 스마트폰 교육, 문화 강좌 등을 안내합니다.",
    inputSchema: {
      type: "object",
      properties: {
        region: {
          type: "string",
          description: "지역 (시/구)",
        },
        subject: {
          type: "string",
          description: "관심 분야 (예: 스마트폰, 컴퓨터, 영어, 서예, 노래 등)",
        },
      },
      required: ["region"],
    },
  },
];

// 여가/문화 도구 핸들러
export async function handleLeisureTool(
  name: string,
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case "find_senior_center":
      return findSeniorCenter(args);
    case "get_welfare_programs":
      return getWelfarePrograms(args);
    case "find_senior_education":
      return findSeniorEducation(args);
    default:
      throw new Error(`알 수 없는 도구: ${name}`);
  }
}

// 경로당/복지관 찾기
async function findSeniorCenter(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const facilityType = (args?.facility_type as string) || "all";

  let facilityInfo = "";

  if (facilityType === "all" || facilityType === "senior_center") {
    facilityInfo += `
🏠 경로당

경로당은 마을마다 있는 어르신들의 사랑방이에요!

• 이용 대상: 만 65세 이상
• 이용 시간: 보통 오전 9시 ~ 오후 6시
• 이용 비용: 무료

📌 경로당에서 할 수 있는 것들:
• 친구들과 담소 나누기
• 화투, 바둑, 장기
• 간단한 건강체조
• 점심 식사 (일부)
• TV 시청

💡 ${region} 지역 경로당 찾기:
• 동 주민센터에 문의하시면 가장 가까운 경로당을 안내해 드려요
• 전화: ${region} 주민센터

`;
  }

  if (facilityType === "all" || facilityType === "welfare_center") {
    facilityInfo += `
🏛️ 노인복지관

복지관은 다양한 프로그램과 서비스를 제공해요!

• 이용 대상: 만 60세 이상
• 이용 시간: 오전 9시 ~ 오후 6시 (주말 휴관 多)
• 이용 비용: 무료 (일부 재료비)

📌 노인복지관 서비스:
• 건강 프로그램 (체조, 요가, 물리치료)
• 교육 프로그램 (스마트폰, 한글, 영어)
• 취미 프로그램 (노래, 서예, 그림)
• 식사 서비스 (경로식당)
• 이미용 서비스
• 건강상담

`;
  }

  const result = `
📍 ${region} 어르신 시설 안내

${facilityInfo}

🔍 시설 찾는 방법:

1️⃣ 주민센터 문의
   • 동네 경로당 위치 안내
   • 가까운 복지관 연결

2️⃣ 복지로 (www.bokjiro.go.kr)
   • 지역별 복지시설 검색

3️⃣ 129 (보건복지콜센터)
   • 복지시설 종합 안내

📞 ${region} 구청 노인복지과에 전화하시면
가까운 경로당과 복지관을 바로 안내받으실 수 있어요!

방문해보고 싶은 곳이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 복지관 프로그램 조회
async function getWelfarePrograms(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const category = (args?.category as string) || "all";
  const dayOfWeek = (args?.day_of_week as string) || "";

  const dayMap: Record<string, string> = {
    mon: "월요일", tue: "화요일", wed: "수요일", thu: "목요일",
    fri: "금요일", sat: "토요일", sun: "일요일"
  };

  let programs = "";

  if (category === "all" || category === "health") {
    programs += `
💪 건강 프로그램

• 건강체조
  - 시간: 매일 오전 10시
  - 내용: 스트레칭, 근력운동
  - 비용: 무료

• 요가/명상
  - 시간: 화/목 오후 2시
  - 내용: 시니어 요가
  - 비용: 무료

• 탁구/게이트볼
  - 시간: 수시 이용
  - 내용: 동호회 활동
  - 비용: 무료

• 물리치료
  - 시간: 예약제
  - 내용: 재활운동
  - 비용: 무료~저렴

`;
  }

  if (category === "all" || category === "education") {
    programs += `
📚 교육 프로그램

• 스마트폰 배우기
  - 시간: 월/수 오전 10시
  - 내용: 카카오톡, 유튜브, 사진
  - 비용: 무료

• 한글교실
  - 시간: 화/목 오전 10시
  - 내용: 기초 한글, 글쓰기
  - 비용: 무료

• 영어회화
  - 시간: 금 오후 2시
  - 내용: 기초 영어
  - 비용: 무료

`;
  }

  if (category === "all" || category === "hobby") {
    programs += `
🎨 취미 프로그램

• 노래교실
  - 시간: 화/목 오후 1시
  - 내용: 동요, 가요 부르기
  - 비용: 무료

• 서예교실
  - 시간: 수 오후 2시
  - 내용: 한글/한자 서예
  - 비용: 재료비 5천원

• 그림그리기
  - 시간: 금 오전 10시
  - 내용: 수채화, 색연필화
  - 비용: 재료비 1만원

• 댄스/라인댄스
  - 시간: 월/수 오후 3시
  - 내용: 시니어 댄스
  - 비용: 무료

`;
  }

  if (category === "all" || category === "social") {
    programs += `
👥 사회활동 프로그램

• 노인 일자리 사업
  - 내용: 공익활동, 사회서비스형
  - 급여: 월 27~29만원
  - 신청: 복지관 또는 시니어클럽

• 자원봉사 활동
  - 내용: 지역사회 봉사
  - 혜택: 봉사시간 인정

• 동아리 활동
  - 내용: 등산, 바둑, 독서 등
  - 비용: 무료

`;
  }

  const result = `
🎭 ${region} 노인복지관 프로그램 안내

${dayOfWeek ? `📅 ${dayMap[dayOfWeek]} 프로그램 중심으로 안내해 드릴게요.\n` : ""}

${programs}

📝 프로그램 신청 방법:

1. 복지관 방문하여 회원 등록
2. 원하는 프로그램 신청
3. 정원 초과 시 대기

💡 팁:
• 인기 프로그램은 빨리 마감돼요!
• 학기제로 운영되는 곳이 많아요 (3월, 9월 시작)
• 수강료는 대부분 무료예요

📞 ${region} 노인복지관에 전화해서
상세 일정과 신청 방법을 확인해보세요!

관심있는 프로그램이 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}

// 어르신 교육 프로그램 찾기
async function findSeniorEducation(
  args: Record<string, unknown> | undefined
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const region = (args?.region as string) || "";
  const subject = (args?.subject as string) || "";

  let subjectInfo = "";

  if (!subject || subject.includes("스마트폰") || subject.includes("핸드폰")) {
    subjectInfo += `
📱 스마트폰 교육

• 노인복지관 스마트폰 교실
  - 내용: 카카오톡, 사진, 유튜브, 지도
  - 비용: 무료
  - 신청: 복지관 방문

• 디지털배움터 (무료)
  - 전국 도서관, 주민센터
  - 1:1 또는 그룹 교육
  - 예약: www.디지털배움터.kr

• 통신사 시니어 교실
  - SKT, KT, LG 대리점
  - 월 1~2회 무료 교육

`;
  }

  if (!subject || subject.includes("컴퓨터")) {
    subjectInfo += `
💻 컴퓨터 교육

• 주민센터 정보화 교육
  - 내용: 한글, 엑셀, 인터넷
  - 비용: 무료
  - 신청: 구청 홈페이지

• 평생학습관
  - 내용: 컴퓨터 기초~활용
  - 비용: 무료~저렴

`;
  }

  if (!subject || subject.includes("영어") || subject.includes("외국어")) {
    subjectInfo += `
🌍 외국어 교육

• 복지관 영어교실
  - 내용: 기초 영어회화
  - 비용: 무료

• 평생학습관 외국어 강좌
  - 내용: 영어, 일본어, 중국어
  - 비용: 수강료 저렴 (1~5만원)

`;
  }

  if (!subject || subject.includes("예술") || subject.includes("서예") || subject.includes("그림")) {
    subjectInfo += `
🎨 예술/문화 교육

• 서예교실
  - 노인복지관, 문화센터
  - 비용: 무료~재료비

• 수채화/한국화
  - 내용: 그림 그리기
  - 비용: 재료비 1~2만원

• 사진교실
  - 내용: 스마트폰/카메라 촬영
  - 비용: 무료~저렴

`;
  }

  const result = `
📖 ${region} 어르신 교육 프로그램 안내

${subject ? `🔍 "${subject}" 관련 교육을 찾아봤어요!\n` : ""}

${subjectInfo}

🏫 교육기관 찾기:

1️⃣ 노인복지관
   • 가장 많은 어르신 교육
   • 회원 가입 후 수강
   • 대부분 무료

2️⃣ 평생학습관
   • 구청/시청 운영
   • 다양한 강좌
   • 저렴한 수강료

3️⃣ 주민센터
   • 정보화 교육 중심
   • 무료

4️⃣ 도서관
   • 독서, 글쓰기 프로그램
   • 무료

📞 교육 문의:
• ${region} 평생학습관: 구청 대표번호
• 노인복지관: 지역번호 + 114 문의
• 교육부 평생학습포털: www.lifelongedu.go.kr

배우고 싶은 것이 더 있으시면 말씀해 주세요! 😊
  `;

  return {
    content: [{ type: "text", text: result.trim() }],
  };
}
