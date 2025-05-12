import { CarStatus } from '@prisma/client';
import { statuses } from '../../structs/carStruct';

type StatusType = (typeof statuses)[number];

function toPrismaCarStatus(status: StatusType): CarStatus {
  return status.replace(/([A-Z])/g, '_$1').toUpperCase() as CarStatus;
}

export function mapCarStatus(status: string): CarStatus {
  if (!status || !status.trim()) {
    throw new Error(`Invalid carStatus: ${status}`);
  }

  const lower = status.toLowerCase();
  const match = statuses.find((s) => s.toLowerCase() === lower);
  if (!match) {
    throw new Error(`Invalid carStatus: ${status}`);
  }

  return toPrismaCarStatus(match as StatusType);
}
