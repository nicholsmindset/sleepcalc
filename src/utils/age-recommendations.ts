/**
 * Age-based sleep recommendations from the National Sleep Foundation.
 *
 * Guidelines sourced from the NSF's 2015 expert panel recommendations,
 * which remain the gold standard for age-appropriate sleep duration.
 * Each age group includes minimum, maximum, and midpoint recommended
 * hours, plus nap guidance and clinical notes.
 *
 * All functions are pure — no side effects, no React imports.
 */

export interface AgeRecommendation {
  /** Human-readable age group name */
  ageGroup: string;
  /** Age range string for display (e.g., "4-11 months") */
  ageRange: string;
  /** Minimum recommended hours of sleep per 24-hour period */
  minHours: number;
  /** Maximum recommended hours of sleep per 24-hour period */
  maxHours: number;
  /** Midpoint recommended hours (used as default for calculators) */
  recommendedHours: number;
  /** Nap guidance for this age group */
  napRecommendation: string;
  /** Additional clinical notes and context */
  notes: string;
}

/** NSF (National Sleep Foundation) sleep duration guidelines by age group */
export const AGE_RECOMMENDATIONS: AgeRecommendation[] = [
  {
    ageGroup: 'Newborn',
    ageRange: '0-3 months',
    minHours: 14,
    maxHours: 17,
    recommendedHours: 15.5,
    napRecommendation: 'Multiple naps throughout the day; no fixed schedule yet.',
    notes:
      'Newborns sleep in 2-4 hour stretches around the clock. Circadian rhythm is not yet established. Sleep-wake cycles are driven by feeding needs.',
  },
  {
    ageGroup: 'Infant',
    ageRange: '4-11 months',
    minHours: 12,
    maxHours: 15,
    recommendedHours: 13.5,
    napRecommendation: '2-3 naps per day, typically 30 minutes to 2 hours each.',
    notes:
      'Circadian rhythm begins developing around 3-4 months. Most infants can sleep 6-8 hour stretches by 6 months. Sleep training may begin during this period.',
  },
  {
    ageGroup: 'Toddler',
    ageRange: '1-2 years',
    minHours: 11,
    maxHours: 14,
    recommendedHours: 12.5,
    napRecommendation: '1-2 naps per day; transition to a single afternoon nap by 18 months.',
    notes:
      'Separation anxiety and developmental milestones may temporarily disrupt sleep. A consistent bedtime routine becomes critical at this age.',
  },
  {
    ageGroup: 'Preschool',
    ageRange: '3-5 years',
    minHours: 10,
    maxHours: 13,
    recommendedHours: 11.5,
    napRecommendation: '0-1 naps per day; many children drop naps by age 5.',
    notes:
      'Nightmares and night terrors are common in this age group. Limit screen time before bed. Consistent sleep and wake times support cognitive development.',
  },
  {
    ageGroup: 'School Age',
    ageRange: '6-13 years',
    minHours: 9,
    maxHours: 11,
    recommendedHours: 10,
    napRecommendation: 'Naps generally not needed. If napping, limit to 30 minutes before 3 PM.',
    notes:
      'Adequate sleep is strongly linked to academic performance, emotional regulation, and physical growth. Electronics in the bedroom are a leading cause of insufficient sleep.',
  },
  {
    ageGroup: 'Teen',
    ageRange: '14-17 years',
    minHours: 8,
    maxHours: 10,
    recommendedHours: 9,
    napRecommendation: 'Short naps (20-30 min) after school can help with sleep debt from early school start times.',
    notes:
      'Biological circadian shift pushes teens toward later bedtimes and later wake times. Early school start times create chronic sleep deprivation. Social media use before bed significantly delays sleep onset.',
  },
  {
    ageGroup: 'Young Adult',
    ageRange: '18-25 years',
    minHours: 7,
    maxHours: 9,
    recommendedHours: 8,
    napRecommendation: 'Power naps (15-20 min) are beneficial. Avoid napping after 3 PM.',
    notes:
      'Irregular schedules (college, shift work) are common disruptors. Alcohol and caffeine significantly impact sleep quality even when total hours seem adequate.',
  },
  {
    ageGroup: 'Adult',
    ageRange: '26-64 years',
    minHours: 7,
    maxHours: 9,
    recommendedHours: 8,
    napRecommendation: 'Power naps (15-20 min) can offset moderate sleep debt. Avoid if you have insomnia.',
    notes:
      'Sleep quality often declines with age due to stress, medical conditions, and lifestyle factors. Deep sleep decreases naturally after age 35. Consistency is more important than total duration.',
  },
  {
    ageGroup: 'Older Adult',
    ageRange: '65+ years',
    minHours: 7,
    maxHours: 8,
    recommendedHours: 7.5,
    napRecommendation: 'Short daytime naps (20-30 min) are common and generally beneficial if nighttime sleep is adequate.',
    notes:
      'Sleep architecture changes significantly — less deep sleep, more frequent awakenings, and earlier circadian timing. Medical conditions, pain, and medications commonly affect sleep. Sleep needs do NOT decrease with age; the ability to sleep in consolidated blocks does.',
  },
];

/**
 * Look up the sleep recommendation for a specific age in years.
 *
 * Handles fractional ages for infants (e.g., 0.5 for a 6-month-old) by
 * converting months to the appropriate age group. For ages beyond the
 * defined ranges, returns the closest matching group.
 *
 * @param ageYears - Age in years (use decimals for infants, e.g., 0.25 = 3 months)
 * @returns The matching age recommendation with sleep hours and guidance
 */
export function getRecommendationForAge(ageYears: number): AgeRecommendation {
  const age = Math.max(0, ageYears);

  if (age < 0.25) {
    // 0-3 months
    return AGE_RECOMMENDATIONS[0];
  }
  if (age < 1) {
    // 4-11 months
    return AGE_RECOMMENDATIONS[1];
  }
  if (age < 3) {
    // 1-2 years
    return AGE_RECOMMENDATIONS[2];
  }
  if (age < 6) {
    // 3-5 years
    return AGE_RECOMMENDATIONS[3];
  }
  if (age < 14) {
    // 6-13 years
    return AGE_RECOMMENDATIONS[4];
  }
  if (age < 18) {
    // 14-17 years
    return AGE_RECOMMENDATIONS[5];
  }
  if (age < 26) {
    // 18-25 years
    return AGE_RECOMMENDATIONS[6];
  }
  if (age < 65) {
    // 26-64 years
    return AGE_RECOMMENDATIONS[7];
  }
  // 65+ years
  return AGE_RECOMMENDATIONS[8];
}
