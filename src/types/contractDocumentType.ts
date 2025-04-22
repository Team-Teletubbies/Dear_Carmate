export interface ContractDocument {
  id: number;
  contractId: number;
  companyId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UploadContractDocument = Omit<ContractDocument, 'id' | 'createdAt' | 'updatedAt'>;
