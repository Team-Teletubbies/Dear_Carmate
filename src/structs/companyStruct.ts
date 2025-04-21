import { string, object, enums, optional, nonempty, size, partial } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const companySearchKey = ['companyName', 'companyCode'] as const;
// 오타가 있어서 여기 수정했습니다

export const companyFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(companySearchKey)),
});

export const createCompanyBodyStruct = object({
  companyName: size(nonempty(string()), 1, 30),
  companyCode: size(nonempty(string()), 1, 30),
});

export const updateCompanyBodyStruct = partial(createCompanyBodyStruct);
