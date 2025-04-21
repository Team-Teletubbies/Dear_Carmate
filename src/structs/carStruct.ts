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
  nullable,
  coerce,
  union,
  literal,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const statuses = ['possession', 'contractProceeding', 'contractCompleted'] as const;
export const CarStatusStruct = coerce(
  union(statuses.map((status) => literal(status)) as [any, any, any]),
  string(),
  (value) => value.toUpperCase(),
);

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
  manufacturingYear: max(min(integer(), 1975), 2025),
  mileage: max(min(integer(), 1), 1000000),
  price: max(min(integer(), 1), 1000000000),
  accidentCount: defaulted(min(integer(), 0), 0),
  explanation: nullable(size(string(), 0, 300)),
  accidentDetails: nullable(size(string(), 0, 300)),
  carStatus: optional(CarStatusStruct),
});

export const updateCarBodyStruct = partial(createCarBodyStruct);
