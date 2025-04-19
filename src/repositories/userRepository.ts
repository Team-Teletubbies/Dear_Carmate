import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { UserWithCompanyCode, User, CreateUserInput } from '../types/userType';

export const create = async (input: CreateUserInput): Promise<User> => {
  return await prisma.user.create({ data: input });
};

export const getWithCompanyCode = async (id: number): Promise<UserWithCompanyCode> => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    include: { company: { select: { companyCode: true } } },
  });
};
