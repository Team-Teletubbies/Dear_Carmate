import * as customerRepo from '../repositories/customerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dto/customer.dto';
import { Gender, AgeGroup, Region, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import NotFoundError from '../lib/errors/notFoundError';
import { getCustomers } from '../repositories/customerRepository';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

function toGenderEnum(label: string): Gender {
  switch (label) {
    case '남성':
      return 'MALE';
    case '여성':
      return 'FEMALE';
    default:
      throw new Error(`잘못된 성별 값: ${label}`);
  }
}

function toAgeGroupEnum(label?: string): AgeGroup | undefined {
  switch (label) {
    case '10대':
      return 'TEENAGER';
    case '20대':
      return 'TWENTIES';
    case '30대':
      return 'THIRTIES';
    case '40대':
      return 'FORTIES';
    case '50대':
      return 'FIFTIES';
    case '60대':
      return 'SIXTIES';
    case '70대':
      return 'SEVENTIES';
    case '80대':
      return 'EIGHTIES';
    case undefined:
      return undefined;
    default:
      throw new Error(`잘못된 연령대 값: ${label}`);
  }
}

function toRegionEnum(label?: string): Region | undefined {
  switch (label) {
    case '서울':
      return 'SEOUL';
    case '경기':
      return 'GYEONGGI';
    case '인천':
      return 'INCHEON';
    case '강원':
      return 'GANGWON';
    case '충북':
      return 'CHUNGBUK';
    case '충남':
      return 'CHUNGNAM';
    case '세종':
      return 'SEJONG';
    case '대전':
      return 'DAEJEON';
    case '전북':
      return 'JEONBUK';
    case '전남':
      return 'JEONNAM';
    case '광주':
      return 'GWANGJU';
    case '경북':
      return 'GYEONGBUK';
    case '경남':
      return 'GYEONGNAM';
    case '대구':
      return 'DAEGU';
    case '울산':
      return 'ULSAN';
    case '부산':
      return 'BUSAN';
    case '제주':
      return 'JEJU';
    case undefined:
      return undefined;
    default:
      throw new Error(`잘못된 지역 값: ${label}`);
  }
}

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

  return customerRepo.updateCustomer(
    customerId,
    companyId,
    data as Prisma.CustomerUncheckedUpdateManyInput,
  );
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
  const parsedCustomers = customers.map((customer) => ({
    ...customer,
    gender: customer.gender.toLowerCase(),
    ageGroup: customer.ageGroup ? customer.ageGroup.toLowerCase() : null,
    region: customer.region ? customer.region.toLowerCase() : null,
  }));

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
  const csvText = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''); // BOM 제거

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
    .filter((c) => c.name && c.gender); // 최소 필드 체크

  const result = await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  return `성공적으로 ${result.count}명의 고객을 업로드했습니다.`;
};
