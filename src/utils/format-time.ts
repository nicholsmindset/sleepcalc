/**
 * Time formatting and parsing utilities.
 *
 * Provides consistent time display across the application — 12-hour format
 * with AM/PM for user-facing display, 24-hour for data, and human-readable
 * duration strings. All functions are pure and locale-independent to avoid
 * hydration mismatches between server and client rendering.
 *
 * All functions are pure — no side effects, no React imports.
 */

/**
 * Format a Date to 12-hour time string with AM/PM.
 *
 * @param date - The date to format
 * @returns Formatted string like "10:30 PM" or "12:00 AM"
 *
 * @example
 * formatTime12h(new Date('2026-03-23T22:30:00')) // "10:30 PM"
 * formatTime12h(new Date('2026-03-23T00:00:00')) // "12:00 AM"
 * formatTime12h(new Date('2026-03-23T12:00:00')) // "12:00 PM"
 */
export function formatTime12h(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format a Date to 24-hour time string.
 *
 * @param date - The date to format
 * @returns Formatted string like "22:30" or "09:05"
 *
 * @example
 * formatTime24h(new Date('2026-03-23T22:30:00')) // "22:30"
 * formatTime24h(new Date('2026-03-23T09:05:00')) // "09:05"
 */
export function formatTime24h(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a duration in minutes to a compact human-readable string.
 *
 * @param minutes - Duration in minutes (can be fractional)
 * @returns Formatted string like "7h 30m", "45m", or "0m"
 *
 * @example
 * formatDuration(450) // "7h 30m"
 * formatDuration(45)  // "45m"
 * formatDuration(60)  // "1h 0m"
 * formatDuration(0)   // "0m"
 */
export function formatDuration(minutes: number): string {
  const totalMinutes = Math.round(Math.max(0, minutes));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/**
 * Format a duration in minutes to a long-form readable string.
 *
 * @param minutes - Duration in minutes (can be fractional)
 * @returns Formatted string like "7.5 hours", "0.5 hours", or "1 hour"
 *
 * @example
 * formatDurationLong(450) // "7.5 hours"
 * formatDurationLong(60)  // "1 hour"
 * formatDurationLong(30)  // "0.5 hours"
 */
export function formatDurationLong(minutes: number): string {
  const hours = Math.round((Math.max(0, minutes) / 60) * 10) / 10;

  if (hours === 1) return '1 hour';
  return `${hours} hours`;
}

/**
 * Parse a time string in either 12-hour ("10:30 PM") or 24-hour ("22:30")
 * format into hours and minutes components.
 *
 * Supports formats:
 * - "10:30 PM", "10:30PM", "10:30 pm"
 * - "22:30"
 * - "9:05 AM", "9:05AM"
 *
 * @param timeStr - The time string to parse
 * @returns Object with hours (0-23) and minutes (0-59)
 * @throws Error if the string cannot be parsed
 *
 * @example
 * parseTimeString("10:30 PM") // { hours: 22, minutes: 30 }
 * parseTimeString("22:30")    // { hours: 22, minutes: 30 }
 * parseTimeString("12:00 AM") // { hours: 0, minutes: 0 }
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const trimmed = timeStr.trim();

  // Try 12-hour format: "10:30 PM", "10:30PM", "10:30 pm"
  const match12h = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  if (match12h) {
    let hours = parseInt(match12h[1], 10);
    const minutes = parseInt(match12h[2], 10);
    const isPM = match12h[3].toUpperCase() === 'PM';

    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid 12-hour time: "${timeStr}"`);
    }

    // Convert 12-hour to 24-hour
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return { hours, minutes };
  }

  // Try 24-hour format: "22:30", "09:05"
  const match24h = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24h) {
    const hours = parseInt(match24h[1], 10);
    const minutes = parseInt(match24h[2], 10);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid 24-hour time: "${timeStr}"`);
    }

    return { hours, minutes };
  }

  throw new Error(
    `Cannot parse time string: "${timeStr}". Expected format: "10:30 PM" or "22:30".`
  );
}

/**
 * Create a Date object for today at a specific hour and minute.
 * Uses the local timezone. Seconds and milliseconds are zeroed.
 *
 * @param hours - Hour in 24-hour format (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Date set to today at the specified time
 */
export function timeToday(hours: number, minutes: number): Date {
  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
}

/**
 * Create a Date object for tomorrow at a specific hour and minute.
 * Uses the local timezone. Seconds and milliseconds are zeroed.
 *
 * @param hours - Hour in 24-hour format (0-23)
 * @param minutes - Minutes (0-59)
 * @returns Date set to tomorrow at the specified time
 */
export function timeTomorrow(hours: number, minutes: number): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hours, minutes, 0, 0);
  return tomorrow;
}
