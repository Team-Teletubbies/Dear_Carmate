import { Request, Response } from 'express';
import * as customerService from '../services/customerService';
import BadRequestError from '../lib/errors/badRequestError';
import { Customer, Gender, AgeGroup, Region } from '@prisma/client';
import { toGenderEnum, toAgeGroupEnum, toRegionEnum } from '../types/customerType';
import { AuthenticatedRequest } from '../types/express';

// 응답용 타입 지정...........
type CustomerForResponse = {
  id: number;
  companyId: number;
  name: string;
  gender: Gender | null;
  phoneNumber: string;
  ageGroup: AgeGroup | null;
  region: Region | null;
  email: string;
  memo: string | null;
  contractCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// 공통적으로 소문자로 변환하는 함수를 추가......
function toLowerCaseCustomer(customer: CustomerForResponse) {
  return {
    ...customer,
    gender: customer.gender ? customer.gender.toLowerCase() : null,
    ageGroup: customer.ageGroup ? customer.ageGroup.toLowerCase() : null,
    region: customer.region ? customer.region.toLowerCase() : null,
  };
}

//기존
export const createCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customer = await customerService.createCustomer(companyId, req.body);
  res.status(201).json(toLowerCaseCustomer(customer));
};

export const updateCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customerId = Number(req.params.id);

  const { gender, ageGroup, region, ...rest } = req.body;

  const convertedData = {
    ...rest,
    gender: gender ? toGenderEnum(gender) : undefined,
    ageGroup: ageGroup ? toAgeGroupEnum(ageGroup) : undefined,
    region: region ? toRegionEnum(region) : undefined,
  };

  const updated = await customerService.updateCustomer(customerId, companyId, convertedData);

  if (!updated || (typeof updated === 'object' && 'count' in updated)) {
    res.status(200).json({ message: '고객 정보가 업데이트 되었습니다.' });
    return;
  }

  res.status(200).json(toLowerCaseCustomer(updated));
};

export const deleteCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customerId = Number(req.params.id);

  await customerService.deleteCustomer(customerId, companyId);
  res.status(200).json({ message: '고객 삭제 성공' });
};

export const getCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;

  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const searchBy = req.query.searchBy as 'name' | 'email' | undefined;
  const keyword = req.query.keyword as string | undefined;

  const result = await customerService.getCustomersService(
    companyId,
    page,
    pageSize,
    searchBy,
    keyword,
  );

  const loweredResult = {
    ...result,
    data: result.data.map((customer) => toLowerCaseCustomer(customer as CustomerForResponse)),
  };

  res.status(200).json(loweredResult);
};

export const getCustomerDetail = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const searchBy = req.query.searchBy as 'name' | 'email';
  const keyword = req.query.keyword as string;

  if (!searchBy || !keyword) {
    throw new BadRequestError('searchBy와 keyword를 모두 입력해야 합니다.');
  }

  const customer = await customerService.getCustomerDetailByKeyword(companyId, searchBy, keyword);

  res.status(200).json(customer);
};

export const bulkUploadCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const fileBuffer = req.file?.buffer;

  if (!fileBuffer) throw new BadRequestError('CSV 파일을 업로드해주세요');

  const message = await customerService.bulkUploadCustomers(companyId, fileBuffer);
  res.status(200).json({ message });
};
