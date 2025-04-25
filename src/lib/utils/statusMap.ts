import { ContractStatus } from '@prisma/client';

export const statusMap = {
  carInspection: ContractStatus.CAR_INSPECTION,
  priceNegotiation: ContractStatus.PRICE_NEGOTIATION,
  contractDraft: ContractStatus.CONTRACT_DRAFT,
  contractSuccessful: ContractStatus.CONTRACT_SUCCESSFUL,
  contractFailed: ContractStatus.CONTRACT_FAILED,
} as const;

export const reverseStatusMap = Object.entries(statusMap).reduce(
  (acc, [key, val]) => {
    acc[val] = key;
    return acc;
  },
  {} as Record<ContractStatus, string>,
);

export const toDBStatus = (key: keyof typeof statusMap) => statusMap[key];
export const toClientStatus = (val: ContractStatus) => reverseStatusMap[val];
