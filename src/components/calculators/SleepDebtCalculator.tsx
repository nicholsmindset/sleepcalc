'use client';

import { useMemo, useState } from 'react';
import { AGE_RECOMMENDATIONS } from '@/utils/age-recommendations';
import { calculateSleepShortfall } from '@/utils/sleep-debt';

const AGE_GROUPS = AGE_RECOMMENDATIONS.filter((item) =>
  ['Teen', 'Young Adult', 'Adult', 'Older Adult'].includes(item.ageGroup)
);

function pastSevenNights() {
  const days: Array<{ date: string; label: string }> = [];
  const today = new Date();
  for (let offset = 7; offset >= 1; offset--) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    const date = [
      day.getFullYear(),
      String(day.getMonth() + 1).padStart(2, '0'),
      String(day.getDate()).padStart(2, '0'),
    ].join('-');
    days.push({
      date,
      label: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    });
  }
  return days;
}

export default function SleepDebtCalculator() {
  const [ageGroup, setAgeGroup] = useState(
    AGE_GROUPS.find((item) => item.ageGroup === 'Adult') ?? AGE_GROUPS[0]
  );
  const [targetHours, setTargetHours] = useState(ageGroup.recommendedHours);
  const [sleepHours, setSleepHours] = useState<number[]>(Array(7).fill(7));

  const nights = useMemo(pastSevenNights, []);
  const result = useMemo(
    () => calculateSleepShortfall(
      nights.map((night, index) => ({ date: night.date, hoursSlept: sleepHours[index] })),
      targetHours
    ),
    [nights, sleepHours, targetHours]
  );

  return (
    <section className="glass-card rounded-3xl p-6 md:p-10" aria-label="Sleep shortfall calculator">
      <div className="grid gap-5 sm:grid-cols-2 mb-8">
        <label className="text-sm text-on-surface-variant">
          Age group
          <select
            value={ageGroup.ageGroup}
            onChange={(event) => {
              const selected = AGE_GROUPS.find((item) => item.ageGroup === event.target.value);
              if (selected) {
                setAgeGroup(selected);
                setTargetHours(selected.recommendedHours);
              }
            }}
            className="mt-2 w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface"
          >
            {AGE_GROUPS.map((item) => (
              <option key={item.ageGroup} value={item.ageGroup}>
                {item.ageGroup} ({item.ageRange})
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-on-surface-variant">
          Your nightly sleep target (hours)
          <input
            type="number"
            min={ageGroup.minHours}
            max={ageGroup.maxHours}
            step="0.5"
            value={targetHours}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isFinite(value)) {
                setTargetHours(Math.max(ageGroup.minHours, Math.min(ageGroup.maxHours, value)));
              }
            }}
            className="mt-2 w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface"
          />
        </label>
      </div>
      <p className="text-xs text-on-surface-variant mb-6">
        Choose a target within the {ageGroup.minHours}–{ageGroup.maxHours} hour range for this age group.
        Enter actual sleep time for each of the last seven nights.
      </p>

      <div className="space-y-4">
        {nights.map((night, index) => (
          <label key={night.date} className="flex items-center gap-4 text-sm text-on-surface-variant">
            <span className="w-24 shrink-0">{night.label}</span>
            <input
              type="range"
              min="0"
              max="14"
              step="0.5"
              value={sleepHours[index]}
              onChange={(event) => {
                const next = [...sleepHours];
                next[index] = Number(event.target.value);
                setSleepHours(next);
              }}
              className="flex-1 accent-[#46eae5]"
              aria-label={'Hours slept on ' + night.label}
            />
            <span className="w-12 text-right font-mono text-on-surface">{sleepHours[index].toFixed(1)}h</span>
          </label>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface-container p-5">
          <p className="text-xs text-on-surface-variant">Estimated 7-day shortfall</p>
          <p className="font-headline text-3xl font-bold text-on-surface mt-1">
            {result.totalShortfallHours.toFixed(1)}h
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container p-5">
          <p className="text-xs text-on-surface-variant">Average sleep per night</p>
          <p className="font-headline text-3xl font-bold text-on-surface mt-1">
            {result.averageHours.toFixed(1)}h
          </p>
        </div>
        <div className="rounded-2xl bg-surface-container p-5">
          <p className="text-xs text-on-surface-variant">Nights below your target</p>
          <p className="font-headline text-3xl font-bold text-on-surface mt-1">
            {result.nightsBelowTarget} of 7
          </p>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-on-surface-variant">
        This adds the hours below your chosen target on each night. Longer nights are shown in your
        average but do not erase shorter nights in the calculation. The number is a planning estimate,
        not a diagnosis, clinical severity score, or exact amount of sleep you must repay.
      </p>
    </section>
  );
}
