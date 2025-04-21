import { CarStatus } from '@prisma/client';
// import { statuses, StatusType } from '../structs/carStruct';

export function fromEnumStyle(value: string): string {
  return value.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

export interface carRegistUpdateDTO {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
  carStatus: CarStatus;
  type: string;
}

export function mapCarDTO(car: {
  id: number;
  carNumber: string;
  manufacturer: { name: string };
  model: { name: string; type: string };
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
  carStatus: CarStatus;
}): carRegistUpdateDTO {
  return {
    id: car.id,
    carNumber: car.carNumber,
    manufacturer: car.manufacturer.name,
    model: car.model.name,
    type: car.model.type,
    manufacturingYear: car.manufacturingYear,
    mileage: car.mileage,
    price: car.price,
    accidentCount: car.accidentCount,
    explanation: car.explanation,
    accidentDetails: car.accidentDetails,
    carStatus: fromEnumStyle(car.carStatus) as carRegistUpdateDTO['carStatus'],
  };
}

// function toPrismaCarStatus(rawStatus: string): string {
//   return rawStatus.replace(/([A-Z])/g, '_$1').toUpperCase();
// }

// // 3. 최종 변환 함수 (검증 + 변환)
// export function mapCarStatus(rawStatus: string): string {
//   if (!statuses.includes(rawStatus as StatusType)) {
//     throw new Error(`Invalid carStatus: ${rawStatus}`);
//   }
//   return toPrismaCarStatus(rawStatus);
// }

export interface CarRegisterRequestDTO {
  manufacturer: string;
  model: string;
  carNumber: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string | null;
  accidentDetails?: string | null;
  carStatus: 'possession' | 'contractProceeding' | 'contractCompleted';
}
