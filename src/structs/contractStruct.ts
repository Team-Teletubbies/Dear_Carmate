import {
  string,
  object,
  enums,
  optional,
  array,
  nonempty,
  integer,
  partial,
  nullable,
} from 'superstruct';
import { PageParamsStruct } from './commonStruct';
import { statusKeys } from '../lib/utils/statusMap';

const contractStructKey = ['customerName', 'userName'] as const;
export type ContractStructKey = (typeof contractStructKey)[number];
export const contractFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(contractStructKey)),
});
const alarmStruct = string();

const meetingStruct = object({
  date: string(),
  alarms: optional(nonempty(array(alarmStruct))),
});

const contractDocumentStruct = object({
  id: optional(integer()),
  fileName: optional(string()),
});

export const createContractBodyStruct = object({
  carId: integer(),
  customerId: integer(),
  meetings: optional(array(meetingStruct)),
});

const contractStatusKey = statusKeys;

export const updateContractBodyStruct = partial(
  object({
    status: optional(enums(contractStatusKey)),
    resolutionDate: optional(nullable(string())),
    contractPrice: optional(integer()),
    meetings: optional(array(meetingStruct)),
    contractDocuments: optional(array(contractDocumentStruct)),
    userId: optional(integer()),
    customerId: optional(integer()),
    carId: optional(integer()),
    responsibleUserId: optional(integer()),
  }),
);
