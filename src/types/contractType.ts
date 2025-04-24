export type MinimalContract = {
  id: number;
  contractStatus: string;
  resolutionDate: Date | null;
  contractPrice: number;
  meeting: {
    date: Date;
    alarm: {
      time: Date;
    }[];
  }[];
  user: { id: number; name: string };
  customer: { id: number; name: string };
  car: { id: number; model: { name: string } };
};

export interface ContractParticipant {
  id: number;
  name: string;
}

export interface ContractCar {
  id: number;
  model: string;
}

export interface Meeting {
  date: string;
  alarms: string[];
}
