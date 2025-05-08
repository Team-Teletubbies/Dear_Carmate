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
      contractCount: 0,
      updatedAt: new Date(),
    },
  });
};

export const updateCustomer = async (
  customerId: number,
  companyId: number,
  data: Prisma.CustomerUncheckedUpdateManyInput,
) => {
  return prisma.customer.update({
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
  const where: Prisma.CustomerWhereInput = { companyId };

  if (searchBy && keyword) {
    if (searchBy === 'name') {
      where.name = { contains: keyword, mode: 'insensitive' };
    } else if (searchBy === 'email') {
      where.email = { contains: keyword, mode: 'insensitive' };
    }
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

export const findCustomerByKeyword = async (
  companyId: number,
  searchBy: 'name' | 'email',
  keyword: string,
) => {
  const where: Prisma.CustomerWhereInput = {
    companyId,
    [searchBy]: { contains: keyword, mode: 'insensitive' },
  };

  return prisma.customer.findFirst({
    where,
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
  });
};

export const getCustomerListForContract = async (
  companyId: number,
): Promise<{ id: number; name: string; email: string }[]> => {
  return prisma.customer.findMany({
    where: { companyId },
    select: { id: true, name: true, email: true },
  });
};
