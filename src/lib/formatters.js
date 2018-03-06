import { format } from "date-fns";

export function asFullDate(dt = new Date()) {
  return format(dt, "dddd, MMM. D, YYYY");
}

export function asDayOfWeek(date = new Date()) {
  return format(date, "dddd");
}

export function asTimeOfDay(date = new Date()) {
  return format(date, "h:mmA");
}

export function temperature(temp = 0.0) {
  return `${Number(temp).toFixed(0)}°`;
}
