import { statusMap } from '../lib/utils/statusMap';
import { ContractStatus, Prisma } from '@prisma/client';

export interface ContractParticipant {
  id: number;
  name: string;
}

export interface ContractCar {
  id: number;
  model: {
    name: string;
  };
}

export type MinimalContract = {
  id: number;
  contractStatus: ContractStatus;
  resolutionDate: string | Date | null;
  contractPrice: number;
  meeting: MeetingEntity[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: { name: string } };
};

export interface StatusContractItem {
  id: number;
  car: ContractCar;
  customer: ContractParticipant;
  user: ContractParticipant;
  meetings: MeetingDTO[];
  contractPrice: number;
  resolutionDate: string;
  contractStatus: string;
}

export type GroupedContractSearchParams = {
  companyId: number;
  searchBy?: 'customerName' | 'userName';
  keyword?: string;
};

export interface BaseUpdateContractFields {
  status?: keyof typeof statusMap;
  resolutionDate?: string | null;
  contractPrice?: number;
  meetings?: MeetingInput[];
  contractDocuments?: { id?: number; fileName?: string }[];
  carId?: number;
  customerId?: number;
  userId?: number;
}

export interface UpdateContractType extends BaseUpdateContractFields {
  id: number;
  editorUserId: number;
}

export type ContractIncludeMap = {
  cars: { car: { include: { model: true } } };
  customers: { customer: true };
  users: { user: true };
};

export interface ContractQueryParams {
  where: Prisma.ContractWhereInput;
  include: Prisma.ContractInclude;
}

export type ContractWithRelations = Prisma.ContractGetPayload<{
  include: {
    user: true;
    customer: true;
    car: {
      include: {
        model: true;
      };
    };

    meeting: true;
    contractDocuments: true;
  };
}>;

export type ContractWithUser = Prisma.ContractGetPayload<{
  include: {
    user: true;
    meeting: true;
    contractDocuments: true;
  };
}>;

export type MeetingDTO = {
  date: string;
  alarms: string[];
};

export type MeetingInput = {
  date: string | Date;
  alarm?: { time: Date }[];
  alarms?: string[];
};

export type MeetingEntity = {
  date: Date;
  alarm?: { time: Date }[];
};
