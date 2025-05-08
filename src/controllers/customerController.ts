import { Request, Response } from 'express';
import * as customerService from '../services/customerService';
import BadRequestError from '../lib/errors/badRequestError';
import { AuthenticatedRequest } from '../types/express';
import {
  toGenderEnum,
  toAgeGroupEnum,
  toRegionEnum,
} from '../lib/utils/customers/customerEnumConverter';
import { toLowerCaseCustomer } from '../lib/utils/customers/customerMapper';
import { CustomerForResponse } from '../types/customerType';

export const createCustomer = async (req: AuthenticatedRequest, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;

  const { gender, ageGroup, region, ...rest } = req.body;

  const converted = {
    ...rest,
    ...(gender && { gender: toGenderEnum(gender) }),
    ...(ageGroup && { ageGroup: toAgeGroupEnum(ageGroup) }),
    ...(region && { region: toRegionEnum(region) }),
  };

  try {
    const customer = await customerService.createCustomer(companyId, converted);
    res.status(201).json(toLowerCaseCustomer(customer));
  } catch (error) {
    console.error('고객 생성 중 에러:', error);
    res.status(500).json({ message: '고객 등록 중 오류가 발생했습니다.' });
  }
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

  if (!req.file?.path) throw new BadRequestError('CSV 파일을 업로드해주세요');

  const message = await customerService.bulkUploadCustomers(companyId, req.file.path);
  res.status(200).json({ message });
};
