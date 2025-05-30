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
  StructError,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

export const statuses = ['possession', 'contractProceeding', 'contractCompleted'] as const;

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
  carStatus: defaulted(enums(statuses), 'possession'),
});

export const updateCarBodyStruct = partial(createCarBodyStruct);

export function mapCreateCarError(error: StructError) {
  const field = error.path[0] as string;

  const messages: Record<string, string> = {
    carNumber: '차량 번호는 7~8자리 문자열입니다',
    manufacturer: '올바른 제조사를 입력하세요',
    model: '올바른 모델명을 입력하세요',
    manufacturingYear: '제조연도는 1975 ~ 2025 사이의 숫자입니다',
    mileage: '주행거리는 1 ~ 1000000 사이의 숫자입니다',
    price: '가격은 1 ~ 1000000000 사이의 숫자입니다',
    accidentCount: '사고 횟수는 0 이상의 숫자입니다',
    explanation: '설명은 최대 300자까지 입력할 수 있습니다',
    accidentDetails: '사고 이력은 최대 300자까지 입력할 수 있습니다',
    carStatus: '올바른 차량상태를 입력하세요',
  };

  return messages[field] || '잘못된 요청입니다';
}
