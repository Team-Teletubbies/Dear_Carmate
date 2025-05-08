import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  UserWithCompanyCode,
  User,
  CreateUserInput,
  GetUserListInput,
  UserWithPasswordAndCompany,
  updateMyInfoInput,
} from '../types/userType';
import {
  GetUserListDTO,
  updateMyInfoDTO,
  UserListItem,
  UserProfileResponseDTO,
} from '../dto/userDTO';
import { CreateUpdateCompanyDTO } from '../dto/companyDto';
import { redis } from '../lib/auth/redis';
import UnauthorizedError from '../lib/errors/unauthorizedError';

export const create = async (input: CreateUserInput): Promise<User> => {
  return await prisma.user.create({ data: input });
};

export const getWithCompanyCode = async (id: number): Promise<UserWithCompanyCode | null> => {
  return await prisma.user.findUnique({
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
  const where = keyword
    ? searchBy === 'companyName'
      ? { company: { is: { companyName: { contains: keyword, mode: 'insensitive' as const } } } }
      : { [searchBy]: { contains: keyword, mode: 'insensitive' } }
    : undefined;
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
  const where = keyword
    ? searchBy === 'companyName'
      ? { company: { is: { companyName: { contains: keyword, mode: 'insensitive' as const } } } }
      : { [searchBy]: { contains: keyword, mode: 'insensitive' } }
    : undefined;
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

export const getById = async (id: number): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

export const setRedisRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
  await redis.set(`refresh:${refreshToken}`, userId, 'EX', 60 * 60 * 24 * 14);
};

export const getRedisRefreshToken = async (refreshToken: string): Promise<number | null> => {
  const redisKey = `refresh:${refreshToken}`;
  const userId = await redis.getdel(redisKey);
  if (!userId) {
    throw new UnauthorizedError('재사용된 토큰이거나 유효하지 않은 토큰입니다');
  }
  return parseInt(userId);
};

export const updateAndGetUser = async (
  userId: number,
  data: updateMyInfoInput,
): Promise<UserWithCompanyCode> => {
  const where = { id: userId };
  const [_, updatedWithCompany] = await prisma.$transaction([
    prisma.user.update({ where, data }),
    prisma.user.findUniqueOrThrow({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        company: { select: { companyCode: true } },
      },
    }),
  ]);
  return updatedWithCompany;
};

export const deleteById = async (userId: number): Promise<User> => {
  const deleted = await prisma.user.delete({ where: { id: userId } });
  return deleted;
};

export const getUserListForContract = async (
  companyId: number,
): Promise<{ id: number; name: string; email: string }[]> => {
  return prisma.user.findMany({
    where: { companyId },
    select: { id: true, name: true, email: true },
  });
};
