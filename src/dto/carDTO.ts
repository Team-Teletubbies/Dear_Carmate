import { CarStatus } from '@prisma/client';

export function fromEnumStyle(value: string): string {
  return value.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

export interface carRegistUpdateDTO {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  carStatus: CarStatus;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
  type: string;
}

export function mapCarDTO(car: {
  id: number;
  carNumber: string;
  manufacturer: { name: string };
  model: { name: string; type: string };
  mileage: number;
  manufacturingYear: number;
  price: number;
  carStatus: CarStatus;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
}): carRegistUpdateDTO {
  return {
    id: car.id,
    carNumber: car.carNumber,
    manufacturer: car.manufacturer.name,
    model: car.model.name,
    type: car.model.type,
    mileage: car.mileage,
    manufacturingYear: car.manufacturingYear,
    price: car.price,
    carStatus: fromEnumStyle(car.carStatus) as carRegistUpdateDTO['carStatus'],
    accidentCount: car.accidentCount,
    explanation: car.explanation,
    accidentDetails: car.accidentDetails,
  };
}

export interface CarRegisterRequestDTO {
  manufacturer: string;
  model: string;
  carNumber: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  carStatus: 'possession' | 'contractProceeding' | 'contractCompleted';
  accidentCount: number;
  explanation?: string | null;
  accidentDetails?: string | null;
}
