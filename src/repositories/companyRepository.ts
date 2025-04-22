import { prisma } from '../lib/prisma';
import {
  GetCompanyListDTO,
  CompanyListResponseDTO,
  CreateUpdateCompanyDTO,
} from '../dto/companyDto';
import { Company, CompanyWithCount } from '../types/companyType';
import { Prisma } from '@prisma/client';

export async function create(data: CreateUpdateCompanyDTO): Promise<Company> {
  return await prisma.company.create({ data });
}

export async function getCompanyListWithUserCount(
  data: GetCompanyListDTO,
): Promise<CompanyWithCount[]> {
  const { page, pageSize, searchBy = 'companyName', keyword } = data;
  const where = keyword ? { [searchBy]: { contains: keyword, mode: 'insensitive' } } : undefined;
  return await prisma.company.findMany({
    where,
    take: page * pageSize,
    skip: pageSize * (page - 1),
    select: {
      id: true,
      companyName: true,
      companyCode: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
}

export const getByCompanyName = async (companyName: string): Promise<Company | null> => {
  return await prisma.company.findUnique({ where: { companyName } });
};

export const getByCompanyCode = async (companyCode: string): Promise<Company | null> => {
  return await prisma.company.findUnique({ where: { companyCode } });
};

export const findValidateCompany = async (
  companyName: string,
  companyCode: string,
): Promise<Company | null> => {
  return await prisma.company.findFirst({ where: { AND: [{ companyName }, { companyCode }] } });
};

export const countByKeyword = async (searchBy: string, keyword?: string): Promise<number> => {
  const where = keyword ? { [searchBy]: { contains: keyword, mode: 'insensitive' } } : undefined;
  return prisma.company.count({
    where,
  });
};

export const updateAndGetWithCount = async (
  companyId: number,
  data: CreateUpdateCompanyDTO,
): Promise<CompanyWithCount | null> => {
  const where = { id: companyId };
  const [_, updatedWithCount] = await prisma.$transaction([
    prisma.company.update({ where, data }),
    prisma.company.findUnique({
      where,
      select: {
        id: true,
        companyName: true,
        companyCode: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    }),
  ]);
  return updatedWithCount;
};
// Todo: ErrorHandler에 Prisma unique 넘는 (code P2002) 넘는 애 필요
