import { ContractParticipant, ContractCar, Meeting, MinimalContract } from '../types/contractType';

export interface CreateContractDTO {
  carId: number;
  customerId: number;
  userId: number;
  contractPrice: number;
  meetings: Meeting[];
}

export class CreateContractResponseDTO {
  id: number;
  contractStatus: string;
  resolutionDate: string | null;
  contractPrice: number;
  meetings: Meeting[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: string };

  constructor(contract: MinimalContract) {
    this.id = contract.id;
    this.contractStatus = contract.contractStatus;
    this.resolutionDate = contract.resolutionDate ? contract.resolutionDate.toISOString() : null;
    this.contractPrice = contract.contractPrice;
    this.meetings = contract.meeting.map((meet) => ({
      date: meet.date.toISOString().slice(0, 10),
      alarms: meet.alarm.map((alarm) => alarm.time.toISOString()),
    }));
    this.user = {
      id: contract.user.id,
      name: contract.user.name,
    };
    this.customer = {
      id: contract.customer.id,
      name: contract.customer.name,
    };
    this.car = {
      id: contract.car.id,
      model: contract.car.model.name,
    };
  }
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
