'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';

/* -------------------------------------------------------------------------- */
/*  DST Data (hardcoded — no API needed)                                     */
/* -------------------------------------------------------------------------- */

interface DSTEvent {
  region: string;
  springForward: Date;
  fallBack: Date;
  springChange: '+1h';
  fallChange: '-1h';
  note?: string;
}

// US: 2nd Sunday March → 1st Sunday November
// EU: Last Sunday March → Last Sunday October
const DST_EVENTS: DSTEvent[] = [
  {
    region: 'United States / Canada',
    springForward: new Date(2026, 2, 8, 2, 0, 0),   // Mar 8 2026 2:00 AM
    fallBack: new Date(2026, 10, 1, 2, 0, 0),         // Nov 1 2026 2:00 AM
    springChange: '+1h',
    fallChange: '-1h',
    note: '2nd Sunday March → 1st Sunday November',
  },
  {
    region: 'European Union',
    springForward: new Date(2026, 2, 29, 1, 0, 0),   // Mar 29 2026 1:00 AM
    fallBack: new Date(2026, 9, 25, 1, 0, 0),         // Oct 25 2026 1:00 AM
    springChange: '+1h',
    fallChange: '-1h',
    note: 'Last Sunday March → Last Sunday October',
  },
  {
    region: 'United Kingdom',
    springForward: new Date(2026, 2, 29, 1, 0, 0),
    fallBack: new Date(2026, 9, 25, 1, 0, 0),
    springChange: '+1h',
    fallChange: '-1h',
    note: 'Last Sunday March → Last Sunday October (GMT/BST)',
  },
  {
    region: 'Australia (Eastern)',
    springForward: new Date(2026, 9, 4, 2, 0, 0),    // Oct 4 2026 (1st Sun Oct)
    fallBack: new Date(2026, 3, 5, 3, 0, 0),          // Apr 5 2026 (1st Sun Apr)
    springChange: '+1h',
    fallChange: '-1h',
    note: '1st Sunday October → 1st Sunday April',
  },
];

// Timezones that do NOT observe DST
const NO_DST_ZONES = [
  'Africa/', 'Asia/Kolkata', 'Asia/Colombo', 'Asia/Dhaka', 'Asia/Karachi',
  'Asia/Tashkent', 'Asia/Tokyo', 'Asia/Singapore', 'Asia/Hong_Kong',
  'Asia/Shanghai', 'Asia/Bangkok', 'Asia/Dubai', 'Pacific/Honolulu',
  'America/Phoenix', 'America/Creston',
];

function observesDST(tz: string): boolean {
  return !NO_DST_ZONES.some((noDST) => tz.startsWith(noDST) || tz === noDST);
}

