import { ContractDocument } from '@prisma/client';
import { ContractDocumentStructKey } from '../structs/contractDocumentStruct';
import { ContractDocumentItem, DraftContractDocumentItem } from '../types/contractDocumentType';

export class UploadContractDocumentResponseDTO {
  contractDocumentId: number;
  constructor(data: ContractDocument) {
    this.contractDocumentId = data.id;
  }
}

export interface GetConstractDocumentListDTO {
  page: number;
  pageSize: number;
  searchBy?: ContractDocumentStructKey;
  keyword?: string;
}

export class ContractDocumentListItemDTO {
  id: number;

  constructor(id: number, fileName: string) {
    this.id = id;
  }
}

export class DownloadContractDocumentResponseDTO {
  filePath: string;
  fileName: string;

  constructor(data: { filePath: string; fileName: string }) {
    this.filePath = data.filePath;
    this.fileName = data.fileName;
  }
}

export class ContractDocumnetTotalResponseDTO {
  constructor(
    public currentPage: number,
    public totalPages: number,
    public totalItemCount: number,
    public data: ContractDocumentItem[],
  ) {}
}

export class DraftContractDocumentResponseDTO {
  constructor(public drafts: DraftContractDocumentItem) {}
}
