/** A transparent comparison of logged sleep with a chosen nightly target. */
export interface DailyLog {
  date: string;
  hoursSlept: number;
}

export interface SleepShortfallResult {
  targetHours: number;
  averageHours: number;
  totalShortfallHours: number;
  nightsBelowTarget: number;
  daily: Array<{ date: string; hoursSlept: number; shortfallHours: number }>;
}

export function calculateSleepShortfall(
  logs: DailyLog[],
  targetHours: number
): SleepShortfallResult {
  const daily = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => ({
      date: log.date,
      hoursSlept: log.hoursSlept,
      shortfallHours: Math.max(0, Math.round((targetHours - log.hoursSlept) * 10) / 10),
    }));

  const totalShortfallHours =
    Math.round(daily.reduce((sum, day) => sum + day.shortfallHours, 0) * 10) / 10;
  const averageHours = daily.length
    ? Math.round((daily.reduce((sum, day) => sum + day.hoursSlept, 0) / daily.length) * 10) / 10
    : 0;

  return {
    targetHours,
    averageHours,
    totalShortfallHours,
    nightsBelowTarget: daily.filter((day) => day.shortfallHours > 0).length,
    daily,
  };
}
