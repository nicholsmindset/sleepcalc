'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Plane, Clock, Sun, Moon, ChevronDown, X } from 'lucide-react';
import citiesData from '@/content/data/cities.json';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  utcOffset: number;
}

interface DayPlan {
  day: number;
  label: string;
  bedtime: string;
  wakeTime: string;
  tip: string;
  focus: 'sunlight' | 'darkness' | 'normal';
}

/* -------------------------------------------------------------------------- */
/*  Constants & Helpers                                                       */
/* -------------------------------------------------------------------------- */

const CITIES: City[] = citiesData as City[];

function formatOffset(offset: number): string {
  const sign = offset >= 0 ? '+' : '';
  const h = Math.floor(Math.abs(offset));
  const m = Math.round((Math.abs(offset) - h) * 60);
  return `UTC${sign}${offset < 0 ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function addMinutesToHHMM(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const totalMin = ((h * 60 + m + minutes) % (24 * 60) + 24 * 60) % (24 * 60);
  const rh = Math.floor(totalMin / 60);
  const rm = totalMin % 60;
  return `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}`;
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function calcRecoveryDays(hoursDiff: number, direction: 'east' | 'west'): number {
  // Rule of thumb: 1 day per 1-1.5 time zones
  // Eastward travel is harder (delays circadian rhythm)
  const factor = direction === 'east' ? 1.5 : 1.0;
  return Math.round(Math.abs(hoursDiff) * factor);
}

function buildRecoveryPlan(
  originOffset: number,
  destOffset: number,
  departureDate: string,
): DayPlan[] {
  let hoursDiff = destOffset - originOffset;
  // Normalise to [-12, 12]
  while (hoursDiff > 12) hoursDiff -= 24;
  while (hoursDiff < -12) hoursDiff += 24;

  const direction: 'east' | 'west' = hoursDiff > 0 ? 'east' : 'west';
  const totalDays = Math.min(calcRecoveryDays(hoursDiff, direction), 10);
  const shiftPerDay = (hoursDiff * 60) / totalDays; // minutes per day

  const baseBedtime = '23:00';
  const baseWakeTime = '07:00';

  const depDate = departureDate ? new Date(departureDate) : new Date();
  const days: DayPlan[] = [];

  const tips: { east: string[]; west: string[] } = {
    east: [
      'Go to bed 1–2 hours earlier than usual tonight.',
      'Get bright light exposure in the morning — it advances your clock.',
      'Avoid caffeine after noon to help with earlier sleep.',
      'Short 20-min nap before 3 PM only if needed.',
      'Stay active in the morning, wind down by late afternoon.',
      'Keep bedroom cool and dark to help your body reset.',
      'You\'re nearly there — maintain the new schedule even on weekends.',
    ],
    west: [
      'Stay awake until your destination\'s local bedtime.',
      'Seek bright evening light to delay your internal clock.',
      'Melatonin (0.5–1 mg) taken at destination bedtime can help.',
      'Avoid alcohol — it fragments sleep and slows adaptation.',
      'Short exposure to sunlight in late afternoon helps shift westward.',
      'Eat meals on destination schedule, not home schedule.',
      'You\'re almost adjusted — stay consistent with sleep timing.',
    ],
  };

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(depDate);
    d.setDate(d.getDate() + i);
    const dayLabel = i === 0 ? 'Arrival Day' : `Day ${i + 1}`;

    const shiftApplied = Math.round(shiftPerDay * i);
    const bedtime = addMinutesToHHMM(baseBedtime, -shiftApplied);
    const wakeTime = addMinutesToHHMM(baseWakeTime, -shiftApplied);

    const tipIndex = Math.min(i, tips[direction].length - 1);
    const focus: DayPlan['focus'] =
      direction === 'east' ? (i < totalDays / 2 ? 'sunlight' : 'normal') :
        i < totalDays / 2 ? 'darkness' : 'normal';

    days.push({ day: i + 1, label: dayLabel, bedtime, wakeTime, tip: tips[direction][tipIndex], focus });
  }

  return days;
}

/* -------------------------------------------------------------------------- */
/*  CitySearch Component                                                      */
/* -------------------------------------------------------------------------- */

function CitySearch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: City | null;
  onChange: (c: City) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return CITIES.slice(0, 30);
    const q = query.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    ).slice(0, 30);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <p className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">{label}</p>
      <button
        type="button"
        onClick={() => { setOpen(!open); setQuery(''); }}
        className="w-full flex items-center justify-between gap-2 glass-card rounded-2xl px-4 py-3 text-left text-sm"
      >
        <span className={value ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}>
          {value ? `${value.name}, ${value.country}` : 'Select city…'}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span className="text-xs text-on-surface-variant font-mono">{formatOffset(value.utcOffset)}</span>
          )}
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 glass-card rounded-2xl overflow-hidden shadow-xl">
          <div className="p-2 border-b border-white/10">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or country…"
              className="w-full bg-transparent text-sm text-on-surface placeholder-on-surface-variant outline-none px-2 py-1"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={`${c.name}-${c.country}`}
                type="button"
                onClick={() => { onChange(c); setOpen(false); setQuery(''); }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 text-sm text-left transition-colors"
              >
                <span className="text-on-surface">{c.name}, {c.country}</span>
                <span className="text-xs text-on-surface-variant font-mono shrink-0 ml-2">{formatOffset(c.utcOffset)}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-on-surface-variant">No cities found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function JetLagCalculatorPage() {
  const [origin, setOrigin] = useState<City | null>(null);
  const [destination, setDestination] = useState<City | null>(null);
  const [departureDate, setDepartureDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  const result = useMemo(() => {
    if (!origin || !destination) return null;

    let hoursDiff = destination.utcOffset - origin.utcOffset;
    while (hoursDiff > 12) hoursDiff -= 24;
    while (hoursDiff < -12) hoursDiff += 24;

    if (hoursDiff === 0) return { hoursDiff: 0, direction: null as null, recoveryDays: 0, plan: [] };

    const direction: 'east' | 'west' = hoursDiff > 0 ? 'east' : 'west';
    const recoveryDays = calcRecoveryDays(hoursDiff, direction);
    const plan = buildRecoveryPlan(origin.utcOffset, destination.utcOffset, departureDate);

    return { hoursDiff, direction, recoveryDays, plan };
  }, [origin, destination, departureDate]);

  const absHours = result ? Math.abs(result.hoursDiff) : 0;

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/calculators' },
          { label: 'Jet Lag Calculator', href: '/tools/jet-lag-calculator' },
        ]}
      />

      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Jet Lag Calculator
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-2xl">
        Select your origin and destination cities to get a personalised day-by-day recovery plan with
        optimal bedtimes, light exposure tips, and a realistic timeline for full adjustment.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Calculator Card */}
      {/* ------------------------------------------------------------------ */}
      <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <CitySearch label="Flying from" value={origin} onChange={setOrigin} />
          <CitySearch label="Flying to" value={destination} onChange={setDestination} />
        </div>

        <div>
          <p className="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">Arrival / First night date</p>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="glass-card rounded-2xl px-4 py-3 text-sm text-on-surface bg-transparent outline-none w-full sm:w-auto"
          />
        </div>

        {/* Summary Strip */}
        {result && origin && destination && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-surface-container/40 rounded-2xl p-4 text-center">
              <p className="font-mono text-2xl font-bold text-[#c6bfff]">
                {absHours === 0 ? '0' : `${absHours > 0 ? '+' : ''}${result.hoursDiff}`}h
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Time Zone Shift</p>
            </div>
            <div className="bg-surface-container/40 rounded-2xl p-4 text-center">
              {result.direction ? (
                <>
                  <p className="font-mono text-2xl font-bold" style={{ color: result.direction === 'east' ? '#ff6b6b' : '#46eae5' }}>
                    {result.direction === 'east' ? '← East' : '→ West'}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {result.direction === 'east' ? 'Harder — delays clock' : 'Easier — advances clock'}
                  </p>
                </>
              ) : (
                <p className="text-sm text-on-surface-variant mt-2">Same time zone</p>
              )}
            </div>
            <div className="bg-surface-container/40 rounded-2xl p-4 text-center">
              <p className="font-mono text-2xl font-bold text-[#f9ca24]">
                {result.recoveryDays > 0 ? `~${result.recoveryDays}` : '0'}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Days to Fully Adjust</p>
            </div>
          </div>
        )}

        {/* Same timezone */}
        {result && result.hoursDiff === 0 && (
          <div className="mt-6 text-center py-6">
            <p className="text-2xl mb-2">✈️</p>
            <p className="text-sm font-semibold text-on-surface">No jet lag — same time zone!</p>
            <p className="text-xs text-on-surface-variant mt-1">Your body clock won&apos;t need to adjust.</p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Recovery Plan Timeline */}
      {/* ------------------------------------------------------------------ */}
      {result && result.plan.length > 0 && (
        <div className="mb-12">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
            Your {result.recoveryDays}-Day Recovery Plan
          </h2>

          <div className="space-y-3">
            {result.plan.map((day, i) => (
              <div
                key={day.day}
                className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Day number */}
                <div className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold font-mono"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #6c5ce7, #00cec9)'
                      : i === result.plan.length - 1
                        ? 'linear-gradient(135deg, #f9ca24, #f0932b)'
                        : 'rgba(255,255,255,0.08)',
                    color: (i === 0 || i === result.plan.length - 1) ? '#fff' : '#c6bfff',
                  }}
                >
                  {i === 0 ? '✈️' : i === result.plan.length - 1 ? '✅' : `D${day.day}`}
                </div>

                {/* Times */}
                <div className="flex gap-4 shrink-0">
                  <div className="text-center">
                    <Moon className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#c6bfff]" />
                    <p className="font-mono text-sm font-bold text-on-surface">{fmt12(day.bedtime)}</p>
                    <p className="text-[10px] text-on-surface-variant">Bedtime</p>
                  </div>
                  <div className="text-center">
                    <Sun className="w-3.5 h-3.5 mx-auto mb-0.5 text-[#f9ca24]" />
                    <p className="font-mono text-sm font-bold text-on-surface">{fmt12(day.wakeTime)}</p>
                    <p className="text-[10px] text-on-surface-variant">Wake</p>
                  </div>
                </div>

                {/* Label + tip */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface mb-0.5">{day.label}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{day.tip}</p>
                </div>

                {/* Focus badge */}
                <div className="shrink-0">
                  {day.focus === 'sunlight' && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold bg-yellow-500/20 text-yellow-300">
                      <Sun className="w-3 h-3" /> Seek light
                    </span>
                  )}
                  {day.focus === 'darkness' && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                      <Moon className="w-3 h-3" /> Avoid light
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-on-surface-variant text-center">
            Bedtimes shown in local destination time. Adjust by 15–30 min each day if the full shift feels too aggressive.
          </div>
        </div>
      )}

      {/* Prompt to select cities */}
      {!origin || !destination ? (
        <div className="glass-card rounded-3xl p-8 text-center mb-12">
          <Plane className="w-8 h-8 mx-auto mb-3 text-[#c6bfff]" />
          <p className="text-sm text-on-surface-variant">
            Select both cities above to see your personalised jet lag recovery plan.
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Content */}
      {/* ------------------------------------------------------------------ */}
      <section className="space-y-10 max-w-3xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is Jet Lag — and Why Does It Happen?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Jet lag (formally called <strong className="text-on-surface">desynchronosis</strong>) occurs when your
              internal circadian clock is misaligned with the local time at your destination. Your circadian rhythm is
              an approximately 24-hour biological oscillator regulated by the suprachiasmatic nucleus (SCN) in the
              hypothalamus. It controls sleep timing, cortisol peaks, digestion, body temperature, and dozens of other
              physiological processes.
            </p>
            <p>
              When you cross multiple time zones rapidly by air, your destination&apos;s light-dark cycle suddenly
              conflicts with your body&apos;s entrained schedule. The result: you feel alert at 2 AM, exhausted at noon,
              your digestive system fires at wrong times, and your cognitive performance is measurably impaired. The
              more time zones crossed, the more severe the misalignment.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why Eastward Travel Is Harder Than Westward
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Your circadian clock naturally runs slightly longer than 24 hours — closer to 24.2 hours on average. This
              means it is biologically easier to <strong className="text-on-surface">delay</strong> your sleep
              (stay up later, as in westward travel) than to <strong className="text-on-surface">advance</strong> it
              (go to bed earlier, as in eastward travel).
            </p>
            <p>
              Eastward travel requires you to fall asleep earlier than your body wants to, which fights your natural
              rhythm. Research consistently shows eastward jet lag takes approximately <strong className="text-on-surface">50%
              longer to resolve</strong> than equivalent westward travel. This is why our calculator assigns 1.5 days of
              recovery per hour when traveling east, versus 1 day per hour heading west.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { dir: 'Westward ←', color: '#46eae5', rule: '~1 day per time zone', detail: 'Clock delay — goes with your natural drift' },
                { dir: 'Eastward →', color: '#ff6b6b', rule: '~1.5 days per time zone', detail: 'Clock advance — fights your natural drift' },
              ].map((item) => (
                <div key={item.dir} className="glass-card rounded-2xl p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: item.color }}>{item.dir}</p>
                  <p className="font-mono text-xs text-on-surface mb-1">{item.rule}</p>
                  <p className="text-xs text-on-surface-variant">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Light: The Most Powerful Jet Lag Tool
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Light exposure is the most powerful zeitgeber (time-giver) for the circadian system. Light hitting the
              retina sends signals via the retinohypothalamic tract directly to the SCN, which adjusts melatonin
              secretion accordingly. The timing of light exposure determines whether your clock advances or delays:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Light in the morning</strong> (after your temperature minimum) advances your clock — helpful for eastward travel.</li>
              <li><strong className="text-on-surface">Light in the evening</strong> delays your clock — helpful for westward travel.</li>
              <li><strong className="text-on-surface">Avoiding light at the wrong time</strong> is equally important — use blackout curtains or blue-light blocking glasses when light would push your clock in the wrong direction.</li>
            </ul>
            <p>
              A practical rule: after crossing more than 6 time zones eastward, avoid outdoor sunlight during the first
              morning at the destination (your body may interpret it as "evening" light and delay your clock further).
              Instead, seek bright light in the late morning.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Melatonin for Jet Lag: Timing Matters
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Low-dose melatonin (0.5–1 mg) taken at the destination&apos;s target bedtime is one of the most
              evidence-supported interventions for jet lag. A 2002 Cochrane review of 10 randomised trials found
              melatonin significantly reduced jet lag scores when taken correctly — but the timing must match the
              direction of travel:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Eastward travel</strong>: Take melatonin at destination bedtime, starting the night you arrive or even 3 nights before departure if preparing in advance.</li>
              <li><strong className="text-on-surface">Westward travel</strong>: Less evidence supports melatonin use; the natural clock drift works with you.</li>
            </ul>
            <p className="text-xs italic">
              Consult a healthcare provider before using melatonin, especially if you take other medications or have
              health conditions.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Pre-Flight Strategies That Actually Work
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              For trips of 5+ time zones, starting adjustment before departure can meaningfully reduce recovery time:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Eastward:</strong> Shift bedtime 1 hour earlier for 3 nights before departure. Seek morning light each day.</li>
              <li><strong className="text-on-surface">Westward:</strong> Shift bedtime 1 hour later for 3 nights before departure. Seek evening light.</li>
              <li><strong className="text-on-surface">Hydration:</strong> Cabin air humidity is typically 10–20%, well below optimal 40–60%. Dehydration worsens fatigue and disrupts sleep. Drink 250ml of water per hour of flight.</li>
              <li><strong className="text-on-surface">Alcohol:</strong> Avoid inflight alcohol — it increases arousals and reduces sleep quality significantly, compounding jet lag.</li>
              <li><strong className="text-on-surface">Caffeine timing:</strong> Use caffeine strategically. During an overnight eastward flight, avoid it in the last 8 hours of flight so you can sleep at destination bedtime.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/jet-lag-calculator" />
      </div>

      <AffiliateCard context="supplement" />
      <MedicalDisclaimer />
    </article>
  );
}
