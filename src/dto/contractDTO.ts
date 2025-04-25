import { ContractParticipant, Meeting, MinimalContract } from '../types/contractType';
import { toClientStatus } from '../lib/utils/statusMap';
import { Contract } from '@prisma/client';
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
  user: ContractParticipant;
  customer: ContractParticipant;
  car: { id: number; model: string };

  constructor(contract: MinimalContract) {
    this.id = contract.id;
    this.contractStatus = contract.contractStatus;
    this.resolutionDate = contract.resolutionDate
      ? new Date(contract.resolutionDate).toISOString()
      : null;
    this.contractPrice = contract.contractPrice;
    this.meetings = contract.meeting.map((meet) => ({
      date: new Date(meet.date).toISOString().slice(0, 10),
      alarms: meet.alarms.map((alarm) => new Date(alarm).toISOString()),
    }));
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
  contractStatus: string;
  resolutionDate: string;
  contractPrice: number;
  meetings: { date: string; alarms: string[] }[];
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
    this.contractStatus = toClientStatus(contract.contractStatus);
    this.resolutionDate = contract.resolutionDate?.toISOString() ?? '';
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

export class ContractResponseDTO {
  id: number;
  car: { id: number; model: { name: string } };
  customer: { id: number; name: string };
  user: { id: number; name: string };
  meetings: {
    date: string;
    alarms: string[];
  }[];
  contractPrice: number;
  resolutionDate: string;
  contractStatus: string;

  constructor(data: MinimalContract) {
    this.id = data.id;
    this.car = { id: data.car.id, model: { name: data.car.model.name } };
    this.customer = { id: data.customer.id, name: data.customer.name };
    this.user = { id: data.user.id, name: data.user.name };
    this.meetings = data.meeting.map((meet) => ({
      date: new Date(meet.date).toISOString().slice(0, 10),
      alarms: meet.alarms.map((alarm) => new Date(alarm).toISOString()),
    }));
    this.contractPrice = data.contractPrice;
    this.resolutionDate = data.resolutionDate ? new Date(data.resolutionDate).toISOString() : '';
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

export class GroupedContractsResponseDTO {
  [satus: string]: {
    totalItemCount: number;
    data: ContractResponseDTO[];
  };

  constructor(
    groupData: Partial<Record<string, MinimalContract[]>>,
    counts: Record<string, number>,
  ) {
    for (const status in groupData) {
      const data = groupData[status] ?? [];
      this[status] = {
        totalItemCount: counts[status] ?? 0,
        data: data.map((contract) => new ContractResponseDTO(contract)),
      };
    }
  }
}
