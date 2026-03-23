'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import type { SleepSession } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

interface TrendChartsProps {
  sessions: SleepSession[];
}

type Range = '7d' | '30d' | '90d';
type Metric = 'duration' | 'efficiency' | 'deep';

const RANGE_DAYS: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90 };

const METRICS: { key: Metric; label: string; color: string; unit: string }[] = [
  { key: 'duration', label: 'Duration', color: '#6c5ce7', unit: 'min' },
  { key: 'efficiency', label: 'Efficiency', color: '#46eae5', unit: '%' },
  { key: 'deep', label: 'Deep Sleep', color: '#a29bfe', unit: 'min' },
];

export function TrendCharts({ sessions }: TrendChartsProps) {
  const [range, setRange] = useState<Range>('7d');
  const [metric, setMetric] = useState<Metric>('duration');

  if (sessions.length < 2) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-sm text-on-surface-variant">
          Need at least 2 nights of data to show trends.
        </p>
      </div>
    );
  }

  const cutoff = Date.now() - RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
  const filtered = sessions
    .filter((s) => !s.is_nap && new Date(s.bedtime_start).getTime() >= cutoff)
    .sort((a, b) => new Date(a.bedtime_start).getTime() - new Date(b.bedtime_start).getTime());

  const chartData = filtered.map((s) => ({
    date: new Date(s.bedtime_start).getTime(),
    duration: s.total_duration_min ?? 0,
    efficiency: s.efficiency ? Math.round(s.efficiency) : 0,
    deep: s.deep_min ?? 0,
  }));

  const currentMetric = METRICS.find((m) => m.key === metric)!;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-bold text-on-surface font-headline">Trends</h3>
        <div className="flex gap-1 bg-surface-container-high rounded-lg p-1">
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                range === r
                  ? 'bg-primary text-white'
                  : 'text-on-surface-variant hover:text-on-surface',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              metric === m.key
                ? 'bg-surface-container-highest text-on-surface'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e4a" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(val: number) => format(new Date(val), range === '7d' ? 'EEE' : 'M/d')}
              tick={{ fill: '#8b8ba7', fontSize: 11 }}
              axisLine={{ stroke: '#1e1e4a' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8b8ba7', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={metric === 'efficiency' ? [0, 100] : ['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#12122a',
                border: '1px solid #1e1e4a',
                borderRadius: '12px',
                fontSize: '12px',
              }}
              labelFormatter={(val) => format(new Date(val as number), 'EEE, MMM d')}
              formatter={(value) => [`${value} ${currentMetric.unit}`, currentMetric.label]}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={currentMetric.color}
              strokeWidth={2}
              dot={{ fill: currentMetric.color, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
