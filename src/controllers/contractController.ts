import { Request, Response } from 'express';
import { createContractData } from '../services/contractService';
import { CreateContractDTO } from '../dto/contractDTO';
import { asyncHandler } from '../lib/async-handler';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import BadRequestError from '../lib/errors/badRequestError';

export const createContract = asyncHandler(async (req: Request, res: Response) => {
  const { carId, customerId, meetings } = req.body;
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
    userId: user.id,
    meetings,
  };

  const contract = await createContractData(dto);

  res.status(201).json(contract);
  return;
});
