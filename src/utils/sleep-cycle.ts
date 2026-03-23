/**
 * Core sleep cycle calculation engine.
 *
 * A sleep cycle averages 90 minutes and consists of light, deep, and REM stages.
 * Earlier cycles are heavier on deep sleep; later cycles shift toward REM.
 * All functions are pure — no side effects, no React imports.
 */

/** Average sleep cycle duration in minutes */
export const DEFAULT_CYCLE_DURATION = 90;

/** Average time to fall asleep in minutes */
export const DEFAULT_SLEEP_LATENCY = 15;

/** Minimum cycles for a recommendation set (3 = ~4.5 hours) */
const MIN_CYCLES = 3;

/** Maximum cycles for a recommendation set (6 = ~9 hours) */
const MAX_CYCLES = 6;

export interface SleepRecommendation {
  /** The calculated bedtime or wake-up time */
  time: Date;
  /** Number of complete sleep cycles */
  cycles: number;
  /** Total minutes of actual sleep (excluding latency) */
  totalSleepMinutes: number;
  /** Quality rating based on cycle count */
  quality: 'optimal' | 'good' | 'minimum';
}

export interface SleepPhase {
  /** Sleep stage name */
  stage: 'awake' | 'light' | 'deep' | 'rem';
  /** Minutes from sleep onset when this phase starts */
  startMinute: number;
  /** Duration of this phase in minutes */
  durationMinutes: number;
}

/**
 * Map a cycle count to a quality rating.
 * 5-6 cycles (7.5-9h) = optimal, 4 cycles (6h) = good, 3 cycles (4.5h) = minimum.
 */
function qualityForCycles(cycles: number): SleepRecommendation['quality'] {
  if (cycles >= 5) return 'optimal';
  if (cycles === 4) return 'good';
  return 'minimum';
}

/**
 * Calculate optimal bedtimes for a given wake-up time.
 *
 * Returns recommendations for 3-6 complete sleep cycles (4.5h to 9h of sleep),
 * ordered from most sleep to least. Each recommendation accounts for sleep
 * latency — the time it takes to fall asleep after getting into bed.
 *
 * @param wakeUpTime - The desired wake-up time
 * @param sleepLatency - Minutes to fall asleep (default 15)
 * @param cycleDuration - Minutes per sleep cycle (default 90)
 * @returns Array of bedtime recommendations, sorted by most cycles first
 */
export function calculateBedtimes(
  wakeUpTime: Date,
  sleepLatency: number = DEFAULT_SLEEP_LATENCY,
  cycleDuration: number = DEFAULT_CYCLE_DURATION
): SleepRecommendation[] {
  const recommendations: SleepRecommendation[] = [];

  for (let cycles = MAX_CYCLES; cycles >= MIN_CYCLES; cycles--) {
    const totalSleepMinutes = cycles * cycleDuration;
    const totalMinutesBeforeWake = totalSleepMinutes + sleepLatency;

    const bedtime = new Date(wakeUpTime.getTime() - totalMinutesBeforeWake * 60_000);

    recommendations.push({
      time: bedtime,
      cycles,
      totalSleepMinutes,
      quality: qualityForCycles(cycles),
    });
  }

  return recommendations;
}

/**
 * Calculate optimal wake-up times for a given bedtime.
 *
 * Returns recommendations for 3-6 complete sleep cycles, ordered from fewest
 * cycles (earliest wake) to most cycles (latest wake). Sleep latency is added
 * before the first cycle begins.
 *
 * @param bedtime - The time the user gets into bed
 * @param sleepLatency - Minutes to fall asleep (default 15)
 * @param cycleDuration - Minutes per sleep cycle (default 90)
 * @returns Array of wake-up recommendations, sorted by fewest cycles first
 */
export function calculateWakeUpTimes(
  bedtime: Date,
  sleepLatency: number = DEFAULT_SLEEP_LATENCY,
  cycleDuration: number = DEFAULT_CYCLE_DURATION
): SleepRecommendation[] {
  const recommendations: SleepRecommendation[] = [];
  const sleepOnset = new Date(bedtime.getTime() + sleepLatency * 60_000);

  for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
    const totalSleepMinutes = cycles * cycleDuration;
    const wakeTime = new Date(sleepOnset.getTime() + totalSleepMinutes * 60_000);

    recommendations.push({
      time: wakeTime,
      cycles,
      totalSleepMinutes,
      quality: qualityForCycles(cycles),
    });
  }

  return recommendations;
}

