import { Gender, AgeGroup, Region } from '@prisma/client';

export function toGenderEnum(label: string): Gender {
  const value = label.trim().toUpperCase();
  switch (value) {
    case '남성':
    case 'MALE':
      return 'MALE';
    case '여성':
    case 'FEMALE':
      return 'FEMALE';
    default:
      throw new Error(`잘못된 성별 값: ${label}`);
  }
}

export function toAgeGroupEnum(label?: string): AgeGroup {
  const value = label?.trim().toUpperCase();
  switch (value) {
    case '10대':
    case 'TEENAGER':
      return 'TEENAGER';
    case '20대':
    case 'TWENTIES':
      return 'TWENTIES';
    case '30대':
    case 'THIRTIES':
      return 'THIRTIES';
    case '40대':
    case 'FORTIES':
      return 'FORTIES';
    case '50대':
    case 'FIFTIES':
      return 'FIFTIES';
    case '60대':
    case 'SIXTIES':
      return 'SIXTIES';
    case '70대':
    case 'SEVENTIES':
      return 'SEVENTIES';
    case '80대':
    case 'EIGHTIES':
      return 'EIGHTIES';
    default:
      throw new Error(`잘못된 연령대 값: ${label}`);
  }
}

export function toRegionEnum(label?: string): Region {
  const value = label?.trim().toUpperCase();
  switch (value) {
    case '서울':
    case 'SEOUL':
      return 'SEOUL';
    case '경기':
    case 'GYEONGGI':
      return 'GYEONGGI';
    case '인천':
    case 'INCHEON':
      return 'INCHEON';
    case '강원':
    case 'GANGWON':
      return 'GANGWON';
    case '충북':
    case 'CHUNGBUK':
      return 'CHUNGBUK';
    case '충남':
    case 'CHUNGNAM':
      return 'CHUNGNAM';
    case '세종':
    case 'SEJONG':
      return 'SEJONG';
    case '대전':
    case 'DAEJEON':
      return 'DAEJEON';
    case '전북':
    case 'JEONBUK':
      return 'JEONBUK';
    case '전남':
    case 'JEONNAM':
      return 'JEONNAM';
    case '광주':
    case 'GWANGJU':
      return 'GWANGJU';
    case '경북':
    case 'GYEONGBUK':
      return 'GYEONGBUK';
    case '경남':
    case 'GYEONGNAM':
      return 'GYEONGNAM';
    case '대구':
    case 'DAEGU':
      return 'DAEGU';
    case '울산':
    case 'ULSAN':
      return 'ULSAN';
    case '부산':
    case 'BUSAN':
      return 'BUSAN';
    case '제주':
    case 'JEJU':
      return 'JEJU';
    default:
      throw new Error(`잘못된 지역 값: ${label}`);
  }
}
