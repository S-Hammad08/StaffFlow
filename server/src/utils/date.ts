import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateKey(value: string) {
  const match = datePattern.exec(value);
  if (!match) throw new AppError(400, "Date must use the YYYY-MM-DD format.");

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new AppError(400, "The selected date is invalid.");
  }

  return date;
}

export function getCurrentDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: env.APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
