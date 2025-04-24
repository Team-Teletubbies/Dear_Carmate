import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  UserWithCompanyCode,
  User,
  CreateUserInput,
  GetUserListInput,
  UserWithPasswordAndCompany,
} from '../types/userType';
import { GetUserListDTO, UserListItem } from '../dto/userDTO';
import { CreateUpdateCompanyDTO } from '../dto/companyDto';
import { redis } from '../lib/auth/redis';

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

export const getUserList = async (input: GetUserListInput): Promise<UserListItem[]> => {
  const { keyword, searchBy, page, pageSize } = input;
  const where = keyword ? { [searchBy]: { contains: keyword, mode: 'insensitive' } } : undefined;
  const userList = await prisma.user.findMany({
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
    select: {
      id: true,
      name: true,
      email: true,
      employeeNumber: true,
      phoneNumber: true,
      company: { select: { companyName: true } },
    },
  });
  return userList;
};

export const countByKeyword = async (searchBy: string, keyword?: string): Promise<number> => {
  const where = keyword ? { [searchBy]: { contains: keyword, mode: 'insensitive' } } : undefined;
  return prisma.user.count({ where });
};

export const findForLoginByEmail = async (
  email: string,
): Promise<UserWithPasswordAndCompany | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      employeeNumber: true,
      phoneNumber: true,
      imageUrl: true,
      isAdmin: true,
      company: { select: { id: true, companyCode: true } },
    },
  });
  return user;
};

export const getById = async (id: number): Promise<User> => {
  return await prisma.user.findUniqueOrThrow({ where: { id } });
};

export const setRedisRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await redis.set(`refresh:user:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 14);
};

export const getRedisRefreshToken = async (userId: number): Promise<string | null> => {
  const refreshToken = await redis.get(`refresh:user:${userId}`);
  return refreshToken;
};
