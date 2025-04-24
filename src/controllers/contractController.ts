import { Request, Response } from 'express';
import { createContractData, getGroupedContractByStatus } from '../services/contractService';
import { CreateContractDTO } from '../dto/contractDTO';
import { asyncHandler } from '../lib/async-handler';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import BadRequestError from '../lib/errors/badRequestError';
import { createContractBodyStruct } from '../structs/contractStruct';
import { create } from 'superstruct';
import { GroupedContractSearchParams } from '../types/contractType';

export const createContract = asyncHandler(async (req: Request, res: Response) => {
  const { carId, customerId, meetings } = create(req.body, createContractBodyStruct);
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }

  if (!carId || !customerId || !meetings) {
    throw new BadRequestError('잘못된 요청입니다.');
  }

  const dto: CreateContractDTO = {
    carId,
    customerId,
    userId: user.userId,
    contractPrice: 0,
    meetings: meetings.map((meet) => ({
      date: meet.date,
      alarms: meet.alarms ?? [],
    })),
  };

  const contract = await createContractData(dto);

  res.status(201).json(contract);
  return;
});

export const getGroupedContracts = async (req: Request, res: Response) => {
  const { searchBy, keyword } = req.query;
  const companyId = req.user?.companyId;

  if (!companyId) {
    throw new UnauthorizedError('로그인이 필요합니다.');
  }

  const params: GroupedContractSearchParams = {
    companyId,
    searchBy: searchBy as 'customerName' | 'userName' | undefined,
    keyword: keyword as string | undefined,
  };

  const result = await getGroupedContractByStatus(params);

  res.status(200).json(result);
};
