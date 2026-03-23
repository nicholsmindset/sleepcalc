/**
 * Programmatic SEO Data Generator
 *
 * Generates all three JSON data files used by programmatic SEO pages:
 *   - src/content/data/sleep-times.json  (26 entries: 13 wake + 13 bed)
 *   - src/content/data/age-recs.json     (9 age-group entries)
 *   - src/content/data/professions.json  (20 profession entries)
 *
 * Run with:  npx tsx scripts/generate-programmatic.ts
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// Constants (mirroring src/utils/sleep-cycle.ts)
// ---------------------------------------------------------------------------
const CYCLE_DURATION = 90;
const SLEEP_LATENCY = 15;
const MIN_CYCLES = 3;
const MAX_CYCLES = 6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function qualityForCycles(cycles: number): 'optimal' | 'good' | 'minimum' {
  if (cycles >= 5) return 'optimal';
  if (cycles === 4) return 'good';
  return 'minimum';
}

/** Format minutes-since-midnight to "h:mm AM/PM" */
function formatTime(totalMinutes: number): string {
  // Normalise to 0..1439
  let m = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(m / 60);
  const mins = m % 60;
  const period = hours24 < 12 ? 'AM' : 'PM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
}

function totalSleepLabel(cycles: number): string {
  const total = cycles * CYCLE_DURATION;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${m}m`;
}

function writeJSON(relPath: string, data: unknown): void {
  const abs = resolve(__dirname, '..', relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`  wrote ${relPath} (${Array.isArray(data) ? data.length : '?'} entries)`);
}

// ---------------------------------------------------------------------------
// 1. Sleep Times (wake-up + bedtime pages)
// ---------------------------------------------------------------------------

interface PreCalc {
  cycles: number;
  bedtime?: string;
  wakeTime?: string;
  totalSleep: string;
  quality: 'optimal' | 'good' | 'minimum';
}

interface SleepTimeEntry {
  slug: string;
  type: 'wake' | 'bed';
  time: string;
  hour24: number;
  minute: number;
  title: string;
  h1: string;
  metaDescription: string;
  preCalculated: PreCalc[];
  content: { intro: string; whyThisTime: string; tips: string; science: string };
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

function buildWakeSlug(h: number, m: number): string {
  const period = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 || 12;
  return m === 0
    ? `wake-up-at-${h12}-${period}`
    : `wake-up-at-${h12}-${m}-${period}`;
}

function buildBedSlug(h: number, m: number): string {
  const period = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 || 12;
  return m === 0
    ? `go-to-bed-at-${h12}-${period}`
    : `go-to-bed-at-${h12}-${m}-${period}`;
}

function calcBedtimesForWake(wakeMinutes: number): PreCalc[] {
  const results: PreCalc[] = [];
  for (let c = MAX_CYCLES; c >= MIN_CYCLES; c--) {
    const bedMin = wakeMinutes - (c * CYCLE_DURATION + SLEEP_LATENCY);
    results.push({
      cycles: c,
      bedtime: formatTime(bedMin),
      totalSleep: totalSleepLabel(c),
      quality: qualityForCycles(c),
    });
  }
  return results;
}

function calcWakeTimesForBed(bedMinutes: number): PreCalc[] {
  const results: PreCalc[] = [];
  for (let c = MIN_CYCLES; c <= MAX_CYCLES; c++) {
    const wakeMin = bedMinutes + SLEEP_LATENCY + c * CYCLE_DURATION;
    results.push({
      cycles: c,
      wakeTime: formatTime(wakeMin),
      totalSleep: totalSleepLabel(c),
      quality: qualityForCycles(c),
    });
  }
  return results;
}

// The actual unique content for each entry is authored once and stored in the
// committed JSON files. This script computes the *structural* fields
// (slug, preCalculated, relatedSlugs) and merges them with the authored content.
// If you need to regenerate from scratch (no existing content), run with --skeleton
// to produce placeholder content blocks.

const WAKE_TIMES: [number, number][] = [
  [4, 0], [4, 30], [5, 0], [5, 30], [6, 0], [6, 30], [7, 0],
  [7, 30], [8, 0], [8, 30], [9, 0], [9, 30], [10, 0],
];

const BED_TIMES: [number, number][] = [
  [20, 0], [20, 30], [21, 0], [21, 30], [22, 0], [22, 30], [23, 0],
  [23, 30], [24, 0], [24, 30], [25, 0], [25, 30], [26, 0],
  // hours >23 represent next-day: 24=midnight, 25=1am, 26=2am
];

function neighbourSlugs(
  slugs: string[],
  idx: number,
  builder: (h: number, m: number) => string,
  times: [number, number][],
): string[] {
  const related: string[] = [];
  if (idx > 0) related.push(slugs[idx - 1]);
  if (idx + 1 < slugs.length) related.push(slugs[idx + 1]);
  if (idx + 2 < slugs.length) related.push(slugs[idx + 2]);
  else if (idx - 2 >= 0) related.push(slugs[idx - 2]);
  return related;
}

function generateSleepTimesStructure(): SleepTimeEntry[] {
  const entries: SleepTimeEntry[] = [];

  // Wake-up entries
  const wakeSlugs = WAKE_TIMES.map(([h, m]) => buildWakeSlug(h, m));
  for (let i = 0; i < WAKE_TIMES.length; i++) {
    const [h, m] = WAKE_TIMES[i];
    const timeStr = formatTime(h * 60 + m);
    const slug = wakeSlugs[i];
    entries.push({
      slug,
      type: 'wake',
      time: timeStr,
      hour24: h,
      minute: m,
      title: `What Time Should I Go to Bed if I Wake Up at ${timeStr}?`,
      h1: `Bedtime Calculator for a ${timeStr} Wake-Up`,
      metaDescription: `Calculate the best bedtime for a ${timeStr} wake-up. Get optimal sleep cycle times based on 90-minute cycles and sleep science.`,
      preCalculated: calcBedtimesForWake(h * 60 + m),
      content: { intro: '', whyThisTime: '', tips: '', science: '' },
      faq: [],
      relatedSlugs: neighbourSlugs(wakeSlugs, i, buildWakeSlug, WAKE_TIMES),
    });
  }

  // Bedtime entries
  const bedSlugs = BED_TIMES.map(([h, m]) => buildBedSlug(h % 24, m));
  for (let i = 0; i < BED_TIMES.length; i++) {
    const [h, m] = BED_TIMES[i];
    const normH = h % 24;
    const timeStr = formatTime(normH * 60 + m);
    const slug = bedSlugs[i];
    entries.push({
      slug,
      type: 'bed',
      time: timeStr,
      hour24: normH,
      minute: m,
      title: `What Time Should I Wake Up if I Go to Bed at ${timeStr}?`,
      h1: `Wake-Up Calculator for a ${timeStr} Bedtime`,
      metaDescription: `Find the ideal wake-up time for a ${timeStr} bedtime. Optimize your sleep cycles to wake up refreshed and alert.`,
      preCalculated: calcWakeTimesForBed(h * 60 + m),
      content: { intro: '', whyThisTime: '', tips: '', science: '' },
      faq: [],
      relatedSlugs: neighbourSlugs(bedSlugs, i, buildBedSlug, BED_TIMES),
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// 2. Age Recommendations
// ---------------------------------------------------------------------------

interface AgeEntry {
  slug: string;
  ageGroup: string;
  ageRange: string;
  title: string;
  h1: string;
  metaDescription: string;
  recommendedHours: { min: number; max: number; ideal: number };
  napInfo: string;
  content: { intro: string; sleepNeeds: string; tips: string; signs: string };
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

const AGE_GROUPS: Omit<AgeEntry, 'content' | 'faq' | 'relatedSlugs'>[] = [
  {
    slug: 'newborn-0-3-months',
    ageGroup: 'Newborn',
    ageRange: '0-3 months',
    title: 'How Much Sleep Does a Newborn Need?',
    h1: 'Sleep Recommendations for Newborns (0-3 Months)',
    metaDescription: 'Newborns need 14-17 hours of sleep per day. Learn about healthy newborn sleep patterns, safe sleep practices, and how to support your baby\'s development.',
    recommendedHours: { min: 14, max: 17, ideal: 16 },
    napInfo: 'Newborns do not follow a set nap schedule. They sleep in short bursts of 1-3 hours throughout the day and night, totaling 14-17 hours. Expect 4-7 sleep periods per 24 hours with frequent waking for feeding.',
  },
  {
    slug: 'infant-4-11-months',
    ageGroup: 'Infant',
    ageRange: '4-11 months',
    title: 'How Much Sleep Does an Infant Need?',
    h1: 'Sleep Recommendations for Infants (4-11 Months)',
    metaDescription: 'Infants aged 4-11 months need 12-15 hours of sleep daily including naps. Discover age-appropriate sleep schedules, nap transitions, and healthy sleep habits.',
    recommendedHours: { min: 12, max: 15, ideal: 14 },
    napInfo: 'Infants typically take 2-3 naps per day, gradually transitioning from three naps to two around 6-9 months. Individual naps last 30 minutes to 2 hours. Total daytime sleep usually ranges from 2.5 to 4 hours.',
  },
  {
    slug: 'toddler-1-2-years',
    ageGroup: 'Toddler',
    ageRange: '1-2 years',
    title: 'How Much Sleep Does a Toddler Need?',
    h1: 'Sleep Recommendations for Toddlers (1-2 Years)',
    metaDescription: 'Toddlers aged 1-2 years need 11-14 hours of sleep including naps. Get expert guidance on toddler nap transitions, bedtime routines, and common sleep challenges.',
    recommendedHours: { min: 11, max: 14, ideal: 13 },
    napInfo: 'Toddlers typically transition from two naps to one nap between 12-18 months. The single remaining nap usually occurs after lunch and lasts 1-3 hours. Total daytime nap time averages 1.5-2.5 hours.',
  },
  {
    slug: 'preschool-3-5-years',
    ageGroup: 'Preschool',
    ageRange: '3-5 years',
    title: 'How Much Sleep Does a Preschooler Need?',
    h1: 'Sleep Recommendations for Preschoolers (3-5 Years)',
    metaDescription: 'Preschoolers aged 3-5 years need 10-13 hours of sleep. Learn about dropping naps, managing bedtime resistance, and supporting healthy sleep habits.',
    recommendedHours: { min: 10, max: 13, ideal: 12 },
    napInfo: 'Many preschoolers still benefit from a daily nap of 1-2 hours, though some begin dropping naps entirely between ages 3-5. If naps are dropped, an earlier bedtime helps compensate.',
  },
  {
    slug: 'school-age-6-13-years',
    ageGroup: 'School-Age',
    ageRange: '6-13 years',
    title: 'How Much Sleep Does a School-Age Child Need?',
    h1: 'Sleep Recommendations for School-Age Children (6-13 Years)',
    metaDescription: 'School-age children need 9-11 hours of sleep for academic performance and growth. Get strategies for balancing school, activities, and healthy sleep.',
    recommendedHours: { min: 9, max: 11, ideal: 10 },
    napInfo: 'Most school-age children no longer nap regularly. If a child consistently needs naps, it may indicate insufficient nighttime sleep or an underlying sleep issue worth discussing with a pediatrician.',
  },
  {
    slug: 'teenager-14-17-years',
    ageGroup: 'Teenager',
    ageRange: '14-17 years',
    title: 'How Much Sleep Does a Teenager Need?',
    h1: 'Sleep Recommendations for Teenagers (14-17 Years)',
    metaDescription: 'Teenagers need 8-10 hours of sleep for brain development and mental health. Learn how school schedules, screen time, and biology affect teen sleep.',
    recommendedHours: { min: 8, max: 10, ideal: 9 },
    napInfo: 'Teens may benefit from short 20-30 minute naps after school, but longer naps or napping after 4 PM can interfere with nighttime sleep onset. Weekend sleep-ins should be limited to 1 hour past weekday wake time.',
  },
  {
    slug: 'young-adult-18-25-years',
    ageGroup: 'Young Adult',
    ageRange: '18-25 years',
    title: 'How Much Sleep Does a Young Adult Need?',
    h1: 'Sleep Recommendations for Young Adults (18-25 Years)',
    metaDescription: 'Young adults need 7-9 hours of sleep. Discover how college schedules, social pressure, and screen habits impact sleep quality in your late teens and twenties.',
    recommendedHours: { min: 7, max: 9, ideal: 8 },
    napInfo: 'Short naps of 20-30 minutes can boost alertness and performance for young adults. Avoid napping after 3 PM to protect nighttime sleep quality.',
  },
  {
    slug: 'adult-26-64-years',
    ageGroup: 'Adult',
    ageRange: '26-64 years',
    title: 'How Much Sleep Does an Adult Need?',
    h1: 'Sleep Recommendations for Adults (26-64 Years)',
    metaDescription: 'Adults need 7-9 hours of sleep per night. Get evidence-based strategies for balancing work, family, and sleep quality during your most productive years.',
    recommendedHours: { min: 7, max: 9, ideal: 8 },
    napInfo: 'Adults can benefit from brief 15-20 minute power naps, especially if nighttime sleep is occasionally short. Avoid naps longer than 30 minutes or after 3 PM, as these can disrupt nighttime sleep.',
  },
  {
    slug: 'older-adult-65-plus',
    ageGroup: 'Older Adult',
    ageRange: '65+ years',
    title: 'How Much Sleep Does an Older Adult Need?',
    h1: 'Sleep Recommendations for Older Adults (65+)',
    metaDescription: 'Older adults need 7-8 hours of sleep. Learn about age-related sleep changes, managing insomnia, and maintaining healthy sleep patterns after 65.',
    recommendedHours: { min: 7, max: 8, ideal: 7.5 },
    napInfo: 'Short daytime naps of 20-30 minutes are common and can be beneficial for older adults. However, frequent or long naps may indicate insufficient nighttime sleep or an underlying health condition.',
  },
];

function generateAgeStructure(): AgeEntry[] {
  const slugs = AGE_GROUPS.map((g) => g.slug);
  return AGE_GROUPS.map((group, i) => {
    const related: string[] = [];
    if (i > 0) related.push(slugs[i - 1]);
    if (i + 1 < slugs.length) related.push(slugs[i + 1]);
    return {
      ...group,
      content: { intro: '', sleepNeeds: '', tips: '', signs: '' },
      faq: [],
      relatedSlugs: related,
    };
  });
}

// ---------------------------------------------------------------------------
// 3. Professions
// ---------------------------------------------------------------------------

interface ProfessionEntry {
  slug: string;
  profession: string;
  title: string;
  h1: string;
  metaDescription: string;
  typicalSchedule: string;
  challenges: string[];
  recommendedBedtime: string;
  recommendedWakeTime: string;
  content: { intro: string; challenges: string; strategy: string; tips: string };
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

const PROFESSIONS: Omit<ProfessionEntry, 'content' | 'faq' | 'relatedSlugs'>[] = [
  { slug: 'nurse', profession: 'Nurse', title: 'Sleep Guide for Nurses — Optimal Sleep Schedule', h1: 'Sleep Calculator for Nurses', metaDescription: 'Nurses working rotating shifts face unique sleep challenges. Get a personalized sleep schedule, shift work strategies, and recovery tips designed specifically for nursing professionals.', typicalSchedule: 'Rotating 12-hour shifts (7a-7p, 7p-7a) with 3-4 shifts per week', challenges: ['Rotating shift work', 'High-stress patient care', '12-hour shifts', 'Irregular days off', 'Emotional toll and compassion fatigue'], recommendedBedtime: 'Within 1 hour of arriving home after a night shift; 10:00 PM on day-shift days', recommendedWakeTime: '5:00 AM for day shifts; sleep until natural wake after night shifts (aim for 7-8 hours)' },
  { slug: 'doctor-physician', profession: 'Doctor/Physician', title: 'Sleep Guide for Doctors — Managing On-Call and Residency Sleep', h1: 'Sleep Calculator for Doctors and Physicians', metaDescription: 'Doctors and physicians face on-call schedules, long shifts, and high cognitive demands. Get evidence-based sleep strategies designed for medical professionals.', typicalSchedule: 'Variable: 10-12 hour days, 24-28 hour on-call shifts, early morning rounds starting 6-7 AM', challenges: ['On-call overnight shifts', '24-28 hour residency shifts', 'Early morning rounds', 'High cognitive demands requiring sustained focus', 'Pager/phone interruptions during sleep'], recommendedBedtime: '10:00 PM on regular days; strategic napping before on-call shifts', recommendedWakeTime: '5:00-5:30 AM for morning rounds; recovery sleep after on-call' },
  { slug: 'truck-driver', profession: 'Truck Driver', title: 'Sleep Guide for Truck Drivers — Safe Sleep on the Road', h1: 'Sleep Calculator for Truck Drivers', metaDescription: 'Truck drivers face drowsy driving risks and irregular schedules. Get DOT-compliant sleep strategies, sleeper berth tips, and fatigue management plans for long-haul driving.', typicalSchedule: '11-hour driving windows within 14-hour on-duty periods, with mandatory 10-hour off-duty rest (FMCSA Hours of Service)', challenges: ['Long hours of sedentary driving', 'Irregular sleep environments (sleeper berths, truck stops)', 'Crossing time zones', 'Limited access to healthy food', 'Social isolation on long hauls'], recommendedBedtime: 'Within 1 hour of completing your driving window; prioritize the same time when possible', recommendedWakeTime: 'Allow 7-8 hours of sleep within your 10-hour off-duty period; account for wind-down and wake-up time' },
  { slug: 'firefighter', profession: 'Firefighter', title: 'Sleep Guide for Firefighters — Managing 24-Hour Shifts', h1: 'Sleep Calculator for Firefighters', metaDescription: 'Firefighters on 24-hour shifts face fragmented sleep and high adrenaline. Get recovery strategies, napping protocols, and circadian management tips for fire service.', typicalSchedule: '24 hours on, 48 hours off (Kelly schedule); some departments use 48/96', challenges: ['24-hour shifts with unpredictable call volume', 'Adrenaline surges disrupting sleep', 'Sleeping in station dormitories', 'Exposure to traumatic incidents', 'Physical demands followed by sedentary waiting'], recommendedBedtime: '10:00 PM during station shifts when possible; maintain consistent schedule on off days', recommendedWakeTime: '6:00 AM on shift; prioritize consistent wake times on off days within 1 hour of shift schedule' },
  { slug: 'police-officer', profession: 'Police Officer', title: 'Sleep Guide for Police Officers — Shift Work Sleep Strategies', h1: 'Sleep Calculator for Police Officers', metaDescription: 'Police officers working rotating shifts face chronic fatigue risks. Get evidence-based sleep scheduling, fatigue management, and recovery strategies for law enforcement.', typicalSchedule: 'Rotating 8-12 hour shifts across days, evenings, and nights; common patterns include 4 on/3 off or 5 on/2 off', challenges: ['Rotating shift schedules', 'Hypervigilance from duty carrying over to off-duty hours', 'Court appearances disrupting sleep schedules', 'Exposure to traumatic incidents affecting sleep quality', 'Overtime and extra-duty assignments'], recommendedBedtime: 'Within 1 hour of arriving home regardless of shift; consistency is key', recommendedWakeTime: '6-7 hours before shift start to allow for preparation and commute' },
  { slug: 'software-engineer', profession: 'Software Engineer', title: 'Sleep Guide for Software Engineers — Screen Time and Sleep', h1: 'Sleep Calculator for Software Engineers', metaDescription: 'Software engineers face blue light exposure, on-call rotations, and late-night coding. Get sleep optimization strategies for tech professionals.', typicalSchedule: 'Typically 9 AM-6 PM with flexible hours; on-call rotations every 4-8 weeks; crunch periods with extended hours', challenges: ['Prolonged blue light exposure from screens', 'On-call rotations disrupting sleep', 'Stimulating problem-solving late into evening', 'Caffeine-dependent culture', 'Sedentary work reducing sleep drive'], recommendedBedtime: '10:30 PM-11:00 PM for standard schedules; adjust for on-call weeks', recommendedWakeTime: '6:30 AM-7:30 AM to allow morning routine before work' },
  { slug: 'teacher', profession: 'Teacher', title: 'Sleep Guide for Teachers — Managing Early Start Times', h1: 'Sleep Calculator for Teachers', metaDescription: 'Teachers face early school start times and evening grading. Get sleep strategies for educators balancing classroom demands with personal rest.', typicalSchedule: 'School day 7:00-7:30 AM start, 3:00-3:30 PM end; evening grading, lesson planning, and extracurriculars', challenges: ['Early morning start times requiring 5:00-5:30 AM wake-ups', 'Evening work (grading, planning) pushing bedtime later', 'Emotional demands of student care', 'Seasonal workload spikes (report cards, conferences)', 'Noise-rich environment causing vocal strain and fatigue'], recommendedBedtime: '9:30 PM-10:00 PM during school weeks', recommendedWakeTime: '5:00-5:30 AM to allow preparation time before school' },
  { slug: 'construction-worker', profession: 'Construction Worker', title: 'Sleep Guide for Construction Workers — Recovery Sleep for Physical Labor', h1: 'Sleep Calculator for Construction Workers', metaDescription: 'Construction workers need quality sleep for physical recovery and job site safety. Get sleep strategies optimized for early starts and physically demanding work.', typicalSchedule: 'Typically 6:00-7:00 AM start, 10-12 hour days during peak season; seasonal variation', challenges: ['Early morning start times', 'Intense physical labor requiring deep recovery sleep', 'Outdoor exposure to heat, cold, and noise', 'Commute to remote job sites', 'Seasonal overtime during good weather'], recommendedBedtime: '9:00-9:30 PM during work weeks', recommendedWakeTime: '4:30-5:00 AM to allow for commute to job site' },
  { slug: 'pilot', profession: 'Pilot', title: 'Sleep Guide for Pilots — Managing Jet Lag and Circadian Disruption', h1: 'Sleep Calculator for Pilots', metaDescription: 'Pilots face time zone changes, irregular schedules, and FAA fatigue rules. Get sleep strategies for managing circadian disruption and staying alert in the cockpit.', typicalSchedule: 'Variable: multi-day trips crossing time zones, layovers in hotels, FAA-mandated 10-hour rest periods with 8-hour sleep opportunity', challenges: ['Crossing multiple time zones regularly', 'Sleeping in unfamiliar hotel environments', 'Early report times (often 4:00-5:00 AM)', 'Irregular schedule with no two weeks alike', 'FAA fatigue regulations and duty time limits'], recommendedBedtime: 'Adjust based on destination time zone; use strategic melatonin for transitions', recommendedWakeTime: '2 hours before report time; prioritize 7-8 hours regardless of time zone' },
  { slug: 'chef', profession: 'Chef', title: 'Sleep Guide for Chefs — Late-Night Kitchen Recovery', h1: 'Sleep Calculator for Chefs', metaDescription: 'Chefs and restaurant workers finishing late shifts face unique sleep challenges. Get strategies for winding down after service and protecting your sleep.', typicalSchedule: 'Split shifts or straight evening shifts; typical service 4 PM-midnight or later; prep shifts starting 8-10 AM', challenges: ['Late-night finish times with high adrenaline', 'Hot kitchen environment raising core body temperature', 'Split shifts disrupting sleep continuity', 'Standing for 8-12 hours causing physical fatigue', 'Post-service wind-down culture (late meals, drinks with crew)'], recommendedBedtime: '1:00-2:00 AM for evening service workers; midnight for morning prep cooks', recommendedWakeTime: '9:00-10:00 AM for evening shifts; 6:00 AM for morning prep' },
  { slug: 'paramedic-emt', profession: 'Paramedic/EMT', title: 'Sleep Guide for Paramedics and EMTs — Shift Recovery', h1: 'Sleep Calculator for Paramedics and EMTs', metaDescription: 'Paramedics and EMTs working 12-24 hour shifts face fragmented sleep and high stress. Get sleep recovery strategies for emergency medical services professionals.', typicalSchedule: '12 or 24-hour shifts with varying call volume; some services use 48/96 schedules', challenges: ['Unpredictable call volume disrupting sleep during shifts', 'Adrenaline from emergency responses', 'Exposure to traumatic scenes', 'Physical demands of patient lifting and transport', 'Night driving and alertness requirements'], recommendedBedtime: 'Within 1 hour of shift end; 10:00 PM on off days', recommendedWakeTime: 'Allow 7-8 hours after shift end; maintain consistent off-day schedule' },
  { slug: 'military', profession: 'Military', title: 'Sleep Guide for Military Personnel — Tactical Sleep Management', h1: 'Sleep Calculator for Military Personnel', metaDescription: 'Military service members face deployment sleep deprivation, watch schedules, and training demands. Get tactical sleep strategies used by elite military units.', typicalSchedule: 'Highly variable: garrison schedule (PT at 0630), field training (watch rotations), deployment (irregular sleep opportunities)', challenges: ['Watch/guard duty rotations disrupting sleep', 'Field conditions with no climate control or comfort', 'Deployment stress and hypervigilance', 'Early PT formations requiring 5:00-5:30 AM wake-ups', 'Training exercises with extended sleep deprivation'], recommendedBedtime: '9:30-10:00 PM in garrison; follow unit SOP in the field', recommendedWakeTime: '5:00-5:30 AM in garrison; mission-dependent in the field' },
  { slug: 'retail-worker', profession: 'Retail Worker', title: 'Sleep Guide for Retail Workers — Managing Irregular Schedules', h1: 'Sleep Calculator for Retail Workers', metaDescription: 'Retail workers face changing schedules, early openings, and late closings. Get sleep strategies for maintaining consistent rest with an irregular work schedule.', typicalSchedule: 'Variable: opening shifts (5-6 AM), mid shifts, closing shifts (ending 9-11 PM); schedules change weekly', challenges: ['Unpredictable weekly schedules', 'Clopening shifts (closing then opening next day)', 'Standing for 6-8 hours causing physical fatigue', 'Holiday season extended hours', 'Part-time workers juggling multiple jobs'], recommendedBedtime: 'Maintain a consistent core sleep window regardless of shift; anchor bedtime within a 2-hour range', recommendedWakeTime: 'Set based on earliest possible shift; allow 90 minutes before start time' },
  { slug: 'factory-worker', profession: 'Factory Worker', title: 'Sleep Guide for Factory Workers — Shift Work and Sleep Health', h1: 'Sleep Calculator for Factory Workers', metaDescription: 'Factory and manufacturing workers on rotating shifts face chronic circadian disruption. Get sleep strategies for first, second, and third shift schedules.', typicalSchedule: 'Rotating 8-hour shifts: first (6 AM-2 PM), second (2 PM-10 PM), third (10 PM-6 AM); some plants use 12-hour Continental schedules', challenges: ['Rotating between day and night shifts', 'Noisy work environment during shifts', 'Repetitive physical work causing musculoskeletal fatigue', 'Limited natural light exposure on second/third shifts', 'Shift rotation patterns that conflict with circadian biology'], recommendedBedtime: '10:00 PM for first shift; 11:00 PM for second shift; 8:00 AM for third shift', recommendedWakeTime: '4:30 AM for first shift; 12:00 PM for second shift; 6:00 PM for third shift (after 8h sleep)' },
  { slug: 'lawyer', profession: 'Lawyer', title: 'Sleep Guide for Lawyers — Billable Hours and Sleep', h1: 'Sleep Calculator for Lawyers', metaDescription: 'Lawyers face long billable hours, deadline pressure, and high cognitive demands. Get sleep strategies for legal professionals to maintain sharp performance.', typicalSchedule: 'Typically 9 AM-7+ PM with extended hours during trials, deals, and filing deadlines; billable hour pressure', challenges: ['Long work hours driven by billable targets', 'High-stakes deadline pressure causing anxiety', 'Cognitive demands of legal analysis and writing', 'Evening client calls across time zones', 'Difficulty mentally disengaging from cases'], recommendedBedtime: '10:30-11:00 PM; protect this even during busy periods', recommendedWakeTime: '6:00-6:30 AM for morning preparation and review' },
  { slug: 'new-parent', profession: 'New Parent', title: 'Sleep Guide for New Parents — Surviving Sleep Deprivation', h1: 'Sleep Calculator for New Parents', metaDescription: 'New parents lose 400-750 hours of sleep in the first year. Get evidence-based strategies for maximizing rest, sharing night duties, and recovery sleep.', typicalSchedule: 'Fragmented: newborn feedings every 2-3 hours around the clock; improving to every 4-6 hours by 3-6 months', challenges: ['Nighttime feedings every 2-3 hours for newborns', 'Inability to sleep when baby is sleeping due to household tasks', 'Hormonal changes affecting sleep architecture', 'Anxiety about infant safety disrupting sleep', 'Relationship strain from shared sleep deprivation'], recommendedBedtime: 'Go to bed when the baby goes down for the first long stretch, even if it is 7:00-8:00 PM', recommendedWakeTime: 'Sleep in shifts if possible; prioritize one 4-5 hour uninterrupted block for each parent' },
  { slug: 'college-student', profession: 'College Student', title: 'Sleep Guide for College Students — Academic Performance and Sleep', h1: 'Sleep Calculator for College Students', metaDescription: 'College students average only 6.5 hours of sleep. Learn how sleep affects GPA, study with sleep-optimized schedules, and recover from all-nighters.', typicalSchedule: 'Highly irregular: class schedules change daily, late-night studying, social activities, part-time work', challenges: ['Irregular daily schedules across different class days', 'Late-night studying and all-nighters before exams', 'Social pressure to stay up late', 'Noisy dormitory sleeping environments', 'Screen time and social media disrupting sleep onset'], recommendedBedtime: '11:00 PM-midnight; maintain even on weekends (within 1 hour)', recommendedWakeTime: '7:00-8:00 AM to establish consistent circadian rhythm' },
  { slug: 'remote-worker', profession: 'Remote Worker', title: 'Sleep Guide for Remote Workers — Boundaries and Sleep Hygiene', h1: 'Sleep Calculator for Remote Workers', metaDescription: 'Remote workers face blurred work-life boundaries and reduced physical activity. Get sleep strategies for maintaining healthy boundaries and consistent rest.', typicalSchedule: 'Flexible hours, typically 9 AM-5 PM but often extended; may work across time zones', challenges: ['Blurred boundaries between work and personal time', 'Reduced physical activity and sunlight exposure', 'Screens in the bedroom or sleeping near workspace', 'Irregular schedule without commute anchoring the day', 'Meetings across time zones pushing work into evening'], recommendedBedtime: '10:30-11:00 PM; create a firm end-of-work ritual', recommendedWakeTime: '6:30-7:30 AM to maintain structure and morning sunlight exposure' },
  { slug: 'executive-ceo', profession: 'Executive/CEO', title: 'Sleep Guide for Executives and CEOs — Leadership and Sleep', h1: 'Sleep Calculator for Executives and CEOs', metaDescription: 'Executives and CEOs need peak cognitive performance for strategic decisions. Get sleep optimization strategies for high-performers managing global responsibilities.', typicalSchedule: 'Early mornings (5-6 AM) through evening events; international travel and cross-timezone calls', challenges: ['Early morning routines combined with evening obligations', 'International travel across multiple time zones', 'High-stakes decision-making requiring sustained cognition', 'Constant connectivity and information overload', 'Difficulty delegating mental load before sleep'], recommendedBedtime: '10:00-10:30 PM; protect ruthlessly as a strategic asset', recommendedWakeTime: '5:00-6:00 AM for morning routine and deep work' },
  { slug: 'athlete', profession: 'Athlete', title: 'Sleep Guide for Athletes — Sleep as Performance Enhancement', h1: 'Sleep Calculator for Athletes', metaDescription: 'Athletes need 8-10 hours of sleep for recovery and performance. Learn how sleep affects muscle repair, reaction time, and competitive edge.', typicalSchedule: 'Early morning training (5-6 AM), afternoon practice/competition, recovery periods; season-dependent', challenges: ['Early morning training sessions', 'Late-night competitions disrupting sleep schedule', 'Travel for away games and competitions', 'Pre-competition anxiety affecting sleep onset', 'Physical recovery demands requiring extended sleep'], recommendedBedtime: '9:30-10:00 PM during training; adjust for competition schedules', recommendedWakeTime: '5:30-6:00 AM for morning training; 7:00 AM on recovery days' },
];

const PROFESSION_RELATIONS: Record<string, string[]> = {
  'nurse': ['doctor-physician', 'paramedic-emt', 'firefighter'],
  'doctor-physician': ['nurse', 'paramedic-emt', 'military'],
  'truck-driver': ['pilot', 'factory-worker', 'construction-worker'],
  'firefighter': ['police-officer', 'paramedic-emt', 'military'],
  'police-officer': ['firefighter', 'military', 'paramedic-emt'],
  'software-engineer': ['remote-worker', 'executive-ceo', 'lawyer'],
  'teacher': ['college-student', 'new-parent', 'nurse'],
  'construction-worker': ['factory-worker', 'truck-driver', 'athlete'],
  'pilot': ['truck-driver', 'military', 'executive-ceo'],
  'chef': ['retail-worker', 'nurse', 'firefighter'],
  'paramedic-emt': ['nurse', 'firefighter', 'police-officer'],
  'military': ['firefighter', 'police-officer', 'athlete'],
  'retail-worker': ['chef', 'factory-worker', 'college-student'],
  'factory-worker': ['construction-worker', 'retail-worker', 'truck-driver'],
  'lawyer': ['software-engineer', 'executive-ceo', 'doctor-physician'],
  'new-parent': ['nurse', 'teacher', 'remote-worker'],
  'college-student': ['teacher', 'retail-worker', 'software-engineer'],
  'remote-worker': ['software-engineer', 'executive-ceo', 'lawyer'],
  'executive-ceo': ['lawyer', 'pilot', 'software-engineer'],
  'athlete': ['military', 'construction-worker', 'firefighter'],
};

function generateProfessionsStructure(): ProfessionEntry[] {
  return PROFESSIONS.map((prof) => ({
    ...prof,
    content: { intro: '', challenges: '', strategy: '', tips: '' },
    faq: [],
    relatedSlugs: PROFESSION_RELATIONS[prof.slug] ?? [],
  }));
}

// ---------------------------------------------------------------------------
// Merge logic: overlay generated structure onto existing content files
// ---------------------------------------------------------------------------

function loadExisting<T extends { slug: string }>(relPath: string): Map<string, T> {
  const abs = resolve(__dirname, '..', relPath);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data: T[] = require(abs);
    const map = new Map<string, T>();
    for (const entry of data) map.set(entry.slug, entry);
    return map;
  } catch {
    return new Map();
  }
}

function mergeEntries<T extends { slug: string }>(
  generated: T[],
  existing: Map<string, T>,
): T[] {
  return generated.map((gen) => {
    const ex = existing.get(gen.slug);
    if (!ex) return gen;
    // Keep generated structural fields (preCalculated, relatedSlugs, etc.),
    // but prefer existing authored content + faq when present.
    return { ...gen, ...ex, ...pickStructural(gen) };
  });
}

/** Fields that should always come from the generator, not the existing file */
function pickStructural<T>(gen: T): Partial<T> {
  const structural: (keyof SleepTimeEntry)[] = [
    'slug', 'type', 'time', 'hour24', 'minute',
    'title', 'h1', 'metaDescription', 'preCalculated', 'relatedSlugs',
  ];
  const result: Record<string, unknown> = {};
  for (const key of structural) {
    if (key in (gen as Record<string, unknown>)) {
      result[key] = (gen as Record<string, unknown>)[key];
    }
  }
  return result as Partial<T>;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const skeleton = process.argv.includes('--skeleton');

  console.log('Generating programmatic SEO data...\n');

  // Sleep times
  const sleepTimesGen = generateSleepTimesStructure();
  if (skeleton) {
    writeJSON('src/content/data/sleep-times.json', sleepTimesGen);
  } else {
    const existing = loadExisting<SleepTimeEntry>('src/content/data/sleep-times.json');
    if (existing.size > 0) {
      const merged = mergeEntries(sleepTimesGen, existing);
      writeJSON('src/content/data/sleep-times.json', merged);
    } else {
      writeJSON('src/content/data/sleep-times.json', sleepTimesGen);
      console.log('    (skeleton — content blocks are empty, fill them manually)');
    }
  }

  // Age recommendations
  const ageGen = generateAgeStructure();
  if (skeleton) {
    writeJSON('src/content/data/age-recs.json', ageGen);
  } else {
    const existing = loadExisting<AgeEntry>('src/content/data/age-recs.json');
    if (existing.size > 0) {
      const merged = mergeEntries(ageGen, existing);
      writeJSON('src/content/data/age-recs.json', merged);
    } else {
      writeJSON('src/content/data/age-recs.json', ageGen);
      console.log('    (skeleton — content blocks are empty, fill them manually)');
    }
  }

  // Professions
  const profGen = generateProfessionsStructure();
  if (skeleton) {
    writeJSON('src/content/data/professions.json', profGen);
  } else {
    const existing = loadExisting<ProfessionEntry>('src/content/data/professions.json');
    if (existing.size > 0) {
      const merged = mergeEntries(profGen, existing);
      writeJSON('src/content/data/professions.json', merged);
    } else {
      writeJSON('src/content/data/professions.json', profGen);
      console.log('    (skeleton — content blocks are empty, fill them manually)');
    }
  }

  console.log('\nDone.');
}

main();
