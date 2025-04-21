import { RequestHandler } from 'express';
import { CreateCompanyDTO, GetCompanyListDTO } from '../dto/companyDto';
import * as companyService from '../services/companyService';
import { assert, create } from 'superstruct';
import { companyFilterStruct, createCompanyBodyStruct } from '../structs/companyStruct';

export const createCompany: RequestHandler = async (req, res) => {
  assert(req.body, createCompanyBodyStruct);
  // Todo: superstruct가 던지는 에러 잘 잡히는지 확인 필요
  const { companyName, companyCode } = req.body;
  const dto: CreateCompanyDTO = {
    companyName,
    companyCode,
  };
  const company = await companyService.createCompany(dto);
  res.status(201).json(company);
};

export const getCompanyList: RequestHandler = async (req, res) => {
  const dto: GetCompanyListDTO = create(req.params, companyFilterStruct);
  const companyList = await companyService.getCompanyList(dto);
  res.status(200).json(companyList);
};
