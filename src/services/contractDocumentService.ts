import {
  createContractDocument,
  findContractDocumentById,
} from '../repositories/contractDocumentRepository';
import {
  ContractDocumnetTotalResponseDTO,
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
import fs from 'fs';
import path from 'path';
import { ContractDocumentStructKey } from '../structs/contractDocumentStruct';
import { ContractDocumentItem } from '../types/contractDocumentType';
import {
  findContractDocuments,
  countContract,
  findDraftContracts,
} from '../repositories/contractRepository';
import { Prisma } from '@prisma/client';

export const uploadContractDocument = async (
  data: UploadContractDocument,
): Promise<UploadContractDocumentResponseDTO> => {
  const created = await createContractDocument(data);
  return new UploadContractDocumentResponseDTO(created);
};

export const downloadContractDocument = async (
  id: number,
): Promise<DownloadContractDocumentResponseDTO> => {
  const document = await findContractDocumentById(id);

  if (!document) {
    throw new NotFoundError('계약서를 찾을 수 없습니다.');
  }

  if (!fs.existsSync(document.filePath)) {
    throw new NotFoundError('파일이 존재하지 않습니다.');
  }

  return new DownloadContractDocumentResponseDTO({
    filePath: path.resolve(document.filePath),
    fileName: document.fileName,
  });
};

export const getContractDocumentList = async (
  dto: GetConstractDocumentListDTO,
): Promise<ContractDocumnetTotalResponseDTO> => {
  const { page, pageSize, searchBy, keyword } = dto;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where = buildWhereCondition(searchBy, keyword);

  const [items, totalItemCount] = await Promise.all([
    findContractDocuments(where, skip, take),
    countContract(where),
  ]);

  const data = items.map((item: ContractForDocumentItem) => new ContractDocumentItem(item));
  const totalPages = Math.ceil(totalItemCount / pageSize);

  return new ContractDocumnetTotalResponseDTO(page, totalPages, totalItemCount, data);
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

export const getDraftContractDocuments = async () => {
  const drafts = await findDraftContracts();
  return drafts.map(
    (contract: DraftContractForDocumentItem) => new DraftContractDocumentItem(contract),
  );
};
