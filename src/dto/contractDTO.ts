import { ContractParticipant, ContractCar, Meeting } from '../types/contractType';

export interface CreateContractDTO {
  carId: number;
  customerId: number;
  meetings: Meeting[];
}

export interface UpdateContractDTO {
  contractStatus:
    | 'carInspection'
    | 'priceNegotiation'
    | 'contractDraft'
    | 'contractSuccessful'
    | 'contractFailed';
  resolutionDate: string;
  contractPrice: number;
  meetings: Meeting[];
  contractDocumentIdsToAdd: number[];
  contractDocumentIdsToRemove: number[];
  userId: number;
  customerId: number;
  carId: number;
}

export class ContractResponseDTO {
  id: number;
  car: ContractCar;
  customer: ContractParticipant;
  user: ContractParticipant;
  meetings: Meeting[];
  contractPrice: number;
  resolutionDate: string;
  contractStatus: string;

  constructor(data: {
    id: number;
    car: ContractCar;
    customer: ContractParticipant;
    user: ContractParticipant;
    meetings: Meeting[];
    contractPrice: number;
    resolutionDate: string;
    contractStatus: string;
  }) {
    this.id = data.id;
    this.car = data.car;
    this.customer = data.customer;
    this.user = data.user;
    this.meetings = data.meetings;
    this.contractPrice = data.contractPrice;
    this.resolutionDate = data.resolutionDate;
    this.contractStatus = data.contractStatus;
  }
}

export class ContractCategoryResponseDTO {
  totalItemCount: number;
  data: ContractResponseDTO[];

  constructor(totalItemCount: number, data: ContractResponseDTO[]) {
    this.totalItemCount = totalItemCount;
    this.data = data;
  }
}

export class ContractListResponseDTO {
  carInspection: ContractCategoryResponseDTO;
  priceNegotiation: ContractCategoryResponseDTO;
  contractDraft: ContractCategoryResponseDTO;
  contractSuccessful: ContractCategoryResponseDTO;
  contractFailed: ContractCategoryResponseDTO;

  constructor(data: {
    carInspection: ContractCategoryResponseDTO;
    priceNegotiation: ContractCategoryResponseDTO;
    contractDraft: ContractCategoryResponseDTO;
    contractSuccessful: ContractCategoryResponseDTO;
    contractFailed: ContractCategoryResponseDTO;
  }) {
    this.carInspection = data.carInspection;
    this.priceNegotiation = data.priceNegotiation;
    this.contractDraft = data.contractDraft;
    this.contractSuccessful = data.contractSuccessful;
    this.contractFailed = data.contractFailed;
  }
}
