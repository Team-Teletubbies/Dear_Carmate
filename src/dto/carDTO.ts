import { CarStatus } from '@prisma/client';

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
    carStatus: car.carStatus.toLowerCase() as carRegistUpdateDTO['carStatus'],
  };
}
