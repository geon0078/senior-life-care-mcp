/**
 * 지역명 매칭 유틸리티
 * "서울시 강남구", "서울 강남", "강남구", "강남" 등 다양한 형태의 지역명을 매칭합니다.
 */

// 지역명 정규화
export function normalizeRegion(region: string): string {
  if (!region) return "";

  // 공백 정리 및 소문자 변환 (한글은 영향 없음)
  let normalized = region.trim();

  // "시", "도", "구", "군", "동" 접미사 제거하여 핵심 지역명 추출
  // 예: "서울특별시" → "서울", "강남구" → "강남"
  return normalized;
}

// 지역명에서 구/군 단위 추출
export function extractDistrict(region: string): string | null {
  if (!region) return null;

  // "구" 또는 "군"으로 끝나는 부분 추출
  const districtMatch = region.match(/([가-힣]+[구군])/);
  if (districtMatch) {
    return districtMatch[1];
  }

  return null;
}

// 지역명에서 시/도 단위 추출
export function extractCity(region: string): string | null {
  if (!region) return null;

  // "시" 또는 "도"로 끝나는 부분 추출
  const cityPatterns = [
    /([가-힣]+특별시)/,  // 서울특별시
    /([가-힣]+광역시)/,  // 부산광역시
    /([가-힣]+시)/,      // 수원시
    /([가-힣]+도)/,      // 경기도
  ];

  for (const pattern of cityPatterns) {
    const match = region.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // 시/도 없이 도시명만 있는 경우 (예: "서울", "부산")
  const cityNames = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  for (const city of cityNames) {
    if (region.includes(city)) {
      return city;
    }
  }

  return null;
}

/**
 * 데이터의 키들 중에서 입력 지역과 가장 잘 매칭되는 키를 찾습니다.
 * @param inputRegion 사용자가 입력한 지역명
 * @param dataKeys 매칭할 데이터의 키 배열
 * @returns 매칭된 키 또는 null
 */
export function findMatchingRegion(inputRegion: string, dataKeys: string[]): string | null {
  if (!inputRegion || dataKeys.length === 0) return null;

  const input = inputRegion.trim();

  // 1. 정확한 매칭 시도
  if (dataKeys.includes(input)) {
    return input;
  }

  // 2. 구/군 단위 추출하여 매칭
  const district = extractDistrict(input);
  if (district && dataKeys.includes(district)) {
    return district;
  }

  // 3. 시/도 단위 추출하여 매칭
  const city = extractCity(input);
  if (city && dataKeys.includes(city)) {
    return city;
  }

  // 4. 부분 문자열 매칭 (입력이 키에 포함되거나, 키가 입력에 포함)
  for (const key of dataKeys) {
    // 키가 입력에 포함되어 있는 경우 (예: "강남" in "서울시 강남구")
    if (input.includes(key)) {
      return key;
    }
    // 입력이 키에 포함되어 있는 경우 (예: "강남" → "강남구")
    if (key.includes(input)) {
      return key;
    }
  }

  // 5. 구/군 접미사 없이 매칭 (예: "강남" → "강남구")
  const inputWithoutSuffix = input.replace(/[구군동시도]$/, "");
  for (const key of dataKeys) {
    const keyWithoutSuffix = key.replace(/[구군동시도]$/, "");
    if (inputWithoutSuffix === keyWithoutSuffix) {
      return key;
    }
    if (keyWithoutSuffix.includes(inputWithoutSuffix) || inputWithoutSuffix.includes(keyWithoutSuffix)) {
      return key;
    }
  }

  return null;
}

/**
 * 데이터 객체에서 지역 기반으로 값을 찾습니다.
 * @param inputRegion 사용자가 입력한 지역명
 * @param data 지역을 키로 하는 데이터 객체
 * @param fallbackKey 매칭 실패 시 사용할 기본 키 (예: "서울")
 * @returns 매칭된 데이터와 매칭 정보
 */
export function findRegionData<T>(
  inputRegion: string,
  data: Record<string, T>,
  fallbackKey?: string
): { matched: boolean; key: string; value: T } | null {
  const keys = Object.keys(data);
  const matchedKey = findMatchingRegion(inputRegion, keys);

  if (matchedKey) {
    return {
      matched: true,
      key: matchedKey,
      value: data[matchedKey],
    };
  }

  // 폴백 키가 있으면 사용
  if (fallbackKey && data[fallbackKey]) {
    return {
      matched: false,
      key: fallbackKey,
      value: data[fallbackKey],
    };
  }

  // 첫 번째 키를 폴백으로 사용
  if (keys.length > 0) {
    return {
      matched: false,
      key: keys[0],
      value: data[keys[0]],
    };
  }

  return null;
}
