import dayjs from "dayjs"
export function diffTime(time: string) {
  const now = dayjs();
  const timeToCompare = dayjs(time);
  const diffInMinutes = timeToCompare.diff(now, 'minute');
  return diffInMinutes;
}