import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

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
