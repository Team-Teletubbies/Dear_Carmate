import { RequestHandler } from 'express';
import { CreateCompanyDTO } from '../dto/companyDto';
import * as companyService from '../services/companyService';

export const createCompany: RequestHandler = async (req, res) => {
  const { companyName, companyCode } = req.body;
  const dto: CreateCompanyDTO = {
    companyName,
    companyCode,
  };
  const company = await companyService.createCompany(dto);
  res.status(201).json(company);
};
