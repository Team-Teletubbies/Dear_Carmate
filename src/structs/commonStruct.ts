import { coerce, integer, string, object, defaulted, optional, nonempty, Infer } from 'superstruct';

const integerString = coerce(integer(), string(), (value: string) => parseInt(value));

export const IdParamsStruct = object({
  id: integerString,
});

export type IdParams = Infer<typeof IdParamsStruct>;

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(integerString, 8),
  keyword: optional(nonempty(string())),
});

export type PageParams = Infer<typeof PageParamsStruct>;
