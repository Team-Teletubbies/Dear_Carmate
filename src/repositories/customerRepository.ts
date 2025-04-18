import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const createCustomer = async (
  companyId: number,
  data: Prisma.CustomerUncheckedCreateInput,
) => {
  return prisma.customer.create({
    data: {
      ...data,
      companyId,
    },
  });
};

export const updateCustomer = async (
  customerId: number,
  companyId: number,
  data: Prisma.CustomerUncheckedUpdateManyInput,
) => {
  return prisma.customer.updateMany({
    where: { id: customerId, companyId },
    data,
  });
};

export const deleteCustomer = async (customerId: number, companyId: number) => {
  return prisma.customer.deleteMany({
    where: { id: customerId, companyId },
  });
};

export const getCustomers = async (
  companyId: number,
  page: number,
  pageSize: number,
  searchBy?: 'name' | 'email',
  keyword?: string,
) => {
  const where: any = {
    companyId,
  };

  if (searchBy && keyword) {
    where[searchBy] = {
      contains: keyword,
      mode: 'insensitive',
    };
  }

  const skip = (page - 1) * pageSize;

  const [totalCount, customers] = await prisma.$transaction([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        gender: true,
        phoneNumber: true,
        ageGroup: true,
        region: true,
        email: true,
        memo: true,
        contractCount: true,
      },
    }),
  ]);

  return {
    totalCount,
    customers,
  };
};

export const getCustomerById = async (customerId: number, companyId: number) => {
  return prisma.customer.findFirst({
    where: { id: customerId, companyId },
  });
};
