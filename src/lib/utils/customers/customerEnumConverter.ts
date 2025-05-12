import { Gender, AgeGroup, Region } from '@prisma/client';

export function toGenderEnum(label: string): Gender {
  if (!label) throw new Error('성별 값이 없습니다.');
  if (label === '남성') return 'MALE';
  if (label === '여성') return 'FEMALE';

  const value = label.trim().toUpperCase();
  if (value === 'MALE' || value === 'FEMALE') return value as Gender;

  throw new Error(`잘못된 성별 값: ${label}`);
}

export function toAgeGroupEnum(label?: string): AgeGroup {
  if (!label) throw new Error('연령대 값이 없습니다.');
  if (label.endsWith('대')) {
    const korToEnum: Record<string, AgeGroup> = {
      '10대': 'TEENAGER',
      '20대': 'TWENTIES',
      '30대': 'THIRTIES',
      '40대': 'FORTIES',
      '50대': 'FIFTIES',
      '60대': 'SIXTIES',
      '70대': 'SEVENTIES',
      '80대': 'EIGHTIES',
    };
    if (!(label in korToEnum)) throw new Error(`잘못된 연령대 한글 값: ${label}`);
    return korToEnum[label];
  }

  const value = label.trim().toUpperCase();
  if (
    [
      'TEENAGER',
      'TWENTIES',
      'THIRTIES',
      'FORTIES',
      'FIFTIES',
      'SIXTIES',
      'SEVENTIES',
      'EIGHTIES',
    ].includes(value)
  ) {
    return value as AgeGroup;
  }

  throw new Error(`잘못된 연령대 값: ${label}`);
}

export function toRegionEnum(label?: string): Region {
  if (!label) throw new Error('지역 값이 없습니다.');
  const korToEnum: Record<string, Region> = {
    서울: 'SEOUL',
    경기: 'GYEONGGI',
    인천: 'INCHEON',
    강원: 'GANGWON',
    충북: 'CHUNGBUK',
    충남: 'CHUNGNAM',
    세종: 'SEJONG',
    대전: 'DAEJEON',
    전북: 'JEONBUK',
    전남: 'JEONNAM',
    광주: 'GWANGJU',
    경북: 'GYEONGBUK',
    경남: 'GYEONGNAM',
    대구: 'DAEGU',
    울산: 'ULSAN',
    부산: 'BUSAN',
    제주: 'JEJU',
  };

  if (label in korToEnum) return korToEnum[label];

  const value = label.trim().toUpperCase();
  const enumValues = Object.values(korToEnum);
  if (enumValues.includes(value as Region)) return value as Region;

  throw new Error(`잘못된 지역 값: ${label}`);
}
