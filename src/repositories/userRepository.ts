import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { UserWithCompanyCode, User, CreateUserInput } from '../types/userType';

export const create = async (input: CreateUserInput): Promise<User> => {
  return await prisma.user.create({ data: input });
};

export const getWithCompanyCode = async (id: number): Promise<UserWithCompanyCode> => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      employeeNumber: true,
      phoneNumber: true,
      imageUrl: true,
      isAdmin: true,
      company: {
        select: {
          companyCode: true,
        },
      },
    },
  });
};

export const getByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getByEmployeeNumber = async (employeeNumber: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { employeeNumber } });
};
