'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface HypnogramEntry {
  timestamp: string;
  stage: 'deep' | 'light' | 'rem' | 'awake';
  durationSec: number;
}

interface HypnogramProps {
  data: HypnogramEntry[] | null;
}

const STAGE_MAP: Record<string, number> = {
  awake: 4,
  rem: 3,
  light: 2,
  deep: 1,
};

const STAGE_LABELS: Record<number, string> = {
  1: 'Deep',
  2: 'Light',
  3: 'REM',
  4: 'Awake',
};

export function Hypnogram({ data }: HypnogramProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-xl bg-surface-container-high/50">
        <p className="text-sm text-on-surface-variant">
          No hypnogram data available. Connect a device to see your sleep stages.
        </p>
      </div>
    );
  }

  const chartData = data.map((entry) => ({
    time: new Date(entry.timestamp).getTime(),
    stage: STAGE_MAP[entry.stage] ?? 2,
  }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="hypnogramGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6c5ce7" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#6c5ce7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(val: number) => format(new Date(val), 'HH:mm')}
            tick={{ fill: '#8b8ba7', fontSize: 11 }}
            axisLine={{ stroke: '#1e1e4a' }}
            tickLine={false}
          />
          <YAxis
            domain={[0.5, 4.5]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(val: number) => STAGE_LABELS[val] ?? ''}
            tick={{ fill: '#8b8ba7', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            reversed
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12122a',
              border: '1px solid #1e1e4a',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            labelFormatter={(val) => format(new Date(val as number), 'HH:mm')}
            formatter={(value) => [STAGE_LABELS[value as number] ?? 'Unknown', 'Stage']}
          />
          <Area
            type="stepAfter"
            dataKey="stage"
            stroke="#6c5ce7"
            strokeWidth={2}
            fill="url(#hypnogramGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
