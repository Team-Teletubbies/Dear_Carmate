import { formatLocalDateTime } from './formatLocalDateTime';
import { MeetingInput, MeetingDTO } from '../../types/contractType';

export const transformMeetingToDTO = (meetings: MeetingInput[]): MeetingDTO[] => {
  return (meetings ?? []).map((meet) => ({
    date: new Date(meet.date).toISOString(),
    alarms: Array.isArray(meet.alarm) ? meet.alarm.map((a) => formatLocalDateTime(a.time)) : [],
  }));
};

export const transformMeetingToPrisma = (
  meetings: { date: string | Date; alarms?: string[] }[],
): { date: Date; alarm: { time: Date }[] }[] => {
  return (meetings ?? []).map((meet) => ({
    date: new Date(meet.date),
    alarm: (meet.alarms ?? []).map((alarm) => ({ time: new Date(alarm) })),
  }));
};
