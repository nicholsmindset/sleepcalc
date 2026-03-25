/**
 * Sleep Score Calculator
 *
 * Computes a 0–100 sleep quality score across four weighted domains:
 *   - Duration  (0–30 pts): Was total sleep time in the optimal range?
 *   - Efficiency (0–25 pts): Sleep onset speed + continuity (wake-ups).
 *   - Quality    (0–25 pts): Subjective restedness + perceived sleep depth.
 *   - Hygiene    (0–20 pts): Screen use, caffeine timing, schedule consistency.
 *
 * All functions are pure — no React, no side-effects.
 */

/* -------------------------------------------------------------------------- */
/*  Input / Output Types                                                      */
/* -------------------------------------------------------------------------- */

/** Raw answers from the 8-question quiz */
export interface SleepScoreInputs {
  /** Q1: Hours of sleep (numeric, e.g. 7.5) */
  hoursSlept: number;
  /** Q2: Minutes to fall asleep */
  sleepOnsetMinutes: number;
  /** Q3: Number of wake-ups during the night */
  wakeUps: number;
  /** Q4: Subjective restedness on waking (1–5 scale, 5 = very rested) */
  restedFeeling: number;
  /** Q5: Perceived sleep depth (1–5 scale, 5 = very deep) */
  sleepDepth: number;
  /** Q6: Screen use in the hour before bed (minutes) */
  screenMinutes: number;
  /** Q7: Did they have caffeine after 2 PM? */
  caffeineAfter2pm: boolean;
  /** Q8: Bedtime consistency — was tonight within 30 min of their normal time? */
  consistentBedtime: boolean;
}

export interface SleepScoreResult {
  /** Overall score 0–100 */
  total: number;
  /** Duration sub-score 0–30 */
  duration: number;
  /** Efficiency sub-score 0–25 */
  efficiency: number;
  /** Quality sub-score 0–25 */
  quality: number;
  /** Hygiene sub-score 0–20 */
  hygiene: number;
  /** Letter grade */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Short label for the grade */
  label: string;
  /** Three personalised improvement tips derived from lowest-scoring domains */
  tips: string[];
  /** Estimated sleep stage breakdown as percentages */
  stageEstimates: {
    light: number;
    deep: number;
    rem: number;
    awake: number;
  };
}

/* -------------------------------------------------------------------------- */
/*  Sub-score Calculators                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Duration score (0–30).
 * Optimal range is 7–9 hours for adults. Both under and over sleeping penalise.
 */
function scoreDuration(hours: number): number {
  if (hours >= 7 && hours <= 9) {
    // Perfect band — interpolate to peak at 8h
    const distFrom8 = Math.abs(hours - 8);
    return Math.round(30 - distFrom8 * 2); // 8h → 30, 7h or 9h → 28
  }
  if (hours >= 6 && hours < 7) return Math.round(18 + (hours - 6) * 6); // 18–24
  if (hours > 9 && hours <= 10) return Math.round(22 - (hours - 9) * 8); // 22–14
  if (hours >= 5 && hours < 6) return Math.round(8 + (hours - 5) * 10);  // 8–18
  if (hours > 10) return Math.max(0, Math.round(14 - (hours - 10) * 7));
  if (hours >= 4 && hours < 5) return 5;
  return 0;
}

/**
 * Efficiency score (0–25).
 * Onset latency (0–10) + continuity / wake-ups (0–15).
 */
function scoreEfficiency(onsetMinutes: number, wakeUps: number): number {
  // Onset latency (0–10 pts)
  let onsetScore: number;
  if (onsetMinutes <= 10) onsetScore = 10;
  else if (onsetMinutes <= 20) onsetScore = 8;
  else if (onsetMinutes <= 30) onsetScore = 6;
  else if (onsetMinutes <= 45) onsetScore = 3;
  else if (onsetMinutes <= 60) onsetScore = 1;
  else onsetScore = 0;

  // Continuity (0–15 pts)
  let continuityScore: number;
  if (wakeUps === 0) continuityScore = 15;
  else if (wakeUps === 1) continuityScore = 12;
  else if (wakeUps === 2) continuityScore = 9;
  else if (wakeUps === 3) continuityScore = 6;
  else if (wakeUps <= 5) continuityScore = 3;
  else continuityScore = 0;

  return onsetScore + continuityScore;
}

/**
 * Quality score (0–25).
 * Restedness (0–15) + perceived depth (0–10).
 */
function scoreQuality(rested: number, depth: number): number {
  // rested 1–5 → 0, 4, 8, 12, 15
  const restedMap = [0, 0, 4, 8, 12, 15];
  const restScore = restedMap[Math.round(rested)] ?? 0;

  // depth 1–5 → 0, 2, 5, 7, 10
  const depthMap = [0, 0, 2, 5, 7, 10];
  const depthScore = depthMap[Math.round(depth)] ?? 0;

  return restScore + depthScore;
}

/**
 * Hygiene score (0–20).
 * Screen use (0–8) + caffeine timing (0–6) + schedule consistency (0–6).
 */
