import {
  createContractDocument,
  findContractDocumentById,
} from '../repositories/contractDocumentRepository';
import {
  DownloadContractDocumentResponseDTO,
  UploadContractDocumentResponseDTO,
} from '../dto/contractDocumentDTO';
import { UploadContractDocument } from '../types/contractDocumentType';
import NotFoundError from '../lib/errors/notFoundError';
import fs from 'fs';
import path from 'path';

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
