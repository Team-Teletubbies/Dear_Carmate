import { CarStatus } from '@prisma/client';

export type CarType = {
  id: number;
  companyId: number;
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
  createdAt: Date;
  updatedAt: Date;
};
