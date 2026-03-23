'use client';

import { Check, Moon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime12h, formatDuration } from '@/utils/format-time';
import type { SleepRecommendation } from '@/utils/sleep-cycle';

interface ResultCardProps {
  recommendation: SleepRecommendation;
  isRecommended?: boolean;
  onClick?: () => void;
}

const qualityConfig = {
  optimal: {
    border: 'border-ds-secondary/20',
    bg: 'bg-surface-container-highest/50',
    hoverBg: 'hover:bg-surface-container-highest/70',
    badge: 'bg-ds-secondary/15 text-ds-secondary',
    accentDot: 'bg-ds-secondary',
    label: 'Optimal',
    icon: Check,
  },
  good: {
    border: 'border-primary-container/20',
    bg: 'bg-surface-container-highest/50',
    hoverBg: 'hover:bg-surface-container-highest/70',
    badge: 'bg-primary-container/15 text-ds-primary',
    accentDot: 'bg-primary-container',
    label: 'Good',
    icon: Moon,
  },
  minimum: {
    border: 'border-outline-variant/5',
    bg: 'bg-surface-container-low',
    hoverBg: 'hover:bg-surface-container/80',
    badge: 'bg-surface-container-high/50 text-on-surface-variant',
    accentDot: 'bg-on-surface-variant',
    label: 'Minimum',
    icon: Clock,
  },
} as const;

export default function ResultCard({
  recommendation,
  isRecommended = false,
  onClick,
}: ResultCardProps) {
  const { time, cycles, totalSleepMinutes, quality } = recommendation;
  const config = qualityConfig[quality];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'relative w-full p-5 rounded-xl border transition-all duration-200 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        config.bg,
        config.border,
        config.hoverBg,
        onClick && 'cursor-pointer active:scale-[0.98]',
        !onClick && 'cursor-default',
        isRecommended && 'ring-1 ring-ds-secondary/30',
      )}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-ds-secondary text-on-secondary">
          Recommended
        </span>
      )}

      <div className="flex items-center justify-between gap-4">
        {/* Left: time and quality */}
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {formatTime12h(time)}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-bold',
                config.badge,
              )}
            >
              <span
                className={cn('w-1.5 h-1.5 rounded-full', config.accentDot)}
              />
              {config.label}
            </span>
            <span className="text-xs text-on-surface-variant">
              {cycles} cycle{cycles !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Right: duration and icon */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-mono font-semibold text-on-surface tabular-nums">
              {formatDuration(totalSleepMinutes)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
              of sleep
            </p>
          </div>
          <div
            className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg transition-colors',
              quality === 'optimal'
                ? 'bg-ds-secondary/10 text-ds-secondary'
                : quality === 'good'
                  ? 'bg-primary-container/10 text-ds-primary'
                  : 'bg-surface-container-high/50 text-on-surface-variant',
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  );
}
