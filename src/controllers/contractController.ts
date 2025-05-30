import { Response } from 'express';
import {
  createContractData,
  getGroupedContractByStatus,
  updateContractData,
  delContract,
  detailList,
} from '../services/contractService';
import { CreateContractDTO } from '../dto/contractDTO';
import { asyncHandler } from '../lib/async-handler';
import {
  createContractBodyStruct,
  updateContractBodyStruct,
  contractFilterStruct,
} from '../structs/contractStruct';
import { create } from 'superstruct';
import { GroupedContractSearchParams } from '../types/contractType';
import { IdParamsStruct } from '../structs/commonStruct';
import { AuthenticatedRequest } from '../types/express';
import { getLastPathSegment } from '../lib/utils/request';

export const createContract = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { carId, customerId, meetings } = create(req.body, createContractBodyStruct);
  const user = req.user;

  const dto: CreateContractDTO = {
    carId,
    customerId,
    userId: user.userId,
    companyId: user.companyId,
    contractPrice: 0,
    meetings: (meetings ?? []).map((meet) => ({
      date: meet.date,
      alarms: meet.alarms ?? [],
    })),
  };

  const contract = await createContractData(dto);

  res.status(201).json(contract);
  return;
});

export const getGroupedContracts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { searchBy, keyword } = create(req.query, contractFilterStruct);
    const companyId = req.user.companyId;
    const params: GroupedContractSearchParams = {
      companyId,
      searchBy: searchBy as 'customerName' | 'userName' | undefined,
      keyword: keyword as string | undefined,
    };

    const result = await getGroupedContractByStatus(params);

    res.status(200).json(result);
  },
);

export const patchContracts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, updateContractBodyStruct);
  const user = req.user;

  const result = await updateContractData({
    id,
    editorUserId: user.userId,
    ...data,
  });

  res.status(200).json(result);
});

export const deleteContract = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;
  await delContract(id, user.userId);

  res.status(200).json({ message: '계약 삭제 성공' });
  return;
});

export const getDetailList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  const lastSegment = getLastPathSegment(req.path);

  const result = await detailList({
    companyId: user.companyId,
    lastSegment,
  });

  res.status(200).json(result);
  return;
});
