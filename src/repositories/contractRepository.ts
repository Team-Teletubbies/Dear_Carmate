import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { CreateContractDTO } from '../dto/contractDTO';
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

export const findDraftContracts = async () => {
  return await prisma.contract.findMany({
    where: {
      resolutionDate: null,
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
      userId,
      contractStatus: 'CAR_INSPECTION',
      resolutionDate: null,
      contractPrice: car.price,
      meeting: {
        create: meetings.map((meeting) => ({
          date: new Date(meeting.date),
          alarm: {
            create: meeting.alarms.map((alarmTime) => ({
              time: new Date(alarmTime),
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