function scoreHygiene(
  screenMinutes: number,
  caffeineAfter2pm: boolean,
  consistentBedtime: boolean,
): number {
  // Screen use in hour before bed (0–8 pts)
  let screenScore: number;
  if (screenMinutes === 0) screenScore = 8;
  else if (screenMinutes <= 15) screenScore = 6;
  else if (screenMinutes <= 30) screenScore = 4;
  else if (screenMinutes <= 60) screenScore = 2;
  else screenScore = 0;

  const caffeineScore = caffeineAfter2pm ? 0 : 6;
  const consistencyScore = consistentBedtime ? 6 : 0;

  return screenScore + caffeineScore + consistencyScore;
}

/* -------------------------------------------------------------------------- */
/*  Stage Estimates                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Rough stage estimates based on score and inputs.
 * Not medically precise — educational approximation only.
 */
function estimateStages(
  inputs: SleepScoreInputs,
  total: number,
): SleepScoreResult['stageEstimates'] {
  // Base distribution for a healthy adult
  let light = 52;
  let deep = 20;
  let rem = 22;
  let awake = 6;

  // Low duration → less deep sleep
  if (inputs.hoursSlept < 6) { deep -= 6; light += 4; awake += 2; }
  // Many wake-ups → more awake time
  awake += Math.min(inputs.wakeUps * 2, 12);
  light -= Math.min(inputs.wakeUps * 1, 6);
  // Low depth score → less deep sleep
  if (inputs.sleepDepth <= 2) { deep -= 8; light += 5; rem -= 3; awake += 6; }
  // Screen / caffeine hurt deep sleep
  if (inputs.caffeineAfter2pm) { deep -= 4; rem -= 3; light += 7; }
  if (inputs.screenMinutes > 30) { rem -= 3; light += 3; }
  // High onset → more awake
  if (inputs.sleepOnsetMinutes > 30) { awake += 3; light -= 3; }

  // Normalise so total = 100
  const sum = light + deep + rem + awake;
  const factor = 100 / sum;
  return {
    light: Math.round(light * factor),
    deep: Math.round(deep * factor),
    rem: Math.round(rem * factor),
    awake: Math.max(0, 100 - Math.round(light * factor) - Math.round(deep * factor) - Math.round(rem * factor)),
  };
}

/* -------------------------------------------------------------------------- */
/*  Grade + Tips                                                               */
/* -------------------------------------------------------------------------- */

function getGrade(total: number): SleepScoreResult['grade'] {
  if (total >= 85) return 'A';
  if (total >= 70) return 'B';
  if (total >= 55) return 'C';
  if (total >= 40) return 'D';
  return 'F';
}

function getLabel(grade: SleepScoreResult['grade']): string {
  const labels: Record<SleepScoreResult['grade'], string> = {
    A: 'Excellent',
    B: 'Good',
    C: 'Fair',
    D: 'Poor',
    F: 'Very Poor',
  };
  return labels[grade];
}

const DURATION_TIPS = [
  'Aim for 7–9 hours of sleep each night — chronic under-sleeping accumulates as sleep debt.',
  'If you frequently sleep under 6 hours, try shifting your bedtime 30 minutes earlier each week.',
  'Sleeping more than 9 hours regularly can signal underlying fatigue or depression — consider consulting a doctor.',
];

const EFFICIENCY_TIPS = [
  'If it takes more than 20 minutes to fall asleep, get out of bed and do a quiet activity until sleepy.',
  'Reserve your bed only for sleep — avoid watching TV or scrolling in bed so your brain associates it with rest.',
  'Frequent night-waking can be reduced by limiting fluids 2 hours before bed and keeping the room cool (65–68°F).',
];

const QUALITY_TIPS = [
  'Feeling unrefreshed despite enough hours often points to sleep apnea — a sleep study can diagnose it quickly.',
  'Regular moderate exercise (150+ min/week) significantly increases deep-sleep time.',
  'Avoid alcohol — it fragments sleep architecture and suppresses REM, leaving you groggy even after 8 hours.',
];

const HYGIENE_TIPS = [
  'Blue light from screens suppresses melatonin for up to 2 hours — switch devices to Night Mode after sunset.',
  'Caffeine has a half-life of 5–7 hours, so a 3 PM coffee still leaves half its caffeine in your system at 10 PM.',
  'A consistent bedtime and wake time — even on weekends — anchors your circadian clock and improves every sleep metric.',
];

function getTips(
  duration: number,
  efficiency: number,
  quality: number,
  hygiene: number,
): string[] {
  // Sort domains from worst to best and pick tips from the three weakest
  const domains: [number, string[]][] = [
    [duration / 30, DURATION_TIPS],
    [efficiency / 25, EFFICIENCY_TIPS],
    [quality / 25, QUALITY_TIPS],
    [hygiene / 20, HYGIENE_TIPS],
  ];
  domains.sort((a, b) => a[0] - b[0]);

  const tips: string[] = [];
  for (const [, tipPool] of domains.slice(0, 3)) {
    tips.push(tipPool[Math.floor(Math.random() * tipPool.length)]);
  }
  return tips;
}

