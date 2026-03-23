'use client';

import { useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime12h } from '@/utils/format-time';

interface TimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const rawHours = value.getHours();
  const hour12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const minute = value.getMinutes();
  const period: 'AM' | 'PM' = rawHours >= 12 ? 'PM' : 'AM';

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const buildDate = useCallback(
    (h12: number, m: number, p: 'AM' | 'PM') => {
      let h24 = h12 % 12;
      if (p === 'PM') h24 += 12;
      const next = new Date(value);
      next.setHours(h24, m, 0, 0);
      return next;
    },
    [value],
  );

  const incrementHour = () => {
    const next = hour12 === 12 ? 1 : hour12 + 1;
    onChange(buildDate(next, minute, period));
  };

  const decrementHour = () => {
    const next = hour12 === 1 ? 12 : hour12 - 1;
    onChange(buildDate(next, minute, period));
  };

  const incrementMinute = () => {
    const next = (minute + 5) % 60;
    onChange(buildDate(hour12, next, period));
  };

  const decrementMinute = () => {
    const next = (minute - 5 + 60) % 60;
    onChange(buildDate(hour12, next, period));
  };

  const togglePeriod = (newPeriod: 'AM' | 'PM') => {
    if (newPeriod !== period) {
      onChange(buildDate(hour12, minute, newPeriod));
    }
  };

  // Scroll wheel support for hour/minute columns
  const handleHourWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) incrementHour();
      else decrementHour();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hour12, minute, period],
  );

  const handleMinuteWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) incrementMinute();
      else decrementMinute();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hour12, minute, period],
  );

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 w-full max-w-sm mx-auto">
      {/* Label */}
      {label && (
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4 text-center">
          {label}
        </p>
      )}

      {/* Large time display */}
      <p
        className="text-center font-mono text-lg text-on-surface-variant mb-5 select-none"
        aria-live="polite"
      >
        {formatTime12h(value)}
      </p>

      {/* Picker columns */}
      <div className="flex items-center justify-center gap-3">
        {/* Hour column */}
        <div
          ref={hourRef}
          className="flex flex-col items-center"
          onWheel={handleHourWheel}
        >
          <button
            type="button"
            onClick={incrementHour}
            aria-label="Increase hour"
            className="flex items-center justify-center w-12 h-12 rounded-xl
              text-on-surface-variant hover:text-on-surface
              hover:bg-surface-container-high/60 transition-colors active:scale-90"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <span className="text-3xl font-bold font-mono text-on-surface tabular-nums w-14 text-center select-none">
            {hour12.toString().padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={decrementHour}
            aria-label="Decrease hour"
            className="flex items-center justify-center w-12 h-12 rounded-xl
              text-on-surface-variant hover:text-on-surface
              hover:bg-surface-container-high/60 transition-colors active:scale-90"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <span className="text-3xl font-bold font-mono text-on-surface-variant select-none pb-0.5">
          :
        </span>

        {/* Minute column */}
        <div
          ref={minuteRef}
          className="flex flex-col items-center"
          onWheel={handleMinuteWheel}
        >
          <button
            type="button"
            onClick={incrementMinute}
            aria-label="Increase minute"
            className="flex items-center justify-center w-12 h-12 rounded-xl
              text-on-surface-variant hover:text-on-surface
              hover:bg-surface-container-high/60 transition-colors active:scale-90"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <span className="text-3xl font-bold font-mono text-on-surface tabular-nums w-14 text-center select-none">
            {minute.toString().padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={decrementMinute}
            aria-label="Decrease minute"
            className="flex items-center justify-center w-12 h-12 rounded-xl
              text-on-surface-variant hover:text-on-surface
              hover:bg-surface-container-high/60 transition-colors active:scale-90"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* AM/PM toggle */}
        <div className="flex flex-col gap-1.5 ml-2">
          <button
            type="button"
            onClick={() => togglePeriod('AM')}
            aria-label="Set AM"
            aria-pressed={period === 'AM'}
            className={cn(
              'w-14 h-10 rounded-lg text-xs font-bold font-label uppercase tracking-wider transition-all',
              period === 'AM'
                ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                : 'bg-surface-container-high/40 text-on-surface-variant hover:bg-surface-container-high/70',
            )}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => togglePeriod('PM')}
            aria-label="Set PM"
            aria-pressed={period === 'PM'}
            className={cn(
              'w-14 h-10 rounded-lg text-xs font-bold font-label uppercase tracking-wider transition-all',
              period === 'PM'
                ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                : 'bg-surface-container-high/40 text-on-surface-variant hover:bg-surface-container-high/70',
            )}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
