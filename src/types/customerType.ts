import { Gender, AgeGroup, Region } from '@prisma/client';

export type GenderLabel = '남성' | '여성';
export type AgeGroupLabel = '10대' | '20대' | '30대' | '40대' | '50대' | '60대' | '70대' | '80대';
export type RegionLabel =
  | '서울'
  | '경기'
  | '인천'
  | '강원'
  | '충북'
  | '충남'
  | '세종'
  | '대전'
  | '전북'
  | '전남'
  | '광주'
  | '경북'
  | '경남'
  | '대구'
  | '울산'
  | '부산'
  | '제주';

export const genderToLabel = {
  MALE: '남성',
  FEMALE: '여성',
};

export const ageGroupToLabel = {
  TEENAGER: '10대',
  TWENTIES: '20대',
  THIRTIES: '30대',
  FORTIES: '40대',
  FIFTIES: '50대',
  SIXTIES: '60대',
  SEVENTIES: '70대',
  EIGHTIES: '80대',
};

export const regionToLabel = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  SEJONG: '세종',
  DAEJEON: '대전',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GWANGJU: '광주',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  DAEGU: '대구',
  ULSAN: '울산',
  BUSAN: '부산',
  JEJU: '제주',
};

export function toGenderEnum(label: string): Gender {
  switch (label) {
    case '남성':
      return 'MALE';
    case '여성':
      return 'FEMALE';
    default:
      throw new Error(`잘못된 성별 값: ${label}`);
  }
}

export function toAgeGroupEnum(label?: string): AgeGroup | undefined {
  switch (label) {
    case '10대':
      return 'TEENAGER';
    case '20대':
      return 'TWENTIES';
    case '30대':
      return 'THIRTIES';
    case '40대':
      return 'FORTIES';
    case '50대':
      return 'FIFTIES';
    case '60대':
      return 'SIXTIES';
    case '70대':
      return 'SEVENTIES';
    case '80대':
      return 'EIGHTIES';
    case undefined:
      return undefined;
    default:
      throw new Error(`잘못된 연령대 값: ${label}`);
  }
}

export function toRegionEnum(label?: string): Region | undefined {
  switch (label) {
    case '서울':
      return 'SEOUL';
    case '경기':
      return 'GYEONGGI';
    case '인천':
      return 'INCHEON';
    case '강원':
      return 'GANGWON';
    case '충북':
      return 'CHUNGBUK';
    case '충남':
      return 'CHUNGNAM';
    case '세종':
      return 'SEJONG';
    case '대전':
      return 'DAEJEON';
    case '전북':
      return 'JEONBUK';
    case '전남':
      return 'JEONNAM';
    case '광주':
      return 'GWANGJU';
    case '경북':
      return 'GYEONGBUK';
    case '경남':
      return 'GYEONGNAM';
    case '대구':
      return 'DAEGU';
    case '울산':
      return 'ULSAN';
    case '부산':
      return 'BUSAN';
    case '제주':
      return 'JEJU';
    case undefined:
      return undefined;
    default:
      throw new Error(`잘못된 지역 값: ${label}`);
  }
}
