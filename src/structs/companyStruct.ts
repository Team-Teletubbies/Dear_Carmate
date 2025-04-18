import { string, object, enums, optional, nonempty, size, partial } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const companySerchKey = ['companyName', 'companyCode'] as const;

export const companyFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(companySerchKey)),
});

export const createCompanyBodyStruct = object({
  companyName: size(nonempty(string()), 1, 30),
  companyCode: size(nonempty(string()), 1, 30),
});

export const updateCompanyBodyStruct = partial(createCompanyBodyStruct);
