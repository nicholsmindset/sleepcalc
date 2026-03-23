'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { SleepPhase } from '@/utils/sleep-cycle';

interface SleepCycleChartProps {
  phases: SleepPhase[];
  startTime?: Date;
  className?: string;
}

/** Map sleep stages to numeric depth values (higher = deeper). */
const STAGE_DEPTH: Record<SleepPhase['stage'], number> = {
  awake: 0,
  light: 1,
  rem: 2,
  deep: 3,
};

/** Display labels for the Y-axis ticks. */
const STAGE_LABELS: Record<number, string> = {
  0: 'Awake',
  1: 'Light',
  2: 'REM',
  3: 'Deep',
};

/** Colors for each stage (used in the gradient and tooltip). */
const STAGE_COLORS: Record<SleepPhase['stage'], string> = {
  awake: '#fdcb6e',
  light: '#c6bfff',
  rem: '#46eae5',
  deep: '#6c5ce7',
};

/** Format minutes offset as a time string (HH:MM) relative to startTime. */
function formatMinuteToTime(minute: number, startTime?: Date): string {
  if (startTime) {
    const d = new Date(startTime.getTime() + minute * 60_000);
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? 'p' : 'a';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m.toString().padStart(2, '0')}${period}`;
  }
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

interface DataPoint {
  minute: number;
  depth: number;
  stage: SleepPhase['stage'];
  label: string;
}

export default function SleepCycleChart({
  phases,
  startTime,
  className,
}: SleepCycleChartProps) {
  const data = useMemo<DataPoint[]>(() => {
    if (!phases.length) return [];

    const points: DataPoint[] = [];

    for (const phase of phases) {
      const depth = STAGE_DEPTH[phase.stage];

      // Start of phase
      points.push({
        minute: phase.startMinute,
        depth,
        stage: phase.stage,
        label: formatMinuteToTime(phase.startMinute, startTime),
      });

      // End of phase (just before next starts)
      points.push({
        minute: phase.startMinute + phase.durationMinutes,
        depth,
        stage: phase.stage,
        label: formatMinuteToTime(
          phase.startMinute + phase.durationMinutes,
          startTime,
        ),
      });
    }

    return points;
  }, [phases, startTime]);

  const totalMinutes = useMemo(() => {
    if (!phases.length) return 0;
    const last = phases[phases.length - 1];
    return last.startMinute + last.durationMinutes;
  }, [phases]);

  if (!data.length) return null;

  return (
    <div className={cn('w-full', className)} style={{ minHeight: 200 }}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <defs>
            <linearGradient id="sleepDepthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c5ce7" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#46eae5" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(71, 69, 84, 0.2)"
            vertical={false}
          />

          <XAxis
            dataKey="minute"
            type="number"
            domain={[0, totalMinutes]}
            tickFormatter={(m: number) =>
              formatMinuteToTime(m, startTime)
            }
            tick={{ fill: '#c8c4d7', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(71, 69, 84, 0.3)' }}
            tickLine={false}
            interval="preserveStartEnd"
            tickCount={6}
          />

          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v: number) => STAGE_LABELS[v] ?? ''}
            tick={{ fill: '#c8c4d7', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={42}
            reversed
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as DataPoint;
              const color = STAGE_COLORS[point.stage];
              return (
                <div className="glass-card rounded-lg px-3 py-2 text-xs border border-outline-variant/20 shadow-lg">
                  <p className="text-on-surface-variant mb-0.5">
                    {point.label}
                  </p>
                  <p className="font-bold capitalize" style={{ color }}>
                    {point.stage}
                  </p>
                </div>
              );
            }}
          />

          <Area
            type="stepAfter"
            dataKey="depth"
            stroke="#6c5ce7"
            strokeWidth={2}
            fill="url(#sleepDepthGrad)"
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
