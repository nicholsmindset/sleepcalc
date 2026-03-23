/**
 * Caffeine metabolism calculator using exponential half-life decay.
 *
 * Caffeine has an average half-life of ~5 hours in healthy adults, meaning
 * half the caffeine in your system is eliminated every 5 hours. This varies
 * by individual metabolism, liver enzyme activity, and medications.
 *
 * Formula: remaining_mg = initial_mg * (0.5 ^ (elapsed_hours / half_life))
 *
 * The "safe for sleep" threshold is ~50 mg — roughly the amount in a cup of
 * green tea. Above this level, caffeine measurably increases sleep latency
 * and reduces deep sleep.
 *
 * All functions are pure — no side effects, no React imports.
 */

/** Average caffeine half-life in hours for a healthy adult */
export const CAFFEINE_HALF_LIFE_HOURS = 5;

/** Maximum caffeine level at bedtime (mg) that allows decent sleep quality */
export const SAFE_BEDTIME_CAFFEINE_MG = 50;

/** Interval in minutes for generating decay curve data points */
const DECAY_CURVE_INTERVAL_MIN = 30;

export interface CaffeineDrink {
  /** Display name */
  name: string;
  /** Typical caffeine content in milligrams per serving */
  caffeineContentMg: number;
  /** Emoji icon for UI display */
  icon: string;
}

/** Common caffeinated beverages with typical caffeine content per serving */
export const DRINK_PRESETS: CaffeineDrink[] = [
  { name: 'Espresso', caffeineContentMg: 63, icon: '\u2615' },
  { name: 'Drip Coffee', caffeineContentMg: 95, icon: '\u2615' },
  { name: 'Cold Brew', caffeineContentMg: 200, icon: '\uD83E\uDDCA' },
  { name: 'Green Tea', caffeineContentMg: 28, icon: '\uD83C\uDF75' },
  { name: 'Black Tea', caffeineContentMg: 47, icon: '\uD83E\uDED6' },
  { name: 'Energy Drink', caffeineContentMg: 80, icon: '\u26A1' },
  { name: 'Pre-Workout', caffeineContentMg: 200, icon: '\uD83D\uDCAA' },
  { name: 'Diet Cola', caffeineContentMg: 46, icon: '\uD83E\uDD64' },
];

export interface CaffeineLogEntry {
  /** The drink consumed */
  drink: CaffeineDrink;
  /** When it was consumed */
  consumedAt: Date;
}

export interface CaffeineAtTime {
  /** Point in time */
  time: Date;
  /** Total remaining caffeine in mg across all drinks */
  totalMg: number;
}

export interface CaffeineCutoffResult {
  /** Latest safe time to consume caffeine for the given bedtime */
  cutoffTime: Date;
  /** Estimated total caffeine remaining in the body at bedtime (mg) */
  caffeineAtBedtime: number;
  /** Whether the total caffeine at bedtime is below the safe threshold */
  isSafeForSleep: boolean;
  /** Time-series of total caffeine levels at 30-minute intervals */
  decayCurve: CaffeineAtTime[];
  /** Per-drink breakdown showing how much each contributes at bedtime */
  perDrinkStatus: {
    drink: CaffeineDrink;
    consumedAt: Date;
    mgAtBedtime: number;
    isSafe: boolean;
  }[];
}

/**
 * Calculate the remaining caffeine (mg) from a single dose at a target time.
 *
 * Uses the exponential decay formula: remaining = initial * 0.5^(t / halfLife).
 * Returns the initial amount if the target time is before or equal to consumption time.
 *
 * @param initialMg - Amount of caffeine consumed in milligrams
 * @param consumedAt - When the caffeine was consumed
 * @param targetTime - The time to calculate remaining caffeine for
 * @param halfLifeHours - Caffeine half-life in hours (default 5)
 * @returns Remaining caffeine in mg, rounded to one decimal place
 */
