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

export interface Meeting {
  date: string;
  alarms: string[];
}

export type MinimalContract = {
  id: number;
  contractStatus: string;
  resolutionDate: string | Date | null;
  contractPrice: number;
  meeting: {
    date: string | Date;
    alarms: string[];
  }[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: { name: string } };
};

export interface StatusContractItem {
  id: number;
  car: ContractCar;
  customer: ContractParticipant;
  user: ContractParticipant;
  meetings: Meeting[];
  contractPrice: number;
  resolutionDate: string;
  contractStatus: string;
}

export type GroupedContractSearchParams = {
  companyId: number;
  searchBy?: 'customerName' | 'userName';
  keyword?: string;
};
