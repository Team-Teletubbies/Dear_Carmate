import {
  string,
  object,
  enums,
  optional,
  nonempty,
  defaulted,
  size,
  partial,
  refine,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const customerSearchKey = ['name', 'email'] as const;
const genders = ['male', 'female'] as const;
const ageGroups = ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'] as const;
const regions = [
  '서울',
  '경기',
  '인천',
  '강원',
  '충북',
  '충남',
  '세종',
  '대전',
  '전북',
  '전남',
  '광주',
  '경북',
  '경남',
  '대구',
  '울산',
  '부산',
  '제주',
] as const;

export const customerFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(customerSearchKey)),
});

const email = refine(size(nonempty(string()), 1, 30), 'email', (value) => value.includes('@'));

export const createCustomerBodyStruct = object({
  name: size(nonempty(string()), 1, 10),
  gender: defaulted(enums(genders), 'male'),
  AgeGroup: optional(enums(ageGroups)),
  region: optional(enums(regions)),
  email: email,
  memo: optional(size(nonempty(string()), 1, 200)),
});

export const updateCustomerBodyStruct = partial(createCustomerBodyStruct);
