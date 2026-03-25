'use client';

import { useState, useMemo, useEffect } from 'react';
import { Zap, Battery, Moon, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import TimePicker from '@/components/calculators/shared/TimePicker';
import { calculateNap, type NapType } from '@/utils/nap-optimizer';
import { formatTime12h, formatDuration, timeToday } from '@/utils/format-time';

interface NapTypeOption {
  type: NapType;
  label: string;
  duration: string;
  icon: typeof Zap;
  accentColor: string;
  ringColor: string;
  bgColor: string;
}

const NAP_TYPES: NapTypeOption[] = [
  {
    type: 'power',
    label: 'Power Nap',
    duration: '20 min',
    icon: Zap,
    accentColor: 'text-[#46eae5]',
    ringColor: 'ring-[#46eae5]/60',
    bgColor: 'bg-[#46eae5]/10',
  },
  {
    type: 'recovery',
    label: 'Recovery Nap',
    duration: '60 min',
    icon: Battery,
    accentColor: 'text-[#6c5ce7]',
    ringColor: 'ring-[#6c5ce7]/60',
    bgColor: 'bg-[#6c5ce7]/10',
  },
  {
    type: 'full_cycle',
    label: 'Full Cycle',
    duration: '90 min',
    icon: Moon,
    accentColor: 'text-[#c5c0ff]',
    ringColor: 'ring-[#c5c0ff]/60',
    bgColor: 'bg-[#c5c0ff]/10',
  },
];

/**
 * Convert a Date to a fractional hour (0-24) for the timeline bar.
 * Hours before 6 AM are treated as 24+ so the bar covers 6 AM - 6 AM next day.
 */
function toTimelineHour(date: Date): number {
  const h = date.getHours() + date.getMinutes() / 60;
  return h < 6 ? h + 24 : h;
}

/** Convert a timeline hour to a percentage position on the 6 AM - 12 AM bar. */
function hourToPercent(hour: number): number {
  // Bar spans 6 AM (hour 6) to 12 AM (hour 24) = 18 hours
  const TIMELINE_START = 6;
  const TIMELINE_HOURS = 18;
  return Math.max(0, Math.min(100, ((hour - TIMELINE_START) / TIMELINE_HOURS) * 100));
}

// Sleep stage breakdown per nap type
// Each segment: [stage label, relative width %, color, opacity]
const NAP_STAGES: Record<NapType, Array<[string, number, string]>> = {
  power:      [['Light N1', 30, '#a29bfe'], ['Light N2', 70, '#6c5ce7']],
  recovery:   [['Light N1', 12, '#a29bfe'], ['Light N2', 38, '#6c5ce7'], ['Deep N3', 50, '#46eae5']],
  full_cycle: [['Light N1', 7, '#a29bfe'], ['Light N2', 23, '#6c5ce7'], ['Deep N3', 30, '#46eae5'], ['REM', 30, '#c6bfff'], ['Light N2', 10, '#6c5ce7']],
};

const NAP_STAGE_NOTES: Record<NapType, string> = {
  power:      'Stays in light sleep — wake up alert, no grogginess.',
  recovery:   'Hits some deep sleep — best for physical recovery, may feel groggy on wake.',
  full_cycle: 'Full light → deep → REM cycle — maximum restoration, wake at natural transition.',
};

function NapStagesDiagram({ napType }: { napType: NapType }) {
  const [show, setShow] = useState(false);
  const stages = NAP_STAGES[napType];
  useEffect(() => { setShow(false); const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, [napType]);

  return (
    <div className="glass-card rounded-2xl p-5 mt-6">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-3">
        Sleep stages during this nap
      </p>
      <div className="flex h-7 rounded-lg overflow-hidden gap-0.5">
        {stages.map(([label, width, color], i) => (
          <div
            key={i}
            className="flex items-center justify-center text-[10px] font-semibold text-white/80 rounded-sm transition-all duration-700 overflow-hidden"
            style={{
              width: show ? `${width}%` : '0%',
              background: color,
              transitionDelay: `${i * 80}ms`,
            }}
          >
            {width >= 20 ? label : ''}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {stages.map(([label, , color], i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[11px] text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-on-surface-variant/60 mt-2">{NAP_STAGE_NOTES[napType]}</p>
    </div>
  );
}

export default function NapCalculator() {
  const [currentTime, setCurrentTime] = useState<Date>(() => {
    const now = new Date();
    // Round to nearest 5 minutes
    const mins = Math.round(now.getMinutes() / 5) * 5;
    now.setMinutes(mins, 0, 0);
    return now;
  });
  const [bedtime, setBedtime] = useState<Date>(() => timeToday(23, 0));
  const [selectedType, setSelectedType] = useState<NapType>('power');

  const result = useMemo(
    () => calculateNap(currentTime, bedtime, selectedType),
    [currentTime, bedtime, selectedType],
  );

  const selectedOption = NAP_TYPES.find((n) => n.type === selectedType)!;

  // Timeline calculations
  const napStartHour = toTimelineHour(result.startTime);
  const napEndHour = toTimelineHour(result.alarmTime);
  const bedtimeHour = toTimelineHour(bedtime);

  const napLeft = hourToPercent(napStartHour);
  const napWidth = hourToPercent(napEndHour) - napLeft;
  const bedLeft = hourToPercent(bedtimeHour);
  // Bedtime block extends to end of bar (representing sleep through the night)
  const bedWidth = Math.max(0, 100 - bedLeft);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

      {/* Time inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <TimePicker
          value={currentTime}
          onChange={setCurrentTime}
          label="Current time"
        />
        <TimePicker
          value={bedtime}
          onChange={setBedtime}
          label="Bedtime tonight"
        />
      </div>

      {/* Nap type selector */}
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4 text-center">
        Choose your nap type
      </p>
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {NAP_TYPES.map((option) => {
          const isSelected = selectedType === option.type;
          const Icon = option.icon;

          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setSelectedType(option.type)}
              aria-pressed={isSelected}
              className={cn(
                'glass-card rounded-2xl p-4 cursor-pointer transition-all text-center',
                'hover:bg-surface-container-high/50',
                isSelected && `ring-2 ${option.ringColor} ${option.bgColor}`,
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 mx-auto mb-2 transition-colors',
                  isSelected ? option.accentColor : 'text-on-surface-variant',
                )}
              />
              <p
                className={cn(
                  'font-headline font-bold text-sm mb-0.5 transition-colors',
                  isSelected ? 'text-on-surface' : 'text-on-surface-variant',
                )}
              >
                {option.label}
              </p>
              <p className="text-xs text-on-surface-variant">{option.duration}</p>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="glass-card rounded-2xl p-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Start time */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-2">
              Start your nap at
            </p>
            <p className="font-mono text-4xl md:text-5xl font-bold text-on-surface tabular-nums">
              {formatTime12h(result.startTime)}
            </p>
          </div>

          {/* Alarm time */}
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-2">
              Set your alarm for
            </p>
            <p className={cn(
              'font-mono text-4xl md:text-5xl font-bold tabular-nums',
              selectedOption.accentColor,
            )}>
              {formatTime12h(result.alarmTime)}
            </p>
          </div>
        </div>

        {/* Duration + description */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-on-surface-variant" />
          <p className="text-sm text-on-surface-variant">
            <span className="font-bold text-on-surface">{formatDuration(result.durationMinutes)}</span>
            {' '}total (includes ~5 min to fall asleep)
          </p>
        </div>

        <p className="text-sm text-on-surface-variant text-center leading-relaxed max-w-lg mx-auto">
          {result.description}
        </p>

        {/* Warning banner */}
        {result.sleepImpactWarning && (
          <div className="rounded-xl p-4 bg-[#fdcb6e]/10 border border-[#fdcb6e]/20 text-[#fdcb6e] mt-5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Napping after 3 PM may make it harder to fall asleep tonight. Consider a shorter nap or moving your nap earlier in the day.
            </p>
          </div>
        )}
      </div>

      {/* Sleep stage diagram */}
      <NapStagesDiagram napType={selectedType} />

      {/* Day timeline */}
      <div className="mt-8">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-3 text-center">
          Your day at a glance
        </p>
        <div className="relative">
          {/* Background bar */}
          <div className="h-8 rounded-full bg-surface-container-high/60 relative overflow-hidden">
            {/* Nap highlight */}
            {napWidth > 0 && (
              <div
                className="absolute top-0 bottom-0 rounded-full bg-[#46eae5]/30 border border-[#46eae5]/40 transition-all duration-300"
                style={{ left: `${napLeft}%`, width: `${Math.max(napWidth, 1)}%` }}
                aria-label={`Nap from ${formatTime12h(result.startTime)} to ${formatTime12h(result.alarmTime)}`}
              />
            )}

            {/* Bedtime highlight */}
            {bedWidth > 0 && (
              <div
                className="absolute top-0 bottom-0 rounded-r-full bg-[#6c5ce7]/30 border border-[#6c5ce7]/40 transition-all duration-300"
                style={{ left: `${bedLeft}%`, width: `${bedWidth}%` }}
                aria-label={`Bedtime from ${formatTime12h(bedtime)}`}
              />
            )}
          </div>

          {/* Time labels */}
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-on-surface-variant font-mono">6 AM</span>
            <span className="text-[10px] text-on-surface-variant font-mono">12 PM</span>
            <span className="text-[10px] text-on-surface-variant font-mono">6 PM</span>
            <span className="text-[10px] text-on-surface-variant font-mono">12 AM</span>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#46eae5]/50 border border-[#46eae5]/60" />
              <span className="text-xs text-on-surface-variant">Nap</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6c5ce7]/50 border border-[#6c5ce7]/60" />
              <span className="text-xs text-on-surface-variant">Bedtime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
