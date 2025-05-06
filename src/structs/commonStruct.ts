import {
  coerce,
  integer,
  string,
  object,
  defaulted,
  optional,
  nonempty,
  Infer,
  min,
  max,
  size,
} from 'superstruct';

const integerString = coerce(min(integer(), 1), string(), (value: string) => parseInt(value));
const limitedIntegerString = coerce(max(min(integer(), 1), 100), string(), (value: string) =>
  parseInt(value),
);

export const IdParamsStruct = object({
  id: integerString,
});

export type IdParams = Infer<typeof IdParamsStruct>;

export const PageParamsStruct = object({
  page: defaulted(integerString, 1),
  pageSize: defaulted(limitedIntegerString, 8),
  keyword: optional(size(string(), 0, 100)),
});

export type PageParams = Infer<typeof PageParamsStruct>;
