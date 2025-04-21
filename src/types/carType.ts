import { CarStatus } from '@prisma/client';

export type CarType = {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
  carStatus: 'possession' | 'contractProceeding' | 'contractCompleted';
};