function getRegionForTimezone(tz: string): DSTEvent | null {
  if (tz.startsWith('America/') || tz.startsWith('US/') || tz.startsWith('Canada/')) {
    return DST_EVENTS[0];
  }
  if (tz.startsWith('Europe/')) {
    return tz === 'Europe/London' || tz === 'Europe/Dublin' ? DST_EVENTS[2] : DST_EVENTS[1];
  }
  if (tz.startsWith('Australia/') && !tz.includes('Perth') && !tz.includes('Darwin')) {
    return DST_EVENTS[3];
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*  Adjustment Plan Generator                                                */
/* -------------------------------------------------------------------------- */

interface AdjustmentDay {
  day: number;
  label: string;
  bedtime: string;
  wakeTime: string;
  tip: string;
}

function buildAdjustmentPlan(isSpringForward: boolean, normalBedtime: string): AdjustmentDay[] {
  // Parse bedtime HH:MM
  const [bHour, bMin] = normalBedtime.split(':').map(Number);
  const baseMinutes = bHour * 60 + (bMin || 0);

  const days: AdjustmentDay[] = [];

  for (let d = 1; d <= 7; d++) {
    let bedShiftMin: number;
    let wakeShiftMin: number;

    if (isSpringForward) {
      // Spring: need to advance schedule. Shift 15 min earlier per day for 4 days, then hold.
      const shift = Math.min((d - 1) * 15, 60);
      bedShiftMin = -shift;
      wakeShiftMin = -shift;
    } else {
      // Fall: clock goes back, so body is running ahead. Delay 15 min per day for 4 days.
      const shift = Math.min((d - 1) * 15, 60);
      bedShiftMin = shift;
      wakeShiftMin = shift;
    }

    const newBedMin = (baseMinutes + bedShiftMin + 1440) % 1440;
    const newWakeMin = ((baseMinutes + 480) + wakeShiftMin + 1440) % 1440; // wake = bed + 8h

    const fmt = (mins: number) => {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
    };

    const springTips = [
      'Go to bed 15 min earlier than normal tonight.',
      'Increase light exposure first thing in the morning to shift your clock.',
      'Avoid caffeine after 1 PM to help with earlier sleep onset.',
      'A short 20-min nap before 3 PM can bridge the gap.',
      'Your schedule should feel mostly normal now.',
      'Maintain the new times — your clock is re-anchored.',
      'Transition complete. Stick to your new schedule.',
    ];
    const fallTips = [
      'The clock falls back tonight — don\'t sleep in extra.',
      'Get outside light in the morning to avoid phase delay.',
      'Avoid bright screens after 8 PM to start melatonin on time.',
      'Keep dinner at the same clock time, not body-time.',
      'Your schedule should feel mostly synced.',
      'Maintain consistency — your circadian rhythm is adapting.',
      'Transition complete. Watch for afternoon drowsiness fading.',
    ];

    days.push({
      day: d,
      label: d === 1 ? 'DST Night' : `Day ${d}`,
      bedtime: fmt(newBedMin),
      wakeTime: fmt(newWakeMin),
      tip: isSpringForward ? springTips[d - 1] : fallTips[d - 1],
    });
  }

  return days;
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                           */
/* -------------------------------------------------------------------------- */

export default function DSTCalculatorPage() {
  const [timezone, setTimezone] = useState('');
  const [bedtime, setBedtime] = useState('22:30');
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, []);

  const hasDST = useMemo(() => (timezone ? observesDST(timezone) : null), [timezone]);
  const dstRegion = useMemo(() => (timezone ? getRegionForTimezone(timezone) : null), [timezone]);

  const now = new Date();
  const nextEvent = useMemo(() => {
    if (!dstRegion) return null;
    const { springForward, fallBack } = dstRegion;
    if (springForward > now) return { date: springForward, type: 'spring' as const };
    if (fallBack > now) return { date: fallBack, type: 'fall' as const };
    return null;
  }, [dstRegion, now]);

  const daysUntil = useMemo(() => {
    if (!nextEvent) return null;
    const diff = nextEvent.date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [nextEvent, now]);

  const adjustmentPlan = useMemo(() => {
    if (!nextEvent) return null;
    return buildAdjustmentPlan(nextEvent.type === 'spring', bedtime);
  }, [nextEvent, bedtime]);

  const formatDSTDate = (d: Date) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Daylight Saving Time Sleep Adjustment Calculator
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Get your personalised 7-day sleep adjustment plan for the next DST change, based on your
          auto-detected timezone and normal bedtime.
        </p>
      </div>

      {/* Timezone detection */}
      <div className="glass-card rounded-3xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Your Timezone</p>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-on-surface-variant mb-1 block">Detected timezone</label>
            <div className="bg-surface-container/60 rounded-xl px-4 py-3 font-mono text-sm text-on-surface">
              {timezone || 'Detecting…'}
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-on-surface-variant mb-1 block">Your usual bedtime</label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full bg-surface-container/60 rounded-xl px-4 py-3 font-mono text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* DST Status */}
      {timezone && (
        <div className="glass-card rounded-3xl p-6 mb-6">
          {hasDST === false ? (
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-on-surface mb-1">
                  Your timezone does not observe Daylight Saving Time
                </p>
                <p className="text-sm text-on-surface-variant">
                  <strong className="text-on-surface">{timezone}</strong> operates on a fixed offset
                  year-round. No clock changes, no sleep disruption — but your sunrise and sunset times
                  still shift through the seasons.
                </p>
              </div>
            </div>
          ) : dstRegion && nextEvent ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                {nextEvent.type === 'spring' ? (
                  <Sun className="w-6 h-6 text-[#f9ca24]" />
                ) : (
                  <Moon className="w-6 h-6 text-[#c6bfff]" />
                )}
                <div>
                  <p className="font-headline text-lg font-bold text-on-surface">
                    {nextEvent.type === 'spring' ? 'Spring Forward' : 'Fall Back'} in{' '}
                    <span className="text-[#46eae5]">{daysUntil} days</span>
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {formatDSTDate(nextEvent.date)}
                  </p>
                </div>
              </div>
              <div className="bg-surface-container/40 rounded-2xl p-4 text-sm text-on-surface-variant">
                <p className="mb-1">
                  <strong className="text-on-surface">Region:</strong> {dstRegion.region}
                </p>
                <p className="mb-1">
                  <strong className="text-on-surface">Change:</strong>{' '}
                  {nextEvent.type === 'spring'
                    ? 'Clocks move +1 hour forward (lose 1 hour of sleep)'
                    : 'Clocks move −1 hour back (gain 1 hour of sleep)'}
                </p>
                {dstRegion.note && (
                  <p className="text-xs text-on-surface-variant/70">{dstRegion.note}</p>
                )}
              </div>

              <button
                onClick={() => setShowPlan((p) => !p)}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: '#fff' }}
              >
                {showPlan ? 'Hide' : 'Show'} My 7-Day Adjustment Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              No upcoming DST event found for <strong className="text-on-surface">{timezone}</strong>{' '}
              in the current period.
            </p>
          )}
        </div>
      )}

      {/* 7-Day Plan */}
      {showPlan && adjustmentPlan && nextEvent && (
        <div className="glass-card rounded-3xl p-6 mb-8">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
            Your 7-Day {nextEvent.type === 'spring' ? 'Spring Forward' : 'Fall Back'} Plan
          </h2>
          <p className="text-xs text-on-surface-variant mb-5">
            Shift 15 minutes per day for a smooth transition. Target bedtime based on your{' '}
            <span className="text-on-surface font-mono">{bedtime}</span> baseline.
          </p>
          <div className="space-y-3">
            {adjustmentPlan.map((d) => (
              <div key={d.day} className="flex gap-4 group">
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${d.day === 1 ? 'bg-[#f9ca24]' : 'bg-outline-variant'}`} />
                  {d.day < 7 && <div className="w-px flex-1 bg-outline-variant/30 mt-1" />}
                </div>
                {/* Content */}
                <div className="pb-3 min-w-0 flex-1">
                  <div className="flex gap-4 flex-wrap mb-1">
                    <span className="text-xs font-semibold text-on-surface">{d.label}</span>
                    <span className="font-mono text-xs text-[#c6bfff]">Bed: {d.bedtime}</span>
                    <span className="font-mono text-xs text-[#46eae5]">Wake: {d.wakeTime}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{d.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long-form content */}
      <section className="space-y-10 mt-6">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why DST Disrupts Sleep
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Daylight Saving Time is the largest scheduled disruption to human sleep patterns in the
              modern world. Unlike jet lag — which most people only experience occasionally — DST affects
              entire countries simultaneously, twice a year. The spring transition is significantly harder
              than the fall transition because it forces you to wake up when your body clock still thinks
              it&apos;s an hour earlier.
            </p>
            <p>
              Research consistently shows that in the week following the spring clock change, rates of
              heart attacks increase by approximately 24% (Michigan Medicine, 2014), traffic accidents spike
              by 6% (Sleep Medicine, 2020), and workplace injuries rise significantly. These effects are
              attributed to acute sleep deprivation from the abrupt one-hour shift.
            </p>
            <p>
              The fall transition is easier biologically — you&apos;re gaining an hour — but many people
              still experience disruption because their bodies continue waking at the old time, causing
              early-morning wakefulness and difficulty staying asleep until the desired time.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Spring Forward vs. Fall Back: Different Strategies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-4 h-4 text-[#f9ca24]" />
                <span className="font-semibold text-on-surface">Spring Forward (+1h)</span>
              </div>
              <ul className="space-y-2 text-on-surface-variant text-xs">
                <li>• Start shifting bedtime 15 min earlier 4 days before</li>
                <li>• Get bright light immediately on waking</li>
                <li>• Avoid naps longer than 20 minutes</li>
                <li>• Cut caffeine earlier than usual for 3–4 days</li>
                <li>• Expect fatigue to peak on days 1–3</li>
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-[#c6bfff]" />
                <span className="font-semibold text-on-surface">Fall Back (−1h)</span>
              </div>
              <ul className="space-y-2 text-on-surface-variant text-xs">
                <li>• Resist sleeping in on the transition morning</li>
                <li>• Keep meals and exercise at consistent clock times</li>
                <li>• Dim lights earlier in the evening for 3–4 days</li>
                <li>• Avoid bright light after 8 PM to prevent phase delay</li>
                <li>• Maintain your new wake time consistently</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Countries That Have Abolished DST
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              A growing number of countries and regions have eliminated clock changes entirely. China,
              Japan, India, most of Africa, and large parts of Asia do not observe DST. In 2019, the
              European Parliament voted to end DST across the EU — though implementation has been delayed
              by disagreements over whether to permanently adopt summer or winter time.
            </p>
            <p>
              In the US, several states have passed legislation to stay on permanent DST (Arizona already
              stays on standard time year-round), but federal law currently requires Congressional action
              to make the change nationwide. The Sunshine Protection Act has passed the Senate but
              remained in limbo as of 2024.
            </p>
            <p>
              Sleep scientists overwhelmingly favour permanent standard time over permanent summer time,
              as standard time better aligns with natural sunrise patterns and supports earlier, more
              consistent sleep timing — particularly beneficial for children and adolescents.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/dst-calculator" />
      </div>

      <MedicalDisclaimer />
    </main>
  );
}
