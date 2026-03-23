/**
 * Chronotype quiz scoring engine.
 *
 * Inspired by the Horne-Ostberg Morningness-Eveningness Questionnaire and
 * Dr. Michael Breus's "The Power of When" animal chronotypes. The quiz
 * assesses circadian rhythm preferences through 10 questions about sleep
 * timing, energy patterns, and lifestyle habits.
 *
 * Chronotypes:
 * - Lion (40-50): Early riser, peak morning energy, 15% of population
 * - Bear (25-39): Solar schedule, midday peak, 55% of population
 * - Wolf (10-24): Night owl, evening peak, 15% of population
 * - Dolphin (special): Light/irregular sleeper, variable peaks, 10% of population
 *
 * All functions are pure — no side effects, no React imports.
 */

export type Chronotype = 'lion' | 'bear' | 'wolf' | 'dolphin';

export interface ChronotypeQuestion {
  /** Question identifier (1-10) */
  id: number;
  /** The question text */
  text: string;
  /** Available answer options with their score values */
  options: { label: string; score: number }[];
}

export interface ChronotypeResult {
  /** The determined chronotype animal */
  type: Chronotype;
  /** Human-readable label */
  label: string;
  /** Multi-sentence description of this chronotype */
  description: string;
  /** Recommended sleep window */
  sleepWindow: { bedtime: string; wakeTime: string };
  /** When this chronotype is at peak cognitive performance */
  peakProductivity: string;
  /** Key personality and behavioral traits */
  traits: string[];
  /** Approximate percentage of the general population */
  percentage: number;
}

/**
 * 10 questions assessing circadian rhythm preferences.
 *
 * Scoring: higher scores indicate morning preference (Lion), lower scores
 * indicate evening preference (Wolf), and specific answer patterns on
 * consistency-related questions (3, 7, 10) flag Dolphin chronotype.
 */
export const CHRONOTYPE_QUESTIONS: ChronotypeQuestion[] = [
  {
    id: 1,
    text: 'If you had no obligations tomorrow, what time would you naturally wake up?',
    options: [
      { label: 'Before 6:30 AM', score: 5 },
      { label: '6:30 AM - 7:30 AM', score: 4 },
      { label: '7:30 AM - 9:00 AM', score: 3 },
      { label: '9:00 AM - 11:00 AM', score: 2 },
      { label: 'After 11:00 AM', score: 1 },
    ],
  },
  {
    id: 2,
    text: 'How easy is it for you to wake up in the morning without an alarm?',
    options: [
      { label: 'Very easy — I wake up before it goes off', score: 5 },
      { label: 'Fairly easy — one alarm does the trick', score: 4 },
      { label: 'Moderate — I need one snooze', score: 3 },
      { label: 'Difficult — multiple alarms required', score: 2 },
      { label: 'Extremely difficult — I could sleep through anything', score: 1 },
    ],
  },
  {
    id: 3,
    text: 'How would you describe your sleep quality?',
    options: [
      { label: 'Deep sleeper — nothing wakes me', score: 5 },
      { label: 'Generally good — occasional disruptions', score: 4 },
      { label: 'Average — I wake once or twice', score: 3 },
      { label: 'Light sleeper — I wake often', score: 1 },
      { label: 'Very restless — I rarely feel fully rested', score: 0 },
    ],
  },
  {
    id: 4,
    text: 'When do you feel most mentally sharp and productive?',
    options: [
      { label: 'Early morning (6 AM - 9 AM)', score: 5 },
      { label: 'Late morning (9 AM - 12 PM)', score: 4 },
      { label: 'Early afternoon (12 PM - 3 PM)', score: 3 },
      { label: 'Late afternoon / evening (3 PM - 8 PM)', score: 2 },
      { label: 'Night (after 8 PM)', score: 1 },
    ],
  },
  {
    id: 5,
    text: 'If you could choose, what time would you prefer to exercise?',
    options: [
      { label: 'Before 7 AM', score: 5 },
      { label: '7 AM - 10 AM', score: 4 },
      { label: '10 AM - 2 PM', score: 3 },
      { label: '2 PM - 6 PM', score: 2 },
      { label: 'After 6 PM', score: 1 },
    ],
  },
  {
    id: 6,
    text: 'How alert do you feel during the first 30 minutes after waking?',
    options: [
      { label: 'Fully alert and energized', score: 5 },
      { label: 'Pretty alert after a few minutes', score: 4 },
      { label: 'Groggy but functional', score: 3 },
      { label: 'Very groggy — need coffee immediately', score: 2 },
      { label: 'Zombie mode for at least an hour', score: 1 },
    ],
  },
  {
    id: 7,
    text: 'How consistent is your sleep schedule on weekdays vs. weekends?',
    options: [
      { label: 'Very consistent — same time every day', score: 5 },
      { label: 'Mostly consistent — 30 min difference', score: 4 },
      { label: 'Moderate — 1-2 hour difference', score: 3 },
      { label: 'Irregular — 2+ hour difference', score: 1 },
      { label: 'No pattern — completely unpredictable', score: 0 },
    ],
  },
  {
    id: 8,
    text: 'What time do you naturally start feeling sleepy in the evening?',
    options: [
      { label: 'Before 9 PM', score: 5 },
      { label: '9 PM - 10 PM', score: 4 },
      { label: '10 PM - 11:30 PM', score: 3 },
      { label: '11:30 PM - 1 AM', score: 2 },
      { label: 'After 1 AM', score: 1 },
    ],
  },
  {
    id: 9,
    text: 'If you had an important exam or presentation, what time slot would you choose?',
    options: [
      { label: '8 AM - 10 AM', score: 5 },
      { label: '10 AM - 12 PM', score: 4 },
      { label: '12 PM - 3 PM', score: 3 },
      { label: '3 PM - 6 PM', score: 2 },
      { label: 'After 6 PM', score: 1 },
    ],
  },
  {
    id: 10,
    text: 'How often do you have trouble falling asleep or staying asleep?',
    options: [
      { label: 'Almost never', score: 5 },
      { label: 'Rarely (once a month)', score: 4 },
      { label: 'Sometimes (once a week)', score: 3 },
      { label: 'Often (several times a week)', score: 1 },
      { label: 'Almost every night', score: 0 },
    ],
  },
];

