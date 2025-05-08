export interface ContractDocument {
  id: number;
  contractId: number | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}
export type contractDocuments = Pick<ContractDocument, 'id' | 'fileName'>;
export type UploadContractDocument = Omit<
  ContractDocument,
  'id' | 'createdAt' | 'updatedAt' | 'contractId'
>;

export class DocumentSummary {
  constructor(
    public id: number,
    public fileName: string,
  ) {}
}
export class ContractDocumentItem {
  id: number;
  contractName: string;
  resolutionDate: Date | '';
  documentCount: number;
  userName: string;
  carNumber: string;
  documents: DocumentSummary[];

  constructor(contract: ContractForDocumentItem) {
    this.id = contract.id;

    const modelName = contract.car.model.name;
    const customerName = contract.customer.name;
    this.contractName = `${modelName} - ${customerName} 고객님`;
    this.resolutionDate = contract.resolutionDate ? contract.resolutionDate : '';
    this.documentCount = contract.contractDocuments.length ?? 0;
    this.userName = contract.user.name;
    this.carNumber = contract.car.carNumber;
    this.documents =
      contract.contractDocuments.map(
        (document: contractDocuments) => new DocumentSummary(document.id, document.fileName),
      ) ?? [];
  }
}

export class DraftContractDocumentItem {
  id: number;
  data: string;

  constructor(contract: DraftContractForDocumentItem) {
    this.id = contract.id;
    const model = contract.car.model.name;
    const customerName = contract.customer.name;
    this.data = `${model} - ${customerName} 고객님`;
  }
}

export type ContractForDocumentItem = {
  id: number;
  resolutionDate: Date | null;
  user: {
    name: string;
  };
  customer: {
    name: string;
  };
  car: {
    carNumber: string;
    model: {
      name: string;
    };
  };
  contractDocuments: {
    id: number;
    fileName: string;
  }[];
};

export type DraftContractForDocumentItem = {
  id: number;
  car: { model: { name: string } };
  customer: { name: string };
};
