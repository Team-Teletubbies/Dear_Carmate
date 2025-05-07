import { string, object, enums, optional, array, nonempty, integer, partial } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const contractStructKey = ['customerName', 'userName'] as const;
const status = ['carInspection'];
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
  id: integer(),
  fileName: optional(string()),
});

export const createContractBodyStruct = object({
  carId: integer(),
  customerId: integer(),
  meetings: optional(nonempty(array(meetingStruct))),
});

const contractStatusKey = [
  'carInspection',
  'priceNegotiation',
  'contractDraft',
  'contractSuccessful',
  'contractFailed',
] as const;

export const updateContractBodyStruct = partial(
  object({
    status: enums(contractStatusKey),
    resolutionDate: string(),
    contractPrice: integer(),
    meetings: optional(array(meetingStruct)),
    contractDocuments: optional(array(contractDocumentStruct)),
    userId: integer(),
    customerId: integer(),
    carId: integer(),
    responsibleUserId: optional(integer()),
  }),
);
