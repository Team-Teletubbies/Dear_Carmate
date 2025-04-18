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
import { AgeGroup, Gender, Region } from '@prisma/client';

const customerSearchKey = ['name', 'email'] as const;
const genders = [Gender.male, Gender.female];
const ageGroups = [AgeGroup.AGE_10];
const regions = [Region.BUSAN];

export const customerFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(customerSearchKey)),
});

const email = refine(size(nonempty(string()), 1, 30), 'email', (value) => value.includes('@'));

export const createCustomerBodyStruct = object({
  name: size(nonempty(string()), 1, 10),
  gender: defaulted(enums(genders), Gender.male),
  AgeGroup: optional(enums(ageGroups)),
  region: optional(enums(regions)),
  email: email,
  memo: optional(size(nonempty(string()), 1, 200)),
});

export const updateCustomerBodyStruct = partial(createCustomerBodyStruct);
