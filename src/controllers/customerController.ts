import { Request, Response } from 'express';
import * as customerService from '../services/customerService';
import NotFoundError from '../lib/errors/notFoundError';

export const createCustomerHandler = async (req: Request, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customer = await customerService.createCustomer(companyId, req.body);
  res.status(201).json(customer);
};

export const updateCustomerHandler = async (req: Request, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customerId = Number(req.params.id);
  const updated = await customerService.updateCustomer(customerId, companyId, req.body);
  res.status(200).json(updated);
};

export const deleteCustomerHandler = async (req: Request, res: Response) => {
  const companyId = (req.user as { companyId: number }).companyId;
  const customerId = Number(req.params.id);
  const result = await customerService.deleteCustomer(customerId, companyId);

  if (result.count === 0) {
    throw new NotFoundError('존재하지 않는 고객입니다');
  }

  res.status(200).json({ message: '고객 삭제 성공' });
};

export const getCustomersHandler = async (req: Request, res: Response) => {
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

  res.status(200).json(result);
};
