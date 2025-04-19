import { prisma } from '../lib/prisma';
import { CreateCompanyDTO } from '../dto/companyDto';
import { Company } from '../types/companyType';
import { Prisma } from '@prisma/client';

export async function create(data: CreateCompanyDTO): Promise<Company> {
  return await prisma.company.create({ data });
}

export async function getCompanyList(data: GetCompanyListDTO): Promise<Prisma.CompanyGetPayload> {
  const { page, pageSize, searchBy, keyword } = data;
  const where = {};
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
