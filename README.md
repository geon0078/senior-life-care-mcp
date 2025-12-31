# 시니어 라이프 케어 MCP

어르신의 일상을 함께하는 AI 동반자 - Model Context Protocol (MCP) 서버

## 개요

시니어 라이프 케어는 만 60세 이상 어르신들이 복잡한 복지 제도를 쉽게 이해하고 활용할 수 있도록 돕는 MCP 서버입니다. 연금, 건강, 돌봄, 여가, 생활, 안전 등 6개 분야의 20개 도구를 제공합니다.

## 제공 도구 (20개)

### 연금/복지 (4개)
| 도구 | 설명 |
|------|------|
| `check_basic_pension` | 기초연금 수급 자격 및 예상 금액 안내 |
| `calculate_national_pension` | 국민연금 예상 수령액 계산 |
| `check_disability_pension` | 장애인연금 수급 자격 안내 |
| `check_veteran_benefits` | 국가유공자 복지 혜택 안내 |

### 건강/의료 (5개)
| 도구 | 설명 |
|------|------|
| `check_health_screening` | 국가건강검진 항목 및 일정 안내 |
| `find_dementia_center` | 치매안심센터 찾기 및 서비스 안내 |
| `dementia_self_check` | 간이 치매 자가진단 (KDSQ-P) |
| `find_senior_hospital` | 어르신 친화 의료기관 찾기 |
| `check_medical_expense_support` | 의료비 지원 제도 안내 |

### 돌봄/요양 (4개)
| 도구 | 설명 |
|------|------|
| `check_long_term_care` | 노인장기요양등급 및 서비스 안내 |
| `find_care_service` | 재가/방문 돌봄서비스 찾기 |
| `find_nursing_home` | 요양원/요양병원 찾기 |
| `check_caregiver_support` | 가족 돌봄자 지원 서비스 안내 |

### 여가/문화 (3개)
| 도구 | 설명 |
|------|------|
| `find_senior_center` | 경로당/노인복지관 찾기 |
| `get_welfare_programs` | 복지관 프로그램 조회 |
| `find_senior_education` | 어르신 교육 프로그램 찾기 |

### 생활지원 (2개)
| 도구 | 설명 |
|------|------|
| `check_housing_support` | 주거지원 제도 안내 |
| `find_meal_service` | 경로식당/도시락 배달 서비스 찾기 |

### 안전/긴급 (2개)
| 도구 | 설명 |
|------|------|
| `emergency_contacts` | 긴급 연락처 안내 |
| `check_safety_service` | 독거노인 안전확인 서비스 안내 |

## 설치

```bash
npm install
```

## 빌드

```bash
npm run build
```

## 실행

```bash
npm start
```

## MCP Inspector로 테스트

```bash
npx @anthropic-ai/mcp-inspector node dist/index.js
```

## MCP 설정 예시

### Claude Desktop (claude_desktop_config.json)

```json
{
  "mcpServers": {
    "senior-life-care": {
      "command": "node",
      "args": ["경로/senior-life-care-mcp/dist/index.js"]
    }
  }
}
```

## 사용 예시

### 기초연금 확인
```
"기초연금 받을 수 있는지 알려주세요. 나이 70세, 단독가구입니다."
```

### 치매 자가진단
```
"치매 자가진단 해볼게요."
```

### 경로식당 찾기
```
"강남구에서 점심 먹을 수 있는 경로식당 찾아주세요."
```

### 긴급 연락처
```
"어르신이 알아야 할 긴급 전화번호 알려주세요."
```

## 기술 스택

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Protocol**: Model Context Protocol (MCP)
- **SDK**: @modelcontextprotocol/sdk

## 라이선스

MIT License

## 제작

카카오 PlayMCP Player 10 대회 출품작
