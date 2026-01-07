# 시니어 라이프 케어 MCP

어르신의 일상을 함께하는 AI 동반자 - Model Context Protocol (MCP) 서버

## 개요

시니어 라이프 케어는 만 60세 이상 어르신들이 복잡한 복지 제도를 쉽게 이해하고 활용할 수 있도록 돕는 MCP 서버입니다. **20개 도메인의 105개 도구**를 제공합니다.

## 도메인 및 도구 현황

| 도메인 | 설명 | 도구 수 |
|--------|------|---------|
| Pension (연금) | 기초연금, 국민연금, 장애인연금, 유공자 혜택 | 4개 |
| Health (건강) | 건강검진, 치매센터, 의료비지원, 병원찾기 | 5개 |
| Care (돌봄) | 장기요양, 돌봄서비스, 요양원, 가족돌봄 | 4개 |
| Leisure (여가) | 복지관, 경로당, 교육 프로그램 | 3개 |
| Living (생활) | 주거지원, 경로식당 | 2개 |
| Safety (안전) | 안전확인, 긴급연락처 | 2개 |
| Transport (교통) | 교통혜택, 콜택시, 운전면허 | 3개 |
| Finance (금융) | 세금감면, 공과금할인, 금융지원 | 3개 |
| Jobs (일자리) | 노인일자리, 직업훈련, 시니어클럽 | 3개 |
| Legal (법률) | 법률상담, 상속정보, 심리상담, 노인학대 | 4개 |
| Family (가족) | 가족연결, 상태공유, 도움요청 | 4개 |
| Emergency (긴급) | 긴급SOS, 낙상감지, 응급정보 | 4개 |
| Community (커뮤니티) | 모임찾기, 친구매칭, 온라인강좌 | 4개 |
| Nutrition (영양) | 식단추천, 영양체크, 도시락배달 | 6개 |
| Mobility (이동) | 경로계획, 무장애경로, 교통예약 | 6개 |
| Digital (디지털) | 앱사용법, 기기문제해결, 영상통화 | 6개 |
| Home (주거환경) | 안전점검, 수리서비스, 주거개조 | 6개 |
| Wellness (웰니스) | 기분추적, 수면관리, 두뇌운동 | 6개 |
| Benefits (혜택) | 할인혜택, 무료서비스, 생일혜택 | 6개 |
| **Anti-Fraud (사기예방)** | 보이스피싱/스미싱 탐지, 사기교육, 대응훈련 | 5개 |

**총 105개 도구**

## 주요 기능

### 연금/복지
- `check_basic_pension` - 기초연금 수급 자격 및 예상 금액
- `calculate_national_pension` - 국민연금 예상 수령액 계산
- `check_disability_pension` - 장애인연금 수급 자격
- `check_veteran_benefits` - 국가유공자 복지 혜택

### 건강/의료
- `check_health_screening` - 국가건강검진 항목 및 일정
- `find_dementia_center` - 치매안심센터 찾기
- `dementia_self_check` - 간이 치매 자가진단 (KDSQ-P)
- `find_senior_hospital` - 어르신 친화 의료기관 찾기
- `check_medical_expense_support` - 의료비 지원 제도

### 사기 예방 (Anti-Fraud)
- `detect_voice_phishing` - 보이스피싱 실시간 탐지
- `detect_smishing` - 스미싱 문자 분석
- `verify_caller` - 발신자 진위 확인
- `fraud_education` - 사기 예방 교육
- `scam_simulation` - 사기 대응 훈련

## 설치 및 실행

```bash
# 설치
cd senior-life-care-mcp
npm install

# 빌드
npm run build

# 실행 (HTTP 서버)
npm start

# 또는 stdio 모드
node dist/stdio.js
```

## 엔드포인트

| 엔드포인트 | 용도 |
|------------|------|
| `/` | 서비스 정보 |
| `/health` | 헬스체크 |
| `/mcp` | MCP Streamable HTTP (PlayMCP 호환) |
| `/sse` | SSE 연결 |
| `/messages` | 메시지 수신 |

## MCP 설정 예시

### Claude Desktop (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "senior-life-care": {
      "command": "node",
      "args": ["경로/senior-life-care-mcp/dist/stdio.js"]
    }
  }
}
```

### PlayMCP (원격 서버)

```
https://your-server.com/mcp
```

## 사용 예시

### 기초연금 확인
```
"기초연금 받을 수 있는지 알려주세요. 나이 70세, 단독가구입니다."
```

### 보이스피싱 탐지
```
"방금 검찰에서 전화가 왔는데, 계좌가 범죄에 연루됐다고 합니다. 사기인가요?"
```

### 치매 자가진단
```
"치매 자가진단 해볼게요."
```

### 경로식당 찾기
```
"강남구에서 점심 먹을 수 있는 경로식당 찾아주세요."
```

## 테스트 결과

- **테스트 도구**: 29개 대표 도구
- **통과율**: 100% (29/29)
- **테스트 일시**: 2026-01-07

자세한 내용은 [test-results.md](./senior-life-care-mcp/test-results.md) 참조

## 기술 스택

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Protocol**: Model Context Protocol (MCP) 2024-11-05
- **SDK**: @modelcontextprotocol/sdk
- **Framework**: Express.js

## 라이선스

MIT License

## 제작

카카오 PlayMCP Player 10 대회 출품작
