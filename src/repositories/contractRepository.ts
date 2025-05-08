import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { CreateContractDTO } from '../dto/contractDTO';

import { ContractQueryParams, ContractWithRelations } from '../types/contractType';

export const findContractDocuments = async (
  where: Prisma.ContractWhereInput = {},
  skip: number,
  take: number,
) => {
  return await prisma.contract.findMany({
    where,
    skip,
    take,
    include: {
      user: true,
      car: { include: { model: true } },
      customer: true,
      contractDocuments: {
        select: { id: true, fileName: true },
      },
    },
  });
};

export const countContract = async (where: Prisma.ContractWhereInput = {}): Promise<number> => {
  return await prisma.contract.count({ where });
};

export const findDraftContracts = async (companyId: number) => {
  return await prisma.contract.findMany({
    where: {
      companyId,
    },
    include: {
      car: { include: { model: true } },
      customer: true,
    },
  });
};

export const createContract = async ({
  carId,
  customerId,
  userId,
  companyId,
  meetings,
}: CreateContractDTO) => {
  const car = await prisma.car.findUniqueOrThrow({
    where: { id: carId },
    select: { price: true },
  });

  const contract = await prisma.contract.create({
    data: {
      carId: carId,
      customerId: customerId,
      userId: userId,
      companyId: companyId,
      contractStatus: 'CAR_INSPECTION',
      resolutionDate: null,
      contractPrice: car.price,
      meeting: {
        create: meetings.map((meeting) => ({
          date: new Date(meeting.date),
          alarm: {
            create: meeting.alarms?.map((alarm) => ({
              time: new Date(alarm),
            })),
          },
        })),
      },
    },
    include: {
      meeting: { include: { alarm: true } },
      user: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true } },
      car: { select: { id: true, model: { select: { name: true } } } },
    },
  });

  return contract;
};

export const getContractsGroupedByStatus = async () => {
  return prisma.contract.findMany({
    include: {
      car: {
        include: {
          model: true,
        },
      },
      customer: true,
      user: true,
      meeting: {
        include: {
          alarm: true,
        },
      },
    },
  });
};

export const findGroupedContracts = async (where: Prisma.ContractWhereInput) => {
  return prisma.contract.findMany({
    where,
    include: {
      car: { include: { model: true } },
      customer: true,
      user: true,
      meeting: { include: { alarm: true } },
    },
  });
};

export const countGroupedContracts = async (where: Prisma.ContractWhereInput) => {
  return prisma.contract.count({ where });
};

export const updateContractInDB = async (
  contractId: number,
  updateData: {
    basic: Prisma.ContractUpdateInput;
    meetings?: { date: Date; alarm: { time: Date }[] }[];
  },
) => {
  if (updateData.meetings) {
    await prisma.meeting.deleteMany({ where: { contractId } });

    for (const meet of updateData.meetings) {
      await prisma.meeting.create({
        data: {
          contractId,
          date: meet.date,
          alarm: {
            create: meet.alarm.map((alarm) => ({ time: alarm.time })),
          },
        },
      });
    }
  }

  return prisma.contract.update({
    where: { id: contractId },
    data: updateData.basic,
    include: {
      user: true,
      customer: true,
      car: { include: { model: true } },
      meeting: { include: { alarm: true } },
    },
  });
};

export const findContractById = async (contractId: number) => {
  return await prisma.contract.findUnique({ where: { id: contractId } });
};

export const deleteContractData = async (id: number) => {
  return prisma.contract.delete({ where: { id } });
};

export const listDetails = async ({
  where,
}: ContractQueryParams): Promise<ContractWithRelations[]> => {
  return prisma.contract.findMany({
    where,
    include: {
      user: true,
      customer: true,
      car: {
        include: {
          model: true,
        },
      },
      meeting: true,
      contractDocuments: true,
    },
  });
};

export const contractFindUserId = async (contractId: number) => {
  return await prisma.contract.findUnique({
    where: { id: contractId },
    select: { userId: true },
  });
};

export const updateMultipleContractDocumentIds = async (
  documentIds: number[],
  contractId: number,
): Promise<void> => {
  await Promise.all(
    documentIds.map((id) =>
      prisma.contractDocument.update({
        where: { id },
        data: { contractId },
      }),
    ),
  );
};
