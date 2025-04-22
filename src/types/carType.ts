import { CarStatus } from '@prisma/client';

export type CarType = {
  carNumber: string;
  manufacturer: string;
  model: string;
  mileage: number;
  manufacturingYear: number;
  price: number;
  carStatus: 'possession' | 'contractProceeding' | 'contractCompleted';
  accidentCount: number;
  explanation: string | null;
  accidentDetails: string | null;
};
