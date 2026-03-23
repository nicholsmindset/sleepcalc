'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Sun,
  Sunset,
  Moon,
  RotateCcw,
  Car,
  Lightbulb,
  Clock,
  ArrowRight,
  SplitSquareHorizontal,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react';
import TimePicker from '@/components/calculators/shared/TimePicker';
import ResultCard from '@/components/calculators/shared/ResultCard';
import { cn } from '@/lib/utils';
import {
  calculateBedtimes,
  calculateWakeUpTimes,
  DEFAULT_CYCLE_DURATION,
  DEFAULT_SLEEP_LATENCY,
} from '@/utils/sleep-cycle';
import { timeToday, formatTime12h, formatDuration } from '@/utils/format-time';
import type { SleepRecommendation } from '@/utils/sleep-cycle';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ShiftType = 'day' | 'evening' | 'night' | 'rotating';
type DayShiftType = 'day' | 'evening' | 'night' | 'off';

interface RotatingDay {
  label: string;
  shortLabel: string;
  shift: DayShiftType;
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const SHIFT_TYPES = [
  { id: 'day' as const, label: 'Day', icon: Sun },
  { id: 'evening' as const, label: 'Evening', icon: Sunset },
  { id: 'night' as const, label: 'Night', icon: Moon },
  { id: 'rotating' as const, label: 'Rotating', icon: RotateCcw },
] as const;

const DAY_SHIFT_OPTIONS = [
  { id: 'day' as const, label: 'Day', short: 'D', icon: Sun },
  { id: 'evening' as const, label: 'Eve', short: 'E', icon: Sunset },
  { id: 'night' as const, label: 'Night', short: 'N', icon: Moon },
  { id: 'off' as const, label: 'Off', short: 'Off', icon: Clock },
] as const;

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SHIFT_DEFAULTS: Record<Exclude<ShiftType, 'rotating'>, { startH: number; startM: number; endH: number; endM: number }> = {
  day:     { startH: 7,  startM: 0, endH: 15, endM: 0 },
  evening: { startH: 15, startM: 0, endH: 23, endM: 0 },
  night:   { startH: 19, startM: 0, endH: 7,  endM: 0 },
};

const SHIFT_TIPS: Record<Exclude<ShiftType, 'rotating'>, { icon: typeof Lightbulb; tips: string[] }> = {
  day: {
    icon: Lightbulb,
    tips: [
      'Get bright light exposure first thing in the morning to anchor your circadian rhythm.',
      'Keep a consistent bedtime even on days off -- your body clock needs regularity.',
      'Limit screen brightness and use blue-light filters 1-2 hours before bed.',
      'Avoid heavy meals and intense exercise within 3 hours of your planned bedtime.',
    ],
  },
  evening: {
    icon: Lightbulb,
    tips: [
      'Wear sunglasses on your drive home to reduce bright light exposure before sleep.',
      'Use blackout curtains and a cool (65-68 F) bedroom for undisturbed morning sleep.',
      'Eat a moderate meal before your shift and avoid large meals after midnight.',
      'Ask family or housemates to respect your morning sleep window -- treat it like nighttime.',
    ],
  },
  night: {
    icon: Lightbulb,
    tips: [
      'Use blackout curtains, an eye mask, and earplugs for daytime sleep -- even small light leaks reduce melatonin.',
      'Wear blue-light-blocking (amber) glasses on your commute home to protect melatonin production.',
      'Get bright light exposure during the first half of your shift to maintain alertness and reset your clock.',
      'Consider a split sleep strategy: a longer main sleep after your shift plus a shorter nap before your next shift.',
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60_000);
}

function diffMinutes(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60_000);
}

/** Build a Date for a specific day offset and hour/minute */
function dayTime(dayOffset: number, hours: number, minutes: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/** Get the default shift times for a DayShiftType */
function getShiftWindow(shift: DayShiftType, dayOffset: number): { start: Date; end: Date } | null {
  if (shift === 'off') return null;
  const cfg = SHIFT_DEFAULTS[shift];
  const start = dayTime(dayOffset, cfg.startH, cfg.startM);
  let end = dayTime(dayOffset, cfg.endH, cfg.endM);
  if (end <= start) end = dayTime(dayOffset + 1, cfg.endH, cfg.endM);
  return { start, end };
}

/** Compute sleep window given shift end and commute, and the next shift start + commute */
function computeSleepWindow(
  shiftEnd: Date,
  commuteMin: number,
  nextShiftStart: Date | null,
  nextCommuteMin: number,
): { sleepStart: Date; sleepEnd: Date; availableMin: number } {
  const sleepStart = addMinutes(shiftEnd, commuteMin);
  const sleepEnd = nextShiftStart
    ? addMinutes(nextShiftStart, -nextCommuteMin)
    : addMinutes(sleepStart, 9 * 60); // default 9h window if no next shift
  const availableMin = Math.max(0, diffMinutes(sleepStart, sleepEnd));
  return { sleepStart, sleepEnd, availableMin };
}

/** Get cycle-aligned recommendations that fit within an available window */
function fitCyclesToWindow(
  sleepStart: Date,
  availableMin: number,
  latency: number = DEFAULT_SLEEP_LATENCY,
  cycleDuration: number = DEFAULT_CYCLE_DURATION,
): SleepRecommendation[] {
  const maxCycles = Math.floor((availableMin - latency) / cycleDuration);
  if (maxCycles < 1) return [];
  const clampMax = Math.min(maxCycles, 6);
  const clampMin = Math.max(1, Math.min(3, clampMax));

  const recs: SleepRecommendation[] = [];
  for (let c = clampMax; c >= clampMin; c--) {
    const totalSleepMin = c * cycleDuration;
    const wakeTime = addMinutes(sleepStart, latency + totalSleepMin);
    recs.push({
      time: wakeTime,
      cycles: c,
      totalSleepMinutes: totalSleepMin,
      quality: c >= 5 ? 'optimal' : c === 4 ? 'good' : 'minimum',
    });
  }
  return recs;
}

/** Determine if a day is a "transition day" in a rotation */
function isTransitionDay(schedule: RotatingDay[], index: number): boolean {
  if (index === 0) return false;
  const prev = schedule[index - 1].shift;
  const curr = schedule[index].shift;
  if (prev === curr) return false;
  if (curr === 'off' || prev === 'off') return false;
  return true;
}

function getTransitionAdvice(from: DayShiftType, to: DayShiftType): string {
  if (from === 'night' && to === 'day') {
    return 'Tough transition. After your last night shift, limit daytime sleep to 4 hours, then go to bed at your normal evening time to reset.';
  }
  if (from === 'day' && to === 'night') {
    return 'Take a 90-minute prophylactic nap in the late afternoon before your first night shift. Use blackout curtains.';
  }
  if (from === 'evening' && to === 'day') {
    return 'Go to bed as soon as possible after your evening shift. Set an alarm for at least 7 hours of sleep.';
  }
  if (from === 'day' && to === 'evening') {
    return 'You can sleep in a bit longer. Shift your bedtime 1-2 hours later to align with the evening schedule.';
  }
  if (from === 'evening' && to === 'night') {
    return 'Nap for 90 minutes before your first night shift. Avoid bright light in the late evening.';
  }
  if (from === 'night' && to === 'evening') {
    return 'After your last night shift, sleep until early afternoon, then stay up until a normal evening bedtime.';
  }
  return 'Adjust your sleep window gradually -- shift by 1-2 hours per day toward your new schedule.';
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ShiftWorkerCalculator() {
  /* --- State --- */
  const [shiftType, setShiftType] = useState<ShiftType>('night');
  const [shiftStart, setShiftStart] = useState<Date>(() => timeToday(19, 0));
  const [shiftEnd, setShiftEnd] = useState<Date>(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(7, 0, 0, 0);
    return t;
  });
  const [commuteMin, setCommuteMin] = useState(30);
  const [showSplitSleep, setShowSplitSleep] = useState(false);

  // Rotating schedule
  const [schedule, setSchedule] = useState<RotatingDay[]>(() =>
    WEEKDAYS.map((label, i) => ({
      label,
      shortLabel: SHORT_WEEKDAYS[i],
      shift: (i < 3 ? 'night' : i < 5 ? 'off' : 'day') as DayShiftType,
    })),
  );

  /* --- Shift type change handler --- */
  const handleShiftTypeChange = useCallback((type: ShiftType) => {
    setShiftType(type);
    if (type !== 'rotating') {
      const cfg = SHIFT_DEFAULTS[type];
      setShiftStart(timeToday(cfg.startH, cfg.startM));
      const end = new Date();
      if (cfg.endH < cfg.startH) {
        end.setDate(end.getDate() + 1);
      }
      end.setHours(cfg.endH, cfg.endM, 0, 0);
      setShiftEnd(end);
    }
    setShowSplitSleep(false);
  }, []);

  /* --- Commute slider handler --- */
  const handleCommuteChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCommuteMin(Number(e.target.value));
  }, []);

