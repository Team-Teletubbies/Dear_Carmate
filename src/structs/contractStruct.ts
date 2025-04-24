import { string, object, enums, optional, array, nonempty, integer, partial } from 'superstruct';
import { PageParamsStruct } from './commonStruct';

const contractStructKey = ['customerName', 'userName'] as const;

export const contractFilterStruct = object({
  ...PageParamsStruct.schema,
  searchBy: optional(enums(contractStructKey)),
});
const alarmStruct = string();

const meetingStruct = object({
  date: string(),
  alarms: optional(nonempty(array(alarmStruct))),
});
export const createContractBodyStruct = object({
  carId: integer(),
  customerId: integer(),
  meetings: optional(nonempty(array(meetingStruct))),
});

export const updateContractBodyStruct = partial(createContractBodyStruct);
