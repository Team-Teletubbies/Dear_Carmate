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

export class DocumentSummary {
  constructor(
    public id: number,
    public fileName: string,
  ) {}
}
export class ContractDocumentItem {
  id: number;
  contractName: string;
  resolutionDate: Date;
  documentsCount: number;
  manager: string;
  carNumber: string;
  documents: DocumentSummary[];

  constructor(contract: any) {
    this.id = contract.id;

    const modelName = contract.car?.model?.name ?? '모델없음';
    const customerName = contract.customer?.name ?? '고객없음';
    this.contractName = `${modelName} - ${customerName} 고객님`;

    this.resolutionDate = contract.resolutionDate;
    this.documentsCount = contract.contractDocuments.length ?? 0;
    this.manager = contract.user.name ?? '담당자없음';
    this.carNumber = contract.car.carNumber ?? '차량번호없음';
    this.documents =
      contract.contractDocuments.map((d: any) => new DocumentSummary(d.id, d.fileName)) ?? [];
  }
}

export class DraftContractDocumentItem {
  id: number;
  data: string;

  constructor(contract: any) {
    this.id = contract.id;
    const model = contract.car?.model?.name ?? '모델없음';
    const customerName = contract.customer?.name ?? '고객없음';
    this.data = `${model} - ${customerName} 고객님`;
  }
}