  /* --- Schedule day toggle --- */
  const handleScheduleChange = useCallback((dayIndex: number, newShift: DayShiftType) => {
    setSchedule((prev) => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], shift: newShift };
      return next;
    });
  }, []);

  /* --- Computed results for non-rotating shifts --- */
  const homeArrival = useMemo(() => addMinutes(shiftEnd, commuteMin), [shiftEnd, commuteMin]);

  const sleepWindow = useMemo(() => {
    const availableMin = Math.max(0, diffMinutes(homeArrival, addMinutes(shiftStart, -commuteMin)));
    // If the window is negative (shift start is before home arrival), wrap around 24h
    const adjusted = availableMin <= 0 ? availableMin + 24 * 60 : availableMin;
    return {
      sleepStart: homeArrival,
      sleepEnd: addMinutes(homeArrival, adjusted),
      availableMin: adjusted,
    };
  }, [homeArrival, shiftStart, commuteMin]);

  const cycleResults = useMemo<SleepRecommendation[]>(() => {
    if (shiftType === 'rotating') return [];
    return fitCyclesToWindow(sleepWindow.sleepStart, sleepWindow.availableMin);
  }, [shiftType, sleepWindow]);

  /* --- Pre-shift nap recommendation --- */
  const napRecommendation = useMemo(() => {
    if (shiftType === 'rotating') return null;
    const napEnd = addMinutes(shiftStart, -commuteMin - 30); // wake 30 min before leaving
    const napStart = addMinutes(napEnd, -90);
    // Only recommend if nap doesn't overlap with the sleep window
    if (napStart < sleepWindow.sleepEnd) {
      // Try a shorter 20-min power nap
      const shortNapStart = addMinutes(napEnd, -20);
      if (shortNapStart < sleepWindow.sleepEnd) return null;
      return {
        duration: 20,
        label: 'Power nap',
        start: shortNapStart,
        end: napEnd,
      };
    }
    return {
      duration: 90,
      label: 'Full-cycle nap',
      start: napStart,
      end: napEnd,
    };
  }, [shiftType, shiftStart, commuteMin, sleepWindow]);

  /* --- Split sleep strategy (night shift) --- */
  const splitSleep = useMemo(() => {
    if (shiftType !== 'night') return null;
    const mainStart = homeArrival;
    const mainEnd = addMinutes(mainStart, 5 * 60); // 5 hours
    const anchorStart = addMinutes(shiftStart, -commuteMin - 120); // 2h before leaving
    const anchorEnd = addMinutes(anchorStart, 90); // 1.5 hours
    if (anchorStart < mainEnd) return null; // not enough gap
    return { mainStart, mainEnd, anchorStart, anchorEnd };
  }, [shiftType, homeArrival, shiftStart, commuteMin]);

  /* --- Rotating schedule results --- */
  const rotatingResults = useMemo(() => {
    if (shiftType !== 'rotating') return [];
    return schedule.map((day, i) => {
      if (day.shift === 'off') {
        return { day, sleepRec: 'Rest day -- aim for 7-9 hours at your preferred time.', isTransition: false, transitionAdvice: null, cycleOptions: [] as SleepRecommendation[] };
      }
      const window = getShiftWindow(day.shift, i);
      if (!window) return { day, sleepRec: '', isTransition: false, transitionAdvice: null, cycleOptions: [] as SleepRecommendation[] };

      // Find next working day
      let nextWindow: { start: Date; end: Date } | null = null;
      for (let j = 1; j <= 7; j++) {
        const nextIdx = (i + j) % 7;
        const nw = getShiftWindow(schedule[nextIdx].shift, i + j);
        if (nw) {
          nextWindow = nw;
          break;
        }
      }

      const sw = computeSleepWindow(window.end, commuteMin, nextWindow?.start ?? null, commuteMin);
      const cycles = fitCyclesToWindow(sw.sleepStart, sw.availableMin);
      const best = cycles[0];
      const sleepRec = best
        ? `Sleep ${formatTime12h(sw.sleepStart)} - ${formatTime12h(best.time)} (${formatDuration(best.totalSleepMinutes)})`
        : `Sleep window: ${formatTime12h(sw.sleepStart)} (${formatDuration(sw.availableMin)} available)`;

      const transition = isTransitionDay(schedule, i);
      const transAdv = transition ? getTransitionAdvice(schedule[i - 1].shift, day.shift) : null;

      return { day, sleepRec, isTransition: transition, transitionAdvice: transAdv, cycleOptions: cycles };
    });
  }, [shiftType, schedule, commuteMin]);

  /* --- Shift-specific tips --- */
  const currentTips = shiftType !== 'rotating' ? SHIFT_TIPS[shiftType] : null;

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-3xl mx-auto relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-container/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary-container/10 blur-[120px] -z-10 rounded-full" />

      <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-6">
        Shift Worker Sleep Calculator
      </p>

      {/* ---- Shift type selector ---- */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {SHIFT_TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleShiftTypeChange(id)}
            className={cn(
              'glass-card rounded-xl p-3 cursor-pointer flex flex-col items-center gap-1.5 transition-all',
              shiftType === id
                ? 'ring-2 ring-ds-secondary/40 bg-surface-container-high/60'
                : 'hover:bg-surface-container-high/30',
            )}
            aria-pressed={shiftType === id}
          >
            <Icon className={cn(
              'w-5 h-5 transition-colors',
              shiftType === id ? 'text-ds-secondary' : 'text-on-surface-variant',
            )} />
            <span className={cn(
              'text-xs font-medium transition-colors',
              shiftType === id ? 'text-on-surface' : 'text-on-surface-variant',
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* ---- Time pickers (non-rotating) ---- */}
      {shiftType !== 'rotating' && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <TimePicker
            value={shiftStart}
            onChange={setShiftStart}
            label="Shift starts"
          />
          <TimePicker
            value={shiftEnd}
            onChange={setShiftEnd}
            label="Shift ends"
          />
        </div>
      )}

      {/* ---- Commute slider ---- */}
      <div className="mb-8">
        <label
          htmlFor="commute-time"
          className="flex items-center gap-2 text-xs text-on-surface-variant mb-3"
        >
          <Car className="w-4 h-4" />
          Commute time:{' '}
          <span className="font-mono font-semibold text-on-surface">
            {commuteMin} min
          </span>
        </label>
        <input
          id="commute-time"
          type="range"
          min={0}
          max={120}
          step={5}
          value={commuteMin}
          onChange={handleCommuteChange}
          className={cn(
            'w-full h-1.5 rounded-full appearance-none cursor-pointer',
            'bg-surface-container-high/60',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-primary-container',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ds-primary',
            '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-container/30',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary-container',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ds-primary',
            '[&::-moz-range-thumb]:cursor-pointer',
          )}
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant/50 mt-1 font-mono">
          <span>0 min</span>
          <span>120 min</span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* RESULTS: Non-rotating shifts                                     */}
      {/* ================================================================ */}
      {shiftType !== 'rotating' && (
        <div className="space-y-6">
          {/* Primary sleep window */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
              Your sleep window
            </p>
            <p className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
              {formatTime12h(sleepWindow.sleepStart)}
              <span className="text-on-surface-variant mx-2">
                <ArrowRight className="w-5 h-5 inline-block" />
              </span>
              {formatTime12h(sleepWindow.sleepEnd)}
            </p>
            <p className="text-sm text-on-surface-variant mt-1">
              {formatDuration(sleepWindow.availableMin)} available for sleep
            </p>
          </div>

          {/* Pre-shift nap */}
          {napRecommendation && (
            <div className="glass-card rounded-xl p-4 border-l-2 border-ds-secondary">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-ds-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {napRecommendation.label} before your shift
                  </p>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {napRecommendation.duration}-min nap at{' '}
                    <span className="font-mono font-semibold text-on-surface">
                      {formatTime12h(napRecommendation.start)}
                    </span>
                    {' '}&mdash; wake by{' '}
                    <span className="font-mono font-semibold text-on-surface">
                      {formatTime12h(napRecommendation.end)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sleep cycle options */}
          {cycleResults.length > 0 && (
            <div>
              <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
                Cycle-aligned wake times
              </p>
              <div className="grid gap-3">
                {cycleResults.map((rec) => (
                  <ResultCard
                    key={rec.cycles}
                    recommendation={rec}
                    isRecommended={rec.cycles === 5 || (cycleResults[0].cycles < 5 && rec.cycles === cycleResults[0].cycles)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Split sleep (night shift only) */}
          {splitSleep && (
            <div>
              <button
                type="button"
                onClick={() => setShowSplitSleep((v) => !v)}
                className={cn(
                  'w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 transition-all cursor-pointer',
                  showSplitSleep && 'ring-1 ring-ds-secondary/30',
                )}
              >
                <SplitSquareHorizontal className="w-5 h-5 text-ds-secondary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">
                    Split Sleep Strategy
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    An evidence-based alternative for night shift workers
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {showSplitSleep ? 'Hide' : 'Show'}
                </span>
              </button>

              {showSplitSleep && (
                <div className="glass-card rounded-2xl p-5 mt-3 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4 border-l-2 border-primary-container">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                        Main sleep
                      </p>
                      <p className="text-lg font-bold font-mono text-on-surface">
                        {formatTime12h(splitSleep.mainStart)} &ndash; {formatTime12h(splitSleep.mainEnd)}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">5 hours (3-4 cycles)</p>
                    </div>
                    <div className="glass-card rounded-xl p-4 border-l-2 border-ds-secondary">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">
                        Anchor sleep
                      </p>
                      <p className="text-lg font-bold font-mono text-on-surface">
                        {formatTime12h(splitSleep.anchorStart)} &ndash; {formatTime12h(splitSleep.anchorEnd)}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">1.5 hours (1 full cycle)</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Split sleep can be as effective as a single consolidated sleep for night workers.
                    The main sleep period captures most of your deep sleep, while the anchor nap before
                    your shift adds REM sleep and improves alertness. Research from the Journal of Sleep
                    Research shows this pattern can reduce fatigue-related errors by up to 34%.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          {currentTips && (
            <div>
              <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
                Tips for {shiftType} shift workers
              </p>
              <div className="space-y-3">
                {currentTips.tips.map((tip, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 border-l-2 border-ds-secondary">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-4 h-4 text-ds-secondary mt-0.5 shrink-0" />
                      <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* RESULTS: Rotating schedule                                       */}
      {/* ================================================================ */}
      {shiftType === 'rotating' && (
        <div className="space-y-6">
          {/* Schedule planner */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-ds-secondary" />
              <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
                Set your weekly rotation
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 space-y-2">
              {schedule.map((day, i) => (
                <div
                  key={day.label}
                  className={cn(
                    'flex items-center gap-3 py-2',
                    i < schedule.length - 1 && 'border-b border-outline-variant/5',
                  )}
                >
                  <span className="text-sm font-medium text-on-surface w-10 shrink-0">
                    {day.shortLabel}
                  </span>
                  <div className="flex gap-1.5 flex-1">
                    {DAY_SHIFT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleScheduleChange(i, opt.id)}
                        className={cn(
                          'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer',
                          day.shift === opt.id
                            ? 'bg-primary-container/40 text-on-surface ring-1 ring-ds-secondary/30'
                            : 'bg-surface-container-high/20 text-on-surface-variant hover:bg-surface-container-high/40',
                        )}
                        aria-pressed={day.shift === opt.id}
                      >
                        <span className="hidden sm:inline">{opt.label}</span>
                        <span className="sm:hidden">{opt.short}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotating results */}
          <div>
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
              Sleep recommendations for your rotation
            </p>
            <div className="space-y-3">
              {rotatingResults.map((result, i) => (
                <div
                  key={i}
                  className={cn(
                    'glass-card rounded-xl p-4',
                    result.isTransition && 'ring-1 ring-[#fdcb6e]/30',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-on-surface">
                          {result.day.label}
                        </span>
                        <span className={cn(
                          'text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md',
                          result.day.shift === 'day' && 'bg-[#fdcb6e]/15 text-[#fdcb6e]',
                          result.day.shift === 'evening' && 'bg-[#f0932b]/15 text-[#f0932b]',
                          result.day.shift === 'night' && 'bg-primary-container/15 text-ds-primary',
                          result.day.shift === 'off' && 'bg-ds-secondary/15 text-ds-secondary',
                        )}>
                          {result.day.shift}
                        </span>
                        {result.isTransition && (
                          <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-[#fdcb6e]/15 text-[#fdcb6e]">
                            Transition
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant">{result.sleepRec}</p>
                    </div>
                    {result.cycleOptions.length > 0 && (
                      <span className="text-xs font-mono text-on-surface-variant shrink-0">
                        {result.cycleOptions[0].cycles} cycles
                      </span>
                    )}
                  </div>

                  {result.isTransition && result.transitionAdvice && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/10 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#fdcb6e] mt-0.5 shrink-0" />
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {result.transitionAdvice}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* General rotating tips */}
          <div>
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
              Tips for rotating shift workers
            </p>
            <div className="space-y-3">
              {[
                'Forward rotation (Day > Evening > Night) is easier on your body than backward rotation. Ask your employer about scheduling options.',
                'Keep a consistent "anchor sleep" period of at least 4 hours that overlaps across all your shift types.',
                'Use strategic light exposure: bright light at the start of each shift, dim light before sleep regardless of the clock.',
                'On transition days, adjust your caffeine strategy -- cut caffeine 6-8 hours before your new sleep window.',
              ].map((tip, i) => (
                <div key={i} className="glass-card rounded-xl p-4 border-l-2 border-ds-secondary">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-ds-secondary mt-0.5 shrink-0" />
                    <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
