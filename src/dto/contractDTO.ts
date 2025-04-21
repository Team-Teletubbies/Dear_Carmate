export interface AlarmDTO {
  time: string;
}

export interface MettingDTO {
  date: string;
  alrams: AlarmDTO[];
}

export interface CreateContractDTO {
  carId: number;
  customerId: number;
  meetings: MettingDTO[];
}
