import { formatLocalDateTime } from './formatLocalDateTime';
import { MeetingInput, MeetingDTO, MeetingEntity } from '../../types/contractType';
import { Prisma } from '@prisma/client';

export const transformMeetingToDTO = (meetings: MeetingInput[]): MeetingDTO[] => {
  return (meetings ?? []).map((meet) => ({
    date: new Date(meet.date).toISOString(),
    alarms: Array.isArray(meet.alarm) ? meet.alarm.map((a) => formatLocalDateTime(a.time)) : [],
  }));
};

export const transformMeetingToPrisma = (
  meetings: { date: string | Date; alarms?: string[] }[],
): Prisma.MeetingCreateWithoutContractInput[] => {
  return meetings.map((meet) => ({
    date: new Date(meet.date),
    alarm: {
      create: (meet.alarms ?? []).map((alarm) => ({
        time: new Date(alarm),
      })),
    },
  }));
};
