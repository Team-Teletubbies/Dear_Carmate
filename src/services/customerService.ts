import * as customerRepo from '../repositories/customerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dto/customer.dto';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import NotFoundError from '../lib/errors/notFoundError';
import { getCustomers } from '../repositories/customerRepository';
import fs from 'fs';
import {
  toGenderEnum,
  toAgeGroupEnum,
  toRegionEnum,
} from '../lib/utils/customers/customerEnumConverter';
import { toLabeledCustomer } from '../lib/utils/customers/customerMapper';
import { parse } from 'csv-parse/sync';

export const createCustomer = (companyId: number, data: CreateCustomerDTO) => {
  const prismaData: Prisma.CustomerUncheckedCreateInput = {
    ...data,
    companyId,
    gender: toGenderEnum(data.gender),
    ageGroup: toAgeGroupEnum(data.ageGroup),
    region: toRegionEnum(data.region),
  };

  return customerRepo.createCustomer(companyId, prismaData);
};

export const updateCustomer = async (
  customerId: number,
  companyId: number,
  data: UpdateCustomerDTO,
) => {
  const customer = await customerRepo.getCustomerById(customerId, companyId);
  if (!customer) throw new NotFoundError('고객을 찾을 수 없습니다.');

  const { genderToLabel, ageGroupToLabel, regionToLabel, ...cleanData } = data as any;

  const converted: Prisma.CustomerUncheckedUpdateManyInput = {
    ...cleanData,
    ...(cleanData.gender && { gender: toGenderEnum(cleanData.gender) }),
    ...(cleanData.ageGroup && { ageGroup: toAgeGroupEnum(cleanData.ageGroup) }),
    ...(cleanData.region && { region: toRegionEnum(cleanData.region) }),
  };

  return customerRepo.updateCustomer(customerId, companyId, converted);
};

export const deleteCustomer = async (customerId: number, companyId: number) => {
  const result = await prisma.customer.deleteMany({
    where: {
      id: customerId,
      companyId,
    },
  });
  if (result.count === 0) {
    throw new NotFoundError('고객을 찾을 수 없습니다.');
  }

  return result;
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

  //Enum to Label로 변환
  const parsedCustomers = customers.map(toLabeledCustomer);

  return {
    currentPage: page,
    totalPages,
    totalItemCount: totalCount,
    data: parsedCustomers,
  };
};

//상세 조회 추가

export const getCustomerDetailByKeyword = async (
  companyId: number,
  searchBy: 'name' | 'email',
  keyword: string,
) => {
  const customer = await customerRepo.findCustomerByKeyword(companyId, searchBy, keyword);

  if (!customer) {
    throw new NotFoundError('고객을 찾을 수 없습니다.');
  }

  return {
    ...customer,
    gender: customer.gender ? customer.gender.toLowerCase() : '',
    ageGroup: customer.ageGroup ? customer.ageGroup.toLowerCase() : null,
    region: customer.region ? customer.region.toLowerCase() : null,
  };
};

//대용량 업로드

type CustomerCSVRecord = {
  name: string;
  gender: string;
  phoneNumber: string;
  ageGroup?: string;
  region?: string;
  email: string;
  memo?: string;
};

export const bulkUploadCustomers = async (companyId: number, filePath: string) => {
  const csvText = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const customers = (records as CustomerCSVRecord[])
    .map((record) => ({
      name: record.name,
      gender: toGenderEnum(record.gender),
      phoneNumber: record.phoneNumber,
      ageGroup: record.ageGroup ? toAgeGroupEnum(record.ageGroup) : undefined,
      region: record.region ? toRegionEnum(record.region) : undefined,
      email: record.email,
      memo: record.memo,
      companyId,
    }))
    .filter((c) => c.name && c.gender);

  const result = await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  return `성공적으로 ${result.count}명의 고객을 업로드했습니다.`;
};