/** Dolphin-indicator question IDs (sleep quality, consistency, insomnia) */
const DOLPHIN_QUESTION_IDS = [3, 7, 10];

/** Threshold: if the average score on dolphin questions is at or below this, flag dolphin */
const DOLPHIN_AVG_THRESHOLD = 1.5;

/** Chronotype profile data */
const CHRONOTYPE_PROFILES: Record<Chronotype, Omit<ChronotypeResult, 'type'>> = {
  lion: {
    label: 'Lion',
    description:
      'Lions are the early risers of the animal kingdom. You thrive in the morning hours, waking naturally before dawn with a burst of energy. Your most productive and creative window is the first half of the day. Lions tend to be ambitious, optimistic, and health-conscious. By evening, your energy drops sharply — making early bedtimes feel natural, not forced.',
    sleepWindow: { bedtime: '10:00 PM', wakeTime: '6:00 AM' },
    peakProductivity: '8:00 AM - 12:00 PM',
    traits: [
      'Naturally early riser',
      'Peak energy before noon',
      'Practical and optimistic',
      'Health and fitness oriented',
      'Lower energy after 4 PM',
    ],
    percentage: 15,
  },
  bear: {
    label: 'Bear',
    description:
      'Bears follow a solar schedule — your energy rises and falls with the sun. As the most common chronotype, you adapt well to conventional work hours. Your productivity peaks mid-morning through early afternoon. Bears are team players who value social connection and tend to sleep deeply. You function best with 8 full hours of sleep and a consistent routine.',
    sleepWindow: { bedtime: '11:00 PM', wakeTime: '7:00 AM' },
    peakProductivity: '10:00 AM - 2:00 PM',
    traits: [
      'Follows a solar schedule',
      'Solid and deep sleeper',
      'Social and team-oriented',
      'Adaptable to standard hours',
      'Consistent energy through midday',
    ],
    percentage: 55,
  },
  wolf: {
    label: 'Wolf',
    description:
      'Wolves come alive when the rest of the world is winding down. Your most creative and productive hours start in the late afternoon and extend well past midnight. Mornings feel painful, and traditional 9-to-5 schedules work against your biology. Wolves tend to be creative, risk-taking, and introspective. Embrace your natural rhythm — night owls are wired, not lazy.',
    sleepWindow: { bedtime: '12:00 AM', wakeTime: '7:30 AM' },
    peakProductivity: '5:00 PM - 9:00 PM',
    traits: [
      'Night owl by biology',
      'Creative and introspective',
      'Peak performance in evening',
      'Struggles with early mornings',
      'Risk-taker and independent thinker',
    ],
    percentage: 15,
  },
  dolphin: {
    label: 'Dolphin',
    description:
      'Dolphins are the light sleepers and insomniacs of the chronotype world. Like the marine mammal that sleeps with half its brain active, you rarely achieve deep, uninterrupted sleep. Your energy and focus arrive in unpredictable waves, with a general peak in mid-to-late morning. Dolphins tend to be highly intelligent, detail-oriented, and prone to anxiety. Establishing a rigid sleep routine is especially important for you.',
    sleepWindow: { bedtime: '11:30 PM', wakeTime: '6:30 AM' },
    peakProductivity: '10:00 AM - 12:00 PM (variable)',
    traits: [
      'Light and irregular sleeper',
      'Highly intelligent and detail-oriented',
      'Prone to anxiety and rumination',
      'Unpredictable energy patterns',
      'Benefits most from strict sleep hygiene',
    ],
    percentage: 10,
  },
};

/**
 * Score chronotype quiz answers and return the matching chronotype profile.
 *
 * Scoring algorithm:
 * 1. Check for Dolphin pattern first — if questions about sleep quality,
 *    schedule consistency, and insomnia average <= 1.5, the user has
 *    Dolphin-pattern irregular sleep regardless of total score.
 * 2. Otherwise, sum all answer scores and classify:
 *    - 40-50: Lion (strong morning preference)
 *    - 25-39: Bear (middle/solar preference)
 *    - 10-24: Wolf (strong evening preference)
 *
 * @param answers - Map of question ID to the score of the selected option
 * @returns Complete chronotype profile with sleep window and recommendations
 */
export function scoreChronotype(answers: Record<number, number>): ChronotypeResult {
  // Step 1: Check for Dolphin pattern on sleep-quality/consistency questions
  const dolphinScores = DOLPHIN_QUESTION_IDS
    .filter((id) => answers[id] !== undefined)
    .map((id) => answers[id]);

  if (dolphinScores.length === DOLPHIN_QUESTION_IDS.length) {
    const dolphinAvg = dolphinScores.reduce((a, b) => a + b, 0) / dolphinScores.length;
    if (dolphinAvg <= DOLPHIN_AVG_THRESHOLD) {
      return { type: 'dolphin', ...CHRONOTYPE_PROFILES.dolphin };
    }
  }

  // Step 2: Sum total score across all questions
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

  // Step 3: Classify by score range
  let type: Chronotype;
  if (totalScore >= 40) {
    type = 'lion';
  } else if (totalScore >= 25) {
    type = 'bear';
  } else {
    type = 'wolf';
  }

  return { type, ...CHRONOTYPE_PROFILES[type] };
}
