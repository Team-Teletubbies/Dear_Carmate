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
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const statuses = ['possession', 'contractProceeding', 'contractCompleted'] as const;
type StatusType = (typeof statuses)[number]; // 'possession' | 'contractProceeding' | 'contractCompleted' 리터럴 유니언 타입을 생성

function toPrismaCarStatus(status: string): string {
  return status.replace(/([A-Z])/g, '_$1').toUpperCase();
}

export function mapCarStatus(status: string): string {
  const normalizedCarStatus = status ?? 'possession'; // possession 기본값 설정

  if (!statuses.includes(status as StatusType)) {
    // request data와 검증
    throw new Error(`Invalid carStatus: ${status}`);
  }
  return toPrismaCarStatus(normalizedCarStatus);
}

const carSearchKeys = ['carNumber', 'model', 'carStatus'] as const;

export const carFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(carSearchKeys)),
  status: optional(enums(statuses)),
});

export type CarFilter = Infer<typeof carFilterStruct>;

export const createCarBodyStruct = object({
  carNumber: size(nonempty(string()), 7, 8),
  manufacturer: nonempty(string()),
  model: nonempty(string()),
  manufacturingYear: max(min(integer(), 1975), 2025),
  mileage: max(min(integer(), 1), 1000000),
  price: max(min(integer(), 1), 1000000000),
  accidentCount: defaulted(min(integer(), 0), 0),
  explanation: nullable(size(string(), 0, 300)),
  accidentDetails: nullable(size(string(), 0, 300)),
  carStatus: defaulted(enums(statuses), 'possession'), // possession 기본값 설정
});

export const updateCarBodyStruct = partial(createCarBodyStruct);
