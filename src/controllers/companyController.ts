import { Response } from 'express';
import { CreateUpdateCompanyDTO, GetCompanyListDTO } from '../dto/companyDto';
import * as companyService from '../services/companyService';
import { assert, create } from 'superstruct';
import { companyFilterStruct, createCompanyBodyStruct } from '../structs/companyStruct';
import { IdParamsStruct } from '../structs/commonStruct';
import { AuthenticatedRequest } from '../types/express';

export const createCompany = async (req: AuthenticatedRequest, res: Response) => {
  assert(req.body, createCompanyBodyStruct);
  const { companyName, companyCode } = req.body;
  const dto: CreateUpdateCompanyDTO = {
    companyName,
    companyCode,
  };
  const company = await companyService.createCompany(dto);
  res.status(201).json(company);
};

export const getCompanyList = async (req: AuthenticatedRequest, res: Response) => {
  const dto: GetCompanyListDTO = create(req.query, companyFilterStruct);
  const companyList = await companyService.getCompanyList(dto);
  res.status(200).json(companyList);
};

export const updateCompany = async (req: AuthenticatedRequest, res: Response) => {
  const { id: companyId } = create(req.params, IdParamsStruct);
  const data: CreateUpdateCompanyDTO = create(req.body, createCompanyBodyStruct);
  const updated = await companyService.updateAndGetCompany(companyId, data);
  res.status(200).json(updated);
};

export const deleteCompany = async (req: AuthenticatedRequest, res: Response) => {
  const { id: companyId } = create(req.params, IdParamsStruct);
  await companyService.deleteCompany(companyId);
  res.status(200).json({ message: '회사 삭제 성공' });
};
