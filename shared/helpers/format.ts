import dayjs from "dayjs";
export function diffTime(time: string) {
  const now = dayjs();
  const timeToCompare = dayjs(time);
  const diffInMinutes = timeToCompare.diff(now, "millisecond");
  return diffInMinutes;
}

export function formatTime(time: string, format = "YYYY-MM-DD") {
  return dayjs(time).format(format);
}

export function getTime(val: number) {
  return dayjs(val).format("HH:mm:ss");
}
