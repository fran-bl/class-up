import { clsx, type ClassValue } from "clsx";
import { format, toZonedTime } from "date-fns-tz";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevel(xp: number) {
  if (xp < 0) xp = 0;

  const level = Math.floor(Math.sqrt(xp / 50) + 1);
  const totalXpForNextLevel = 50 * Math.pow(level, 2);

  return [level, xp, totalXpForNextLevel];
}

export function getFormattedDate(dateString: string) {
  const date = new Date(dateString);
  const timeZone = 'Europe/Berlin';

  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "dd.MM.yyyy'. at 'HH:mm", { timeZone });
}

export function calculateTime(endString: string) {
  const end = new Date(endString);
  const timeDifference = end.getTime() - Date.now();
  const days = Math.floor(timeDifference / (1000 * 3600 * 24));
  const hours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));

  return days + " days, " + hours + " hours left";
}