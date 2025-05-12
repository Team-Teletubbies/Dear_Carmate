import { object, enums, optional } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const contractDocumentStructKey = ['contractName', 'userName', 'carNumber'] as const;
export type ContractDocumentStructKey = (typeof contractDocumentStructKey)[number];
export const contractDocumentFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(contractDocumentStructKey)),
});
