import { RequestHandler } from 'express';
import { CreateUpdateCompanyDTO, GetCompanyListDTO } from '../dto/companyDto';
import * as companyService from '../services/companyService';
import { assert, create } from 'superstruct';
import { companyFilterStruct, createCompanyBodyStruct } from '../structs/companyStruct';
import { IdParamsStruct } from '../structs/commonStruct';

export const createCompany: RequestHandler = async (req, res) => {
  assert(req.body, createCompanyBodyStruct);
  // Todo: superstruct가 던지는 에러 잘 잡히는지 확인 필요
  const { companyName, companyCode } = req.body;
  const dto: CreateUpdateCompanyDTO = {
    companyName,
    companyCode,
  };
  const company = await companyService.createCompany(dto);
  res.status(201).json(company);
};

export const getCompanyList: RequestHandler = async (req, res) => {
  const dto: GetCompanyListDTO = create(req.query, companyFilterStruct);
  const companyList = await companyService.getCompanyList(dto);
  res.status(200).json(companyList);
};

export const updateCompany: RequestHandler = async (req, res) => {
  const { id: companyId } = create(req.params, IdParamsStruct);
  const data: CreateUpdateCompanyDTO = create(req.body, createCompanyBodyStruct);
  const updated = await companyService.updateAndGetCompany(companyId, data);
  res.status(200).json(updated);

export const deleteCompany: RequestHandler = async (req, res) => {
  const { id: companyId } = create(req.params, IdParamsStruct);
  // await companyService.deleteCompany(companyId);
  res.status(204).send();
};
