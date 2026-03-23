/**
 * Sleep debt calculation and recovery planning.
 *
 * Sleep debt accumulates when actual sleep falls below the age-appropriate
 * recommendation. Chronic sleep debt degrades cognitive function, immune
 * response, and metabolic health. Recovery requires gradual payback over
 * multiple days — you cannot safely "crash" away a large deficit in one night.
 *
 * All functions are pure — no side effects, no React imports.
 */

/** Default recommended hours of sleep per night for adults (NSF guideline) */
const DEFAULT_RECOMMENDED_HOURS = 8;

/** Maximum extra recovery sleep per day in hours (above recommendation) */
const MAX_EXTRA_RECOVERY_PER_DAY = 2;

/** Weekend recovery bonus — people can naturally sleep longer */
const WEEKEND_EXTRA_BONUS = 0.5;

export interface DailyLog {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Hours of actual sleep */
  hoursSlept: number;
}

export interface SleepDebtResult {
  /** Total accumulated sleep debt in hours */
  totalDebtHours: number;
  /** Per-day breakdown with running cumulative debt */
  dailyDeficits: {
    date: string;
    /** Deficit for this day (positive = under-slept, negative = surplus) */
    deficit: number;
    /** Running cumulative debt up to and including this day */
    cumulative: number;
  }[];
  /** Severity classification of the total debt */
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  /** Estimated days needed to fully recover */
  recoveryDays: number;
}

export interface RecoveryPlan {
  /** Day-by-day recovery schedule */
  days: {
    /** ISO date string */
    date: string;
    /** Total hours to sleep on this day */
    targetHours: number;
    /** Extra hours above the normal recommendation */
    extraSleep: number;
  }[];
  /** Total number of days in the recovery plan */
  totalRecoveryDays: number;
}

/**
 * Classify sleep debt severity.
 *
 * - none: < 1 hour — negligible, no action needed
 * - mild: 1-5 hours — recoverable in a few days
 * - moderate: 5-10 hours — noticeable cognitive and mood effects
 * - severe: > 10 hours — significant health risk, may need weeks to recover
 */
function classifySeverity(debtHours: number): SleepDebtResult['severity'] {
  if (debtHours < 1) return 'none';
  if (debtHours <= 5) return 'mild';
  if (debtHours <= 10) return 'moderate';
  return 'severe';
}

/**
 * Estimate recovery days required to pay back a given sleep debt.
 *
 * Assumes an average of 1.5 extra hours of sleep per day during recovery,
 * accounting for the body's natural tendency to sleep more on weekends.
 */
function estimateRecoveryDays(debtHours: number): number {
  if (debtHours < 1) return 0;
  const avgExtraPerDay = 1.5;
  return Math.ceil(debtHours / avgExtraPerDay);
}

/**
 * Calculate sleep debt from a set of daily sleep logs.
 *
 * Computes the deficit for each logged day relative to the recommended hours,
 * accumulates a running total, and classifies severity. Surplus sleep on any
 * given day can offset prior debt (cumulative cannot go below zero).
 *
 * @param logs - Array of daily sleep logs (any order; will be sorted by date)
 * @param recommendedHours - Age-appropriate recommended hours (default 8)
 * @returns Complete sleep debt analysis with per-day breakdown
 */
export function calculateSleepDebt(
  logs: DailyLog[],
  recommendedHours: number = DEFAULT_RECOMMENDED_HOURS
): SleepDebtResult {
  if (logs.length === 0) {
    return {
      totalDebtHours: 0,
      dailyDeficits: [],
      severity: 'none',
      recoveryDays: 0,
    };
  }

  const sorted = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulative = 0;
  const dailyDeficits = sorted.map((log) => {
    const deficit = Math.round((recommendedHours - log.hoursSlept) * 100) / 100;
    cumulative = Math.max(0, Math.round((cumulative + deficit) * 100) / 100);
    return {
      date: log.date,
      deficit,
      cumulative,
    };
  });

  const totalDebtHours = Math.round(cumulative * 100) / 100;

  return {
    totalDebtHours,
    dailyDeficits,
    severity: classifySeverity(totalDebtHours),
    recoveryDays: estimateRecoveryDays(totalDebtHours),
  };
}

/**
 * Generate a gradual recovery plan to pay back accumulated sleep debt.
 *
 * Strategy:
 * - Weekdays: add 1-1.5 extra hours above the 8-hour recommendation
 * - Weekends (Sat/Sun): add 1.5-2 extra hours for natural catch-up
 * - Total recovery is capped so the plan never exceeds 10 hours per night
 * - The plan ends when the full debt is repaid
 *
 * @param debtHours - Total hours of sleep debt to recover
 * @param startDate - First day of the recovery plan (default: tomorrow)
 * @returns Day-by-day recovery schedule
 */
export function generateRecoveryPlan(
  debtHours: number,
  startDate?: Date
): RecoveryPlan {
  if (debtHours < 0.5) {
    return { days: [], totalRecoveryDays: 0 };
  }

  const start = startDate ? new Date(startDate) : new Date();
  if (!startDate) {
    start.setDate(start.getDate() + 1);
  }
  // Normalize to midnight
  start.setHours(0, 0, 0, 0);

  const days: RecoveryPlan['days'] = [];
  let remaining = debtHours;
  let dayIndex = 0;

  while (remaining > 0.25) {
    const current = new Date(start);
    current.setDate(current.getDate() + dayIndex);
    const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseExtra = isWeekend
      ? MAX_EXTRA_RECOVERY_PER_DAY
      : MAX_EXTRA_RECOVERY_PER_DAY - WEEKEND_EXTRA_BONUS;

    const extraSleep = Math.min(baseExtra, remaining);
    const roundedExtra = Math.round(extraSleep * 100) / 100;

    days.push({
      date: current.toISOString().split('T')[0],
      targetHours: DEFAULT_RECOMMENDED_HOURS + roundedExtra,
      extraSleep: roundedExtra,
    });

    remaining = Math.round((remaining - roundedExtra) * 100) / 100;
    dayIndex++;

    // Safety valve: cap at 30 days to prevent infinite loops on extreme debt
    if (dayIndex > 30) break;
  }

  return {
    days,
    totalRecoveryDays: days.length,
  };
}
