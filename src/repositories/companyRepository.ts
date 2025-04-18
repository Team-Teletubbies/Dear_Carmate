import { prisma } from '../lib/prisma';
import { CreateCompanyDTO } from '../dto/companyDto';
import { Company } from '../types/companyType';

export const create = async (data: CreateCompanyDTO): Promise<Company> => {
  return await prisma.company.create({ data });
};
