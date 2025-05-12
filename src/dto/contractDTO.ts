import {
  ContractParticipant,
  MeetingDTO,
  MeetingInput,
  MinimalContract,
} from '../types/contractType';
import { toClientStatus } from '../lib/utils/statusMap';
import { Contract } from '@prisma/client';
import { formatLocalDateTime } from '../lib/utils/formatLocalDateTime';
import { transformMeetingToDTO } from '../lib/utils/meeting';

export interface CreateContractDTO {
  carId: number;
  customerId: number;
  userId: number;
  companyId: number;
  contractPrice: number;
  meetings?: MeetingInput[];
}

export class CreateContractResponseDTO {
  id: number;
  status: string;
  resolutionDate: string | Record<string, never>;
  contractPrice: number;
  meetings: MeetingDTO[];
  user: ContractParticipant;
  customer: ContractParticipant;
  car: { id: number; model: string };

  constructor(contract: MinimalContract) {
    this.id = contract.id;
    this.status = toClientStatus(contract.contractStatus);
    this.resolutionDate = contract.resolutionDate
      ? formatLocalDateTime(new Date(contract.resolutionDate))
      : '';
    this.contractPrice = contract.contractPrice;
    this.meetings = transformMeetingToDTO(contract.meeting);
    this.user = contract.user;
    this.customer = contract.customer;
    this.car = {
      id: contract.car.id,
      model: contract.car.model.name,
    };
  }
}

export class UpdateContractDTO {
  id: number;
  status: string;
  resolutionDate: string;
  contractPrice: number;
  meetings: MeetingDTO[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: string };

  constructor(
    contract: Contract & {
      user: { id: number; name: string };
      customer: { id: number; name: string };
      car: { id: number; model: { name: string } };
      meeting: { date: Date; alarm: { time: Date }[] }[];
    },
  ) {
    this.id = contract.id;
    this.status = toClientStatus(contract.contractStatus);
    this.resolutionDate = contract.resolutionDate
      ? formatLocalDateTime(new Date(contract.resolutionDate))
      : '';
    this.contractPrice = contract.contractPrice;
    this.meetings = transformMeetingToDTO(contract.meeting);
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

export class ContractResponseDTO {
  id: number;
  car: { id: number; model: string };
  customer: { id: number; name: string };
  user: { id: number; name: string };
  meetings: MeetingDTO[];
  contractPrice: number;
  resolutionDate: string;
  status: string;

  constructor(data: MinimalContract) {
    this.id = data.id;
    this.car = { id: data.car.id, model: data.car.model.name };
    this.customer = { id: data.customer.id, name: data.customer.name };
    this.user = { id: data.user.id, name: data.user.name };
    this.meetings = transformMeetingToDTO(data.meeting);
    this.contractPrice = data.contractPrice;
    this.resolutionDate = data.resolutionDate ? new Date(data.resolutionDate).toISOString() : '';
    this.status = toClientStatus(data.contractStatus);
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

export const buildGroupedContracts = (
  groupData: Partial<Record<string, ContractResponseDTO[]>>,
  counts: Record<string, number>,
): Record<string, { totalItemCount: number; data: ContractResponseDTO[] }> => {
  const result: Record<string, { totalItemCount: number; data: ContractResponseDTO[] }> = {};

  for (const status in groupData) {
    const data = groupData[status] ?? [];
    result[status] = {
      totalItemCount: counts[status] ?? 0,
      data,
    };
  }

  return result;
};

export interface ContractListItem {
  id: number;
  data: string;
}
