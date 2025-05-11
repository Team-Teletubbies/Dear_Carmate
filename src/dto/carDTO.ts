import { CarStatus } from '@prisma/client';
import { GetCompanyListDTO } from './companyDto';

export function fromEnumStyle(value?: string): string {
  if (!value) return '';
  return value.toLowerCase().replace(/_([a-z])/g, (_, g) => g.toUpperCase());
}

export type CarStatusDTO = 'possession' | 'contractProceeding' | 'contractCompleted';

export interface CarRegisterRequestDTO {
  manufacturer: string;
  model: string;
  carNumber: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  carStatus: CarStatusDTO;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
}

export interface CarRegistUpdateDTO {
  id: number;
  carNumber: string;
  manufacturer: string;
  model: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  status: CarStatusDTO;
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
}): CarRegistUpdateDTO {
  return {
    id: car.id,
    carNumber: car.carNumber,
    manufacturer: car.manufacturer.name,
    model: car.model.name,
    type: car.model.type,
    mileage: car.mileage,
    manufacturingYear: car.manufacturingYear,
    price: car.price,
    status: fromEnumStyle(car.carStatus) as CarStatusDTO,

    accidentCount: car.accidentCount,
    explanation: car.explanation,
    accidentDetails: car.accidentDetails,
  };
}

export interface CarWithModelAndManufacturerDTO {
  id: number;
  carNumber: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
  carStatus: CarStatus;
  model: {
    id: number;
    name: string;
    type: string;
    manufacturer: {
      name: string;
    };
  };
}

export type SearchField = 'carNumber' | 'model';

export interface GetCarParamsDTO extends GetCompanyListDTO {
  status?: CarStatusDTO;
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

export interface ManufacturerDTO {
  id: number;
  name: string;
}

export interface ManufacturerModelDTO {
  manufacturer: string;
  model: string[];
}

export interface GetManufacturerModelListResponseDTO {
  data: ManufacturerModelDTO[];
}

export interface momdelDTO {
  id: number;
  name: string;
  type: String;
}
