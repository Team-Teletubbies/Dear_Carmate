import {
  createContractDocument,
  findContractDocumentById,
} from '../repositories/contractDocumentRepository';
import {
  ContractDocumentTotalResponseDTO,
  DownloadContractDocumentResponseDTO,
  GetConstractDocumentListDTO,
  UploadContractDocumentResponseDTO,
} from '../dto/contractDocumentDTO';
import {
  DraftContractDocumentItem,
  UploadContractDocument,
  ContractForDocumentItem,
  DraftContractForDocumentItem,
} from '../types/contractDocumentType';
import NotFoundError from '../lib/errors/notFoundError';
import forbiddenError from '../lib/errors/forbiddenError';
import fs from 'fs';
import path from 'path';
import { ContractDocumentStructKey } from '../structs/contractDocumentStruct';
import { ContractDocumentItem } from '../types/contractDocumentType';
import {
  findContractDocuments,
  countContract,
  findDraftContracts,
  contractFindUserId,
} from '../repositories/contractRepository';
import { Prisma } from '@prisma/client';

export const uploadContractDocument = async (
  data: UploadContractDocument,
): Promise<UploadContractDocumentResponseDTO> => {
  const created = await createContractDocument(data);
  return new UploadContractDocumentResponseDTO(created);
};

export const downloadContractDocument = async (
  userId: number,
  id: number,
): Promise<DownloadContractDocumentResponseDTO> => {
  const document = await findContractDocumentById(id);

  if (!document) {
    throw new NotFoundError('계약서를 찾을 수 없습니다.');
  }

  if (document.contractId !== null) {
    const contract = await contractFindUserId(document.contractId);
    if (!contract || contract.userId !== userId) {
      throw new forbiddenError('담당자만 수정할 수 있습니다.');
    }
  }
  const resolvedPath = path.resolve(document.filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new NotFoundError('파일이 존재하지 않습니다.');
  }

  return new DownloadContractDocumentResponseDTO({
    filePath: resolvedPath,
    fileName: document.fileName,
  });
};

export const getContractDocumentList = async (
  baseData: GetConstractDocumentListDTO,
): Promise<ContractDocumentTotalResponseDTO> => {
  const { page, pageSize, searchBy, keyword, companyId } = baseData;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const searchData = buildWhereCondition(searchBy, keyword);

  const where = {
    user: { companyId },
    contractDocuments: { some: {} },
    ...searchData,
  };

  const [items, totalItemCount] = await Promise.all([
    findContractDocuments(where, skip, take),
    countContract(where),
  ]);

  const data = items.map((item: ContractForDocumentItem) => new ContractDocumentItem(item));
  const totalPages = Math.ceil(totalItemCount / pageSize);

  return new ContractDocumentTotalResponseDTO(page, totalPages, totalItemCount, data);
};

const buildWhereCondition = (
  searchBy?: ContractDocumentStructKey,
  keyword?: string,
): Prisma.ContractWhereInput | {} => {
  if (!searchBy || !keyword) return {};

  const cond = { contains: keyword, mode: 'insensitive' as const };
  return {
    ...{
      contractName: { OR: [{ car: { model: { name: cond } } }, { customer: { name: cond } }] },
      userName: { user: { name: cond } },
      carNumber: { car: { carNumber: cond } },
    }[searchBy],
  };
};

export const getDraftContractDocuments = async (
  companyId: number,
): Promise<DraftContractDocumentItem[]> => {
  const drafts = await findDraftContracts(companyId);
  return drafts.map(
    (contract: DraftContractForDocumentItem) => new DraftContractDocumentItem(contract),
  );
};
