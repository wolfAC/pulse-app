import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string consistently to avoid hydration mismatches.
 * Uses a fixed locale and formatting to ensure server/client consistency.
 */
export function formatDate(
  dateStr: string,
  options?: { includeWeekday?: boolean; includeYear?: boolean },
) {
  const date = new Date(dateStr);
  const parts: string[] = [];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (options?.includeWeekday) {
    parts.push(weekdays[date.getDay()]);
  }

  parts.push(`${months[date.getMonth()]} ${date.getDate()}`);

  if (options?.includeYear) {
    parts.push(String(date.getFullYear()));
  }

  return parts.join(", ");
}

/**
 * Formats a date string as a simple date (e.g., "Jan 15, 2024")
 */
export function formatSimpleDate(dateStr: string) {
  const date = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
