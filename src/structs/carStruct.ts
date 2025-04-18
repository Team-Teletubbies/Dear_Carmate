import {
  string,
  object,
  enums,
  optional,
  Infer,
  nonempty,
  integer,
  min,
  max,
  defaulted,
  size,
  partial,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';
import { CarStatus } from '@prisma/client';

const statuses = [
  CarStatus.POSSESSION,
  CarStatus.CONTRACT_PROCEEDING,
  CarStatus.CONTRACT_COMPLETED,
] as const;

const carSearchKeys = ['carNumber', 'model'] as const;
export const carFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(carSearchKeys)),
  status: optional(enums(statuses)),
});

export type CarFilter = Infer<typeof carFilterStruct>;

export const createCarBodyStruct = object({
  carNumber: size(nonempty(string()), 8, 30),
  manufacturer: nonempty(string()),
  model: nonempty(string()),
  manufacturingYear: min(max(integer(), 1975), 2025),
  price: max(min(integer(), 1), 1000000000),
  accidentCount: defaulted(min(integer(), 0), 0),
  explanation: optional(size(string(), 0, 300)),
  accidentDetails: optional(size(string(), 0, 300)),
});

export const updateCarBodyStruct = partial(createCarBodyStruct);