export function calculateCaffeineAtTime(
  initialMg: number,
  consumedAt: Date,
  targetTime: Date,
  halfLifeHours: number = CAFFEINE_HALF_LIFE_HOURS
): number {
  const elapsedMs = targetTime.getTime() - consumedAt.getTime();
  if (elapsedMs <= 0) return initialMg;

  const elapsedHours = elapsedMs / 3_600_000;
  const remaining = initialMg * Math.pow(0.5, elapsedHours / halfLifeHours);

  return Math.round(remaining * 10) / 10;
}

/**
 * Calculate the total remaining caffeine at a target time from multiple drinks.
 */
function totalCaffeineAt(
  log: CaffeineLogEntry[],
  targetTime: Date,
  halfLifeHours: number
): number {
  return log.reduce((total, entry) => {
    return total + calculateCaffeineAtTime(
      entry.drink.caffeineContentMg,
      entry.consumedAt,
      targetTime,
      halfLifeHours
    );
  }, 0);
}

/**
 * Calculate the latest safe caffeine cutoff time for a given bedtime.
 *
 * Works backwards from bedtime to find the latest time at which a standard
 * drip coffee (95 mg) would decay to below the safe threshold. Also computes
 * a complete analysis of all logged drinks including a time-series decay curve.
 *
 * @param bedtime - The user's planned bedtime
 * @param log - Array of caffeine consumption entries for the day
 * @param halfLifeHours - Caffeine half-life in hours (default 5)
 * @returns Full caffeine analysis with cutoff time, decay curve, and per-drink status
 */
export function calculateCutoff(
  bedtime: Date,
  log: CaffeineLogEntry[],
  halfLifeHours: number = CAFFEINE_HALF_LIFE_HOURS
): CaffeineCutoffResult {
  // Calculate per-drink status at bedtime
  const perDrinkStatus = log.map((entry) => {
    const mgAtBedtime = calculateCaffeineAtTime(
      entry.drink.caffeineContentMg,
      entry.consumedAt,
      bedtime,
      halfLifeHours
    );
    return {
      drink: entry.drink,
      consumedAt: entry.consumedAt,
      mgAtBedtime,
      isSafe: mgAtBedtime <= SAFE_BEDTIME_CAFFEINE_MG,
    };
  });

  // Total caffeine at bedtime
  const caffeineAtBedtime =
    Math.round(perDrinkStatus.reduce((sum, d) => sum + d.mgAtBedtime, 0) * 10) / 10;
  const isSafeForSleep = caffeineAtBedtime <= SAFE_BEDTIME_CAFFEINE_MG;

  // Calculate cutoff time: work backwards from bedtime
  // Find when a standard coffee (95 mg) would decay to the safe threshold
  const standardCoffeeMg = 95;
  // remaining = initial * 0.5^(t/halfLife) => t = halfLife * log2(initial / remaining)
  const hoursNeeded =
    halfLifeHours * (Math.log(standardCoffeeMg / SAFE_BEDTIME_CAFFEINE_MG) / Math.LN2);
  const cutoffTime = new Date(bedtime.getTime() - hoursNeeded * 3_600_000);

  // Generate decay curve at 30-minute intervals
  const decayCurve: CaffeineAtTime[] = [];

  if (log.length > 0) {
    const earliest = log.reduce(
      (min, e) => (e.consumedAt.getTime() < min ? e.consumedAt.getTime() : min),
      Infinity
    );
    const curveStart = new Date(earliest);
    const curveEnd = new Date(bedtime.getTime() + 2 * 3_600_000); // bedtime + 2h
    const intervalMs = DECAY_CURVE_INTERVAL_MIN * 60_000;

    for (
      let t = curveStart.getTime();
      t <= curveEnd.getTime();
      t += intervalMs
    ) {
      const time = new Date(t);
      const totalMg = Math.round(totalCaffeineAt(log, time, halfLifeHours) * 10) / 10;
      decayCurve.push({ time, totalMg });
    }
  }

  return {
    cutoffTime,
    caffeineAtBedtime,
    isSafeForSleep,
    decayCurve,
    perDrinkStatus,
  };
}
