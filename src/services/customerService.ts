import * as customerRepo from '../repositories/customerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dto/customer.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import NotFoundError from '../lib/errors/notFoundError';
import { getCustomers } from '../repositories/customerRepository';

export const prisma = new PrismaClient();

export const createCustomer = (companyId: number, data: CreateCustomerDTO) => {
  return customerRepo.createCustomer(companyId, data as Prisma.CustomerUncheckedCreateInput);
};

export const updateCustomer = async (
  customerId: number,
  companyId: number,
  data: UpdateCustomerDTO,
) => {
  const customer = await customerRepo.getCustomerById(customerId, companyId);
  if (!customer) throw new NotFoundError('고객을 찾을 수 없습니다.');

  return customerRepo.updateCustomer(
    customerId,
    companyId,
    data as Prisma.CustomerUncheckedUpdateManyInput,
  );
};

export const deleteCustomer = async (customerId: number, companyId: number) => {
  return prisma.customer.deleteMany({
    where: {
      id: customerId,
      companyId,
    },
  });
};

export const getCustomersService = async (
  companyId: number,
  page: number,
  pageSize: number,
  searchBy?: 'name' | 'email',
  keyword?: string,
) => {
  const { totalCount, customers } = await getCustomers(
    companyId,
    page,
    pageSize,
    searchBy,
    keyword,
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    currentPage: page,
    totalPages,
    totalItemCount: totalCount,
    data: customers,
  };
};
