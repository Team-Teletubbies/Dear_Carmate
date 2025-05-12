import { ContractStatus } from '@prisma/client';

export const statusKeys = [
  'carInspection',
  'priceNegotiation',
  'contractDraft',
  'contractSuccessful',
  'contractFailed',
] as const;

export type ClientContractStatus = (typeof statusKeys)[number];

export const statusMap = {
  carInspection: ContractStatus.CAR_INSPECTION,
  priceNegotiation: ContractStatus.PRICE_NEGOTIATION,
  contractDraft: ContractStatus.CONTRACT_DRAFT,
  contractSuccessful: ContractStatus.CONTRACT_SUCCESSFUL,
  contractFailed: ContractStatus.CONTRACT_FAILED,
} as const;

export const reverseStatusMap = Object.entries(statusMap).reduce(
  (acc, [key, val]) => {
    acc[val] = key as ClientContractStatus;
    return acc;
  },
  {} as Record<ContractStatus, ClientContractStatus>,
);

export const toDBStatus = (key: ClientContractStatus): ContractStatus => statusMap[key];
export const toClientStatus = (val: ContractStatus): ClientContractStatus => reverseStatusMap[val];
