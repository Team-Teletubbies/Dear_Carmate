import {
  createContract,
  findGroupedContracts,
  countGroupedContracts,
  findContractById,
  updateContractInDB,
  deleteContractData,
} from '../repositories/contractRepository';
import {
  CreateContractResponseDTO,
  CreateContractDTO,
  GroupedContractsResponseDTO,
  UpdateContractDTO,
  ContractListItem,
} from '../dto/contractDTO';
import {
  MinimalContract,
  GroupedContractSearchParams,
  UpdateContractType,
  ContractWithRelations,
} from '../types/contractType';
import { Prisma, ContractStatus } from '@prisma/client';
import ForbiddenError from '../lib/errors/forbiddenError';
import NotFoundError from '../lib/errors/notFoundError';
import { toDBStatus } from '../lib/utils/statusMap';
import { getCarListForContract } from '../repositories/carRepository';
import { getCustomerListForContract } from '../repositories/customerRepository';
import { getUserListForContract } from '../repositories/userRepository';
import {
  findContractDocumentIdByFileName,
  updateMultipleContractDocumentIds,
} from '../repositories/contractDocumentRepository';

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
  contractSuccessful: ContractStatus.CONTRACT_SUCCESSFUL,
  contractFailed: ContractStatus.CONTRACT_FAILED,
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

export const updateContractData = async (input: UpdateContractType): Promise<UpdateContractDTO> => {
  const {
    id: contractId,
    editorUserId,
    status,
    resolutionDate,
    contractPrice,
    meetings,
    contractDocuments,
    carId,
    customerId,
    userId,
  } = input;
  const dbContract = await findContractById(contractId);
  if (!dbContract) throw new NotFoundError('존재하지 않는 계약입니다.');

  if (dbContract.userId !== editorUserId) throw new ForbiddenError('담당자만 수정 가능합니다.');

  const basic: Prisma.ContractUpdateInput = {};
  if (status) basic.contractStatus = toDBStatus(status);
  if (resolutionDate) basic.resolutionDate = new Date(resolutionDate);
  if (contractPrice !== undefined) basic.contractPrice = contractPrice;
  if (userId) basic.user = { connect: { id: userId } };
  if (customerId) basic.customer = { connect: { id: customerId } };
  if (carId) basic.car = { connect: { id: carId } };
  if (contractDocuments) {
    const documentIds = (
      await Promise.all(
        contractDocuments.map(async (doc) => {
          if (doc.id !== undefined) {
            return doc.id;
          }

          if (doc.fileName) {
            const id = await findContractDocumentIdByFileName(doc.fileName);
            return id;
          }

          return undefined;
        }),
      )
    ).filter((id): id is number => id !== undefined);

    basic.contractDocuments = { set: documentIds.map((id) => ({ id })) };

    await updateMultipleContractDocumentIds(documentIds, contractId);
  }

  const meetingList = meetings
    ? meetings.map((meet) => ({
        date: new Date(meet.date),
        alarm: (meet.alarms ?? []).map((alarm) => ({ time: new Date(alarm) })),
      }))
    : [];

  const contract = await updateContractInDB(contractId, {
    basic,
    meetings: meetingList,
  });

  return new UpdateContractDTO(contract);
};

export const delContract = async (id: number, userId: number): Promise<void> => {
  const dbContract = await findContractById(id);
  if (!dbContract) {
    throw new NotFoundError('존재하지 않는 계약입니다');
  }
  if (dbContract.userId !== userId) {
    throw new ForbiddenError('담당자만 삭제가 가능합니다');
  }

  await deleteContractData(id);
  return;
};

type Segment = 'cars' | 'customers' | 'users';

export const detailList = async (data: {
  companyId: number;
  lastSegment: Segment;
}): Promise<ContractListItem[]> => {
  const { companyId, lastSegment } = data;

  switch (data.lastSegment) {
    case 'cars': {
      const cars = await getCarListForContract(companyId);
      return cars.map((car) => ({
        id: car.id,
        data: `${car.model.name}(${car.carNumber})`,
      }));
    }

    case 'customers': {
      const customers = await getCustomerListForContract(companyId);
      return customers.map((customer) => ({
        id: customer.id,
        data: `${customer.name}(${customer.email})`,
      }));
    }

    case 'users': {
      const users = await getUserListForContract(companyId);
      return users.map((user) => ({
        id: user.id,
        data: `${user.name}(${user.email})`,
      }));
    }
  }
};