/* -------------------------------------------------------------------------- */
/*  Main Export                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Calculate a comprehensive sleep score from 8 survey inputs.
 *
 * @param inputs - Answers from the sleep quality questionnaire
 * @returns Scored result with sub-scores, grade, tips, and stage estimates
 */
export function calculateSleepScore(inputs: SleepScoreInputs): SleepScoreResult {
  const duration = Math.min(30, Math.max(0, scoreDuration(inputs.hoursSlept)));
  const efficiency = Math.min(25, Math.max(0, scoreEfficiency(inputs.sleepOnsetMinutes, inputs.wakeUps)));
  const quality = Math.min(25, Math.max(0, scoreQuality(inputs.restedFeeling, inputs.sleepDepth)));
  const hygiene = Math.min(20, Math.max(0, scoreHygiene(inputs.screenMinutes, inputs.caffeineAfter2pm, inputs.consistentBedtime)));

  const total = duration + efficiency + quality + hygiene;
  const grade = getGrade(total);
  const label = getLabel(grade);
  const tips = getTips(duration, efficiency, quality, hygiene);
  const stageEstimates = estimateStages(inputs, total);

  return { total, duration, efficiency, quality, hygiene, grade, label, tips, stageEstimates };
}

/* -------------------------------------------------------------------------- */
/*  Question Definitions                                                      */
/* -------------------------------------------------------------------------- */

export interface SleepScoreQuestion {
  id: keyof SleepScoreInputs;
  text: string;
  type: 'select' | 'scale';
  options?: { label: string; value: number | boolean }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const SLEEP_SCORE_QUESTIONS: SleepScoreQuestion[] = [
  {
    id: 'hoursSlept',
    text: 'How many hours did you sleep last night?',
    type: 'select',
    options: [
      { label: 'Less than 4 hours', value: 3.5 },
      { label: '4 – 5 hours', value: 4.5 },
      { label: '5 – 6 hours', value: 5.5 },
      { label: '6 – 7 hours', value: 6.5 },
      { label: '7 – 8 hours', value: 7.5 },
      { label: '8 – 9 hours', value: 8.5 },
      { label: 'More than 9 hours', value: 9.5 },
    ],
  },
  {
    id: 'sleepOnsetMinutes',
    text: 'About how long did it take you to fall asleep?',
    type: 'select',
    options: [
      { label: 'Under 5 minutes', value: 3 },
      { label: '5 – 15 minutes', value: 10 },
      { label: '15 – 30 minutes', value: 22 },
      { label: '30 – 45 minutes', value: 37 },
      { label: '45 – 60 minutes', value: 52 },
      { label: 'More than an hour', value: 75 },
    ],
  },
  {
    id: 'wakeUps',
    text: 'How many times did you wake up during the night?',
    type: 'select',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Once', value: 1 },
      { label: 'Twice', value: 2 },
      { label: '3 times', value: 3 },
      { label: '4 – 5 times', value: 4 },
      { label: 'More than 5 times', value: 6 },
    ],
  },
  {
    id: 'restedFeeling',
    text: 'How rested do you feel this morning?',
    type: 'select',
    options: [
      { label: 'Exhausted — barely functional', value: 1 },
      { label: 'Tired — still feel sleep-deprived', value: 2 },
      { label: 'Okay — neutral, neither rested nor tired', value: 3 },
      { label: 'Rested — feel pretty good', value: 4 },
      { label: 'Very rested — energized and alert', value: 5 },
    ],
  },
  {
    id: 'sleepDepth',
    text: 'How deep was your sleep?',
    type: 'select',
    options: [
      { label: 'Very light — woke at every noise', value: 1 },
      { label: 'Mostly light — fragmented', value: 2 },
      { label: 'Mixed — some deep, some light', value: 3 },
      { label: 'Mostly deep — few interruptions', value: 4 },
      { label: 'Very deep — slept like a rock', value: 5 },
    ],
  },
  {
    id: 'screenMinutes',
    text: 'How much time did you spend on screens (phone, TV, computer) in the hour before bed?',
    type: 'select',
    options: [
      { label: 'None — screens off before bed', value: 0 },
      { label: 'Under 15 minutes', value: 10 },
      { label: '15 – 30 minutes', value: 22 },
      { label: '30 – 60 minutes', value: 45 },
      { label: 'More than an hour', value: 75 },
    ],
  },
  {
    id: 'caffeineAfter2pm',
    text: 'Did you have any caffeine (coffee, tea, energy drink, soda) after 2 PM?',
    type: 'select',
    options: [
      { label: 'No — caffeine-free after 2 PM', value: false },
      { label: 'Yes — had caffeine after 2 PM', value: true },
    ],
  },
  {
    id: 'consistentBedtime',
    text: 'Was last night\'s bedtime within 30 minutes of your usual time?',
    type: 'select',
    options: [
      { label: 'Yes — consistent with my normal schedule', value: true },
      { label: 'No — went to bed significantly earlier or later', value: false },
    ],
  },
];
