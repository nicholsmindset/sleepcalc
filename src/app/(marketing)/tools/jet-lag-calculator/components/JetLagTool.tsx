'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
  const factor = direction === 'east' ? 1.5 : 1.0;
  return Math.round(Math.abs(hoursDiff) * factor);
}

function buildRecoveryPlan(
  originOffset: number,
  destOffset: number,
  departureDate: string,
): DayPlan[] {
  let hoursDiff = destOffset - originOffset;
  while (hoursDiff > 12) hoursDiff -= 24;
  while (hoursDiff < -12) hoursDiff += 24;

  const direction: 'east' | 'west' = hoursDiff > 0 ? 'east' : 'west';
  const totalDays = Math.min(calcRecoveryDays(hoursDiff, direction), 10);
  const shiftPerDay = (hoursDiff * 60) / totalDays;

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
/*  JetLagTool — Interactive Calculator                                       */
/* -------------------------------------------------------------------------- */

export default function JetLagTool() {
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
    <>
      {/* Calculator Card */}
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

      {/* Recovery Plan Timeline */}
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
    </>
  );
}
