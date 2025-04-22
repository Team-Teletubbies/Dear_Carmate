import { ContractDocument } from '@prisma/client';

export class UploadContractDocumentResponseDTO {
  contractDocumentId: number;
  constructor(data: ContractDocument) {
    this.contractDocumentId = data.id;
  }
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
