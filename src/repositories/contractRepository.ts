import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { CreateContractDTO } from '../dto/contractDTO';
import { transformMeetingToDTO, transformMeetingToPrisma } from '../lib/utils/meeting';

const baseContractInclude = {
  user: { select: { id: true, name: true } },
  customer: true,
  car: { include: { model: true } },
  meeting: { include: { alarm: true } },
};

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
      user: { select: { id: true, name: true } },
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
      contractDocuments: {
        none: {},
      },
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

  const transformedMeetings = transformMeetingToPrisma(meetings ?? []);

  const contract = await prisma.contract.create({
    data: {
      carId: carId,
      customerId: customerId,
      userId: userId,
      companyId: companyId,
      contractStatus: 'CAR_INSPECTION',
      resolutionDate: null,
      contractPrice: car.price,
      ...(transformedMeetings.length > 0
        ? {
            meeting: {
              create: transformedMeetings,
            },
          }
        : {}),
    },
    include: {
      ...baseContractInclude,
      user: { select: { id: true, name: true } },
    },
  });

  return contract;
};

export const getContractsGroupedByStatus = async () => {
  return prisma.contract.findMany({
    include: baseContractInclude,
  });
};

export const findGroupedContracts = async (where: Prisma.ContractWhereInput) => {
  return prisma.contract.findMany({
    where,
    include: baseContractInclude,
  });
};

export const countGroupedContracts = async (where: Prisma.ContractWhereInput) => {
  return prisma.contract.count({ where });
};

export const updateContractInDB = async (
  contractId: number,
  updateData: {
    basic: Prisma.ContractUpdateInput;
    meetings?: Prisma.MeetingCreateWithoutContractInput[];
  },
) => {
  if (Array.isArray(updateData.meetings) && updateData.meetings.length > 0) {
    await prisma.meeting.deleteMany({ where: { contractId } });

    await prisma.meeting.createMany({
      data: updateData.meetings.map((meet) => ({
        contractId,
        date: meet.date,
      })),
    });

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
    include: baseContractInclude,
  });
};

export const findContractById = async (contractId: number) => {
  return await prisma.contract.findUnique({ where: { id: contractId } });
};

export const deleteContractData = async (id: number) => {
  return prisma.contract.delete({ where: { id } });
};

export const contractFindUserId = async (contractId: number) => {
  return await prisma.contract.findUnique({
    where: { id: contractId },
    select: { userId: true },
  });
};
