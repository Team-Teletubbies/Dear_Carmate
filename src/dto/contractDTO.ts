export interface AlarmDTO {
  time: string;
}

export interface MeetingDTO {
  date: string;
  alrams: AlarmDTO[];
}

export interface CreateContractDTO {
  carId: number;
  customerId: number;
  meetings: MeetingDTO[];
}
