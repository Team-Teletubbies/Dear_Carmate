import { CarStatus } from '@prisma/client';
import { GetCompanyListDTO } from './companyDto';

export function fromEnumStyle(value: string | undefined): string {
  return value!.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

export interface carRegistUpdateDTO {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  status: 'possession' | 'contractProceeding' | 'contractCompleted';
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
  status: CarStatus;
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
    status: fromEnumStyle(car.status) as carRegistUpdateDTO['status'],
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
  explanation: string | null;
  accidentDetails: string | null;
}

export type SearchField = 'carNumber' | 'model' | 'carStatus';

export interface GetCarListDTO extends GetCompanyListDTO {
  searchBy?: SearchField;
}

export interface CarCsvRow {
  carNumber: string;
  manufacturer: string;
  model: string;
  type: string;
  mileage: string;
  manufacturingYear: string;
  price: string;
  carStatus: string;
  accidentCount: string;
  explanation: string | null;
  accidentDetails: string | null;
}
