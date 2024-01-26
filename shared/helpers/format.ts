import dayjs from "dayjs"
export function diffTime(time: string) {
  const now = dayjs();
  const timeToCompare = dayjs(time);
  const diffInMinutes = timeToCompare.diff(now, 'minute');
  return diffInMinutes;
}

export function formatTime(time: string) {
  return dayjs(time).format('DD-MM-YYYY');
}