/**
 * Calculate optimal wake-up times when going to sleep RIGHT NOW.
 *
 * Uses the current system time as the bedtime. Identical logic to
 * `calculateWakeUpTimes` but captures `new Date()` internally for convenience.
 *
 * @param sleepLatency - Minutes to fall asleep (default 15)
 * @param cycleDuration - Minutes per sleep cycle (default 90)
 * @returns Array of wake-up recommendations
 */
export function calculateSleepNow(
  sleepLatency: number = DEFAULT_SLEEP_LATENCY,
  cycleDuration: number = DEFAULT_CYCLE_DURATION
): SleepRecommendation[] {
  return calculateWakeUpTimes(new Date(), sleepLatency, cycleDuration);
}

/**
 * Generate idealized sleep phase distribution for a given number of cycles.
 *
 * Sleep architecture shifts across the night:
 * - Cycles 1-2: Heavy deep sleep (35-40%), moderate light (40-45%), low REM (15-20%)
 * - Cycles 3-4: Balanced distribution (25-30% deep, 40-45% light, 25-30% REM)
 * - Cycles 5-6: Minimal deep (10-15%), moderate light (45-50%), heavy REM (35-40%)
 *
 * Each cycle includes a brief awakening period (1-3 min) between cycles,
 * which is normal in healthy sleep.
 *
 * @param cycles - Number of complete sleep cycles (1-6)
 * @param cycleDuration - Minutes per sleep cycle (default 90)
 * @returns Array of sleep phases in chronological order
 */
export function getSleepPhases(
  cycles: number,
  cycleDuration: number = DEFAULT_CYCLE_DURATION
): SleepPhase[] {
  const clampedCycles = Math.max(1, Math.min(MAX_CYCLES, Math.round(cycles)));
  const phases: SleepPhase[] = [];
  let currentMinute = 0;

  for (let cycle = 1; cycle <= clampedCycles; cycle++) {
    let deepPercent: number;
    let lightPercent: number;
    let remPercent: number;
    const awakeMin = cycle < clampedCycles ? 2 : 0; // brief awakening between cycles

    if (cycle <= 2) {
      // Early night: deep sleep dominant
      deepPercent = cycle === 1 ? 0.40 : 0.35;
      remPercent = cycle === 1 ? 0.15 : 0.20;
      lightPercent = 1 - deepPercent - remPercent;
    } else if (cycle <= 4) {
      // Middle night: balanced
      deepPercent = cycle === 3 ? 0.25 : 0.15;
      remPercent = cycle === 3 ? 0.28 : 0.32;
      lightPercent = 1 - deepPercent - remPercent;
    } else {
      // Late night: REM dominant
      deepPercent = cycle === 5 ? 0.10 : 0.05;
      remPercent = cycle === 5 ? 0.38 : 0.42;
      lightPercent = 1 - deepPercent - remPercent;
    }

    const usableDuration = cycleDuration - awakeMin;
    const lightMin = Math.round(usableDuration * lightPercent);
    const deepMin = Math.round(usableDuration * deepPercent);
    const remMin = usableDuration - lightMin - deepMin; // absorb rounding

    // Sleep stage order within a cycle: light -> deep -> light -> REM
    const firstLightMin = Math.round(lightMin * 0.55);
    const secondLightMin = lightMin - firstLightMin;

    phases.push({
      stage: 'light',
      startMinute: currentMinute,
      durationMinutes: firstLightMin,
    });
    currentMinute += firstLightMin;

    phases.push({
      stage: 'deep',
      startMinute: currentMinute,
      durationMinutes: deepMin,
    });
    currentMinute += deepMin;

    phases.push({
      stage: 'light',
      startMinute: currentMinute,
      durationMinutes: secondLightMin,
    });
    currentMinute += secondLightMin;

    phases.push({
      stage: 'rem',
      startMinute: currentMinute,
      durationMinutes: remMin,
    });
    currentMinute += remMin;

    if (awakeMin > 0) {
      phases.push({
        stage: 'awake',
        startMinute: currentMinute,
        durationMinutes: awakeMin,
      });
      currentMinute += awakeMin;
    }
  }

  return phases;
}
