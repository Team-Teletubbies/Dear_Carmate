import {
  createContract,
  findGroupedContracts,
  countGroupedContracts,
} from '../repositories/contractRepository';
import {
  CreateContractResponseDTO,
  CreateContractDTO,
  GroupedContractsResponseDTO,
} from '../dto/contractDTO';
import { MinimalContract, GroupedContractSearchParams } from '../types/contractType';
import { Prisma, ContractStatus } from '@prisma/client';

export const createContractData = async (
  data: CreateContractDTO,
): Promise<CreateContractResponseDTO> => {
  const contract = await createContract(data);

  const transformed = {
    ...contract,
    meeting: contract.meeting.map((meet) => ({
      date: meet.date,
      alarms: meet.alarm.map((alarm) => new Date(alarm.time).toISOString()),
    })),
  };
  return new CreateContractResponseDTO(transformed);
};

const STATUS_VALUES = {
  carInspection: ContractStatus.CAR_INSPECTION,
  priceNegotiation: ContractStatus.PRICE_NEGOTIATION,
  contractDraft: ContractStatus.CONTRACT_DRAFT,
  contractSuccess: ContractStatus.CONTRACT_SUCCESSFUL,
  contractFailure: ContractStatus.CONTRACT_FAILED,
} as const;

export const getGroupedContractByStatus = async ({
  companyId,
  searchBy,
  keyword,
}: GroupedContractSearchParams): Promise<GroupedContractsResponseDTO> => {
  const groupedData: Partial<Record<string, MinimalContract[]>> = {};
  const groupedCounts: Record<string, number> = {};

  for (const [key, status] of Object.entries(STATUS_VALUES)) {
    const where: Prisma.ContractWhereInput = {
      contractStatus: status,
      user: { companyId },
      ...buildWhereCondition(searchBy, keyword),
    };

    const [contracts, count] = await Promise.all([
      findGroupedContracts(where),
      countGroupedContracts(where),
    ]);

    const transformedContracts: MinimalContract[] = contracts.map((contract) => ({
      ...contract,
      meeting: contract.meeting.map((meet) => ({
        date: meet.date,
        alarms: meet.alarm.map((alarm) => new Date(alarm.time).toISOString()),
      })),
    }));

    groupedData[key] = transformedContracts;
    groupedCounts[key] = count;
  }

  return new GroupedContractsResponseDTO(groupedData, groupedCounts);
};

const buildWhereCondition = (
  searchBy?: 'customerName' | 'userName',
  keyword?: string,
): Prisma.ContractWhereInput | {} => {
  if (!searchBy || !keyword) return {};

  const cond = { contains: keyword, mode: 'insensitive' as const };

  return {
    [searchBy === 'customerName' ? 'customer' : 'user']: { name: cond },
  };
};
