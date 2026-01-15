import dayjs from '@/utils/dayjs.config';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Schedule } from '../class.domain';

dayjs.extend(customParseFormat);

function isDateOverlap(scheduleA: Schedule, scheduleB: Schedule) {
  return (
    scheduleA.start_date <= scheduleB.end_date &&
    scheduleB.start_date <= scheduleA.end_date
  );
}

function isDayOverlap(scheduleA: Schedule, scheduleB: Schedule) {
  return scheduleA.days_of_week.some((d) => scheduleB.days_of_week.includes(d));
}

function isTimeSlotOverlap(scheduleA: Schedule, scheduleB: Schedule) {
  const startA = dayjs(scheduleA.time_slots.start_time, 'HH:mm');
  const endA = dayjs(scheduleA.time_slots.end_time, 'HH:mm');

  const startB = dayjs(scheduleB.time_slots.start_time, 'HH:mm');
  const endB = dayjs(scheduleB.time_slots.end_time, 'HH:mm');

  return startA <= endB && startB <= endA;
}

export function hasScheduleConflict(
  scheduleA?: Schedule | null,
  scheduleB?: Schedule | null,
): boolean {
  if (!scheduleA || !scheduleB) return false;
  if (!scheduleA.start_date || !scheduleA.end_date) return false;
  if (!scheduleB.start_date || !scheduleB.end_date) return false;
  if (
    !Array.isArray(scheduleA.days_of_week) ||
    !Array.isArray(scheduleB.days_of_week)
  )
    return false;
  if (!scheduleA.time_slots || !scheduleB.time_slots) return false;

  return (
    isDateOverlap(scheduleA, scheduleB) &&
    isDayOverlap(scheduleA, scheduleB) &&
    isTimeSlotOverlap(scheduleA, scheduleB)
  );
}
