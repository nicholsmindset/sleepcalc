/**
 * Moon Phase Calculator
 *
 * Computes the lunar phase for any given date using the known
 * New Moon epoch of January 6, 2000 at 18:14 UTC and the mean
 * synodic period of 29.53058770576 days.
 *
 * All functions are pure — no side effects, no React imports.
 *
 * References:
 * - Meeus, J. (1991). Astronomical Algorithms (2nd ed.). Willmann-Bell.
 * - Kohler, C. et al. (2013). "Evidence that the Lunar Cycle Influences
 *   Human Sleep." Current Biology, 23(15), 1485–1488.
 */

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

/** Mean synodic period in days */
const SYNODIC_PERIOD = 29.53058770576;

/** Known new moon epoch: January 6, 2000 18:14 UTC (ms) */
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14, 0);

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface MoonPhase {
  /** Current age of the moon in days (0 = new moon, ~14.77 = full moon) */
  age: number;
  /** Illumination percentage 0–100 */
  illumination: number;
  /** Phase name */
  name: MoonPhaseName;
  /** Single emoji representing the phase */
  emoji: string;
  /** Next full moon date */
  nextFull: Date;
  /** Next new moon date */
  nextNew: Date;
  /** Waxing or waning */
  direction: 'waxing' | 'waning';
}

export type MoonPhaseName =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface DayMoonInfo {
  date: Date;
  age: number;
  illumination: number;
  name: MoonPhaseName;
  emoji: string;
}

/* -------------------------------------------------------------------------- */
/*  Core Calculation                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Calculate the moon's age (days since last new moon) for a given date.
 * Returns a value in [0, SYNODIC_PERIOD).
 */
export function getMoonAge(date: Date): number {
  const elapsed = date.getTime() - KNOWN_NEW_MOON_MS;
  const days = elapsed / (1000 * 60 * 60 * 24);
  const age = ((days % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;
  return age;
}

/**
 * Compute illumination percentage from moon age.
 * Uses a cosine model: 0% at new moon, 100% at full moon.
 */
export function getIllumination(age: number): number {
  const illumination = (1 - Math.cos((age / SYNODIC_PERIOD) * 2 * Math.PI)) / 2;
  return Math.round(illumination * 100);
}

/**
 * Determine phase name and emoji from moon age.
 */
export function getPhaseName(age: number): { name: MoonPhaseName; emoji: string } {
  const half = SYNODIC_PERIOD / 2;
  const quarter = SYNODIC_PERIOD / 4;
  const threeQ = (SYNODIC_PERIOD * 3) / 4;

  // Tolerance bands around exact phase transitions (±0.75 days)
  const T = 0.75;

  if (age < T || age >= SYNODIC_PERIOD - T) return { name: 'New Moon', emoji: '🌑' };
  if (Math.abs(age - quarter) < T) return { name: 'First Quarter', emoji: '🌓' };
  if (Math.abs(age - half) < T) return { name: 'Full Moon', emoji: '🌕' };
  if (Math.abs(age - threeQ) < T) return { name: 'Last Quarter', emoji: '🌗' };

  if (age < quarter) return { name: 'Waxing Crescent', emoji: '🌒' };
  if (age < half) return { name: 'Waxing Gibbous', emoji: '🌔' };
  if (age < threeQ) return { name: 'Waning Gibbous', emoji: '🌖' };
  return { name: 'Waning Crescent', emoji: '🌘' };
}

/**
 * Calculate the next occurrence of a given phase age from a starting date.
 * @param fromDate - Starting date
 * @param targetAge - Target moon age in days (0 = new moon, ~14.77 = full moon)
 */
function nextPhaseDate(fromDate: Date, targetAge: number): Date {
  const currentAge = getMoonAge(fromDate);
  let daysUntil = targetAge - currentAge;
  if (daysUntil <= 0.5) daysUntil += SYNODIC_PERIOD;
  const ms = fromDate.getTime() + daysUntil * 24 * 60 * 60 * 1000;
  return new Date(ms);
}

/**
 * Get complete moon phase information for a given date.
 */
export function getMoonPhase(date: Date): MoonPhase {
  const age = getMoonAge(date);
  const illumination = getIllumination(age);
  const { name, emoji } = getPhaseName(age);
  const direction = age <= SYNODIC_PERIOD / 2 ? 'waxing' : 'waning';
  const nextFull = nextPhaseDate(date, SYNODIC_PERIOD / 2);
  const nextNew = nextPhaseDate(date, 0);

  return { age, illumination, name, emoji, nextFull, nextNew, direction };
}

/* -------------------------------------------------------------------------- */
/*  Monthly Calendar                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Return moon info for every day in a given month.
 * @param year - Full year (e.g. 2026)
 * @param month - 0-indexed month (0 = January)
 */
export function getMonthMoonCalendar(year: number, month: number): DayMoonInfo[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: DayMoonInfo[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d, 12, 0, 0); // noon local time
    const age = getMoonAge(date);
    const illumination = getIllumination(age);
    const { name, emoji } = getPhaseName(age);
    result.push({ date, age, illumination, name, emoji });
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*  Sleep Impact                                                              */
/* -------------------------------------------------------------------------- */

export interface MoonSleepImpact {
  /** Short headline */
  headline: string;
  /** 1–2 sentence description */
  description: string;
  /** Recommended adjustment */
  tip: string;
}

/**
 * Return evidence-informed sleep impact guidance based on moon phase.
 * Based on the Basel 2013 and UW 2021 studies.
 */
export function getMoonSleepImpact(phase: MoonPhase): MoonSleepImpact {
  const { name, illumination } = phase;

  if (name === 'Full Moon') {
    return {
      headline: 'Potential sleep disruption peak',
      description:
        'The Basel 2013 study (Current Biology) found people took 5 minutes longer to fall asleep and slept 20 minutes less around the full moon, with a 30% reduction in deep-sleep time.',
      tip: 'Consider blackout curtains, a slightly earlier bedtime, and avoiding stimulants after noon tonight.',
    };
  }
  if (name === 'New Moon') {
    return {
      headline: 'Optimal sleep window',
      description:
        'Research suggests sleep onset is fastest and slow-wave (deep) sleep is longest around the new moon phase, when moonlight is absent.',
      tip: 'Your circadian rhythm is well-positioned. Maintain your usual sleep schedule to maximise deep sleep tonight.',
    };
  }
  if (name === 'Waxing Gibbous' || name === 'Waning Gibbous') {
    return {
      headline: 'Moderate light exposure',
      description: `With ${illumination}% illumination, moonlight may be noticeable on clear nights. Most people are unaffected, but light-sensitive sleepers may notice slightly reduced deep sleep.`,
      tip: 'If you sleep with open blinds, consider closing them or using a sleep mask.',
    };
  }
  if (name === 'First Quarter' || name === 'Last Quarter') {
    return {
      headline: 'Neutral sleep phase',
      description:
        'Quarter phases show no consistent sleep disruption in the literature. Half illumination represents the transition midpoint between new and full moon effects.',
      tip: 'No special adjustments needed. Focus on your usual sleep hygiene tonight.',
    };
  }
  // Crescent phases
  return {
    headline: 'Low lunar influence',
    description:
      `At ${illumination}% illumination, moonlight has minimal impact on most sleepers. Crescent phases are among the quietest in the lunar cycle for sleep.`,
    tip: 'Enjoy the naturally low-light conditions. Prioritise your standard sleep schedule.',
  };
}
