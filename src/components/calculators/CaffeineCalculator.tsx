'use client';

import { useState, useMemo, useCallback, useId, type ReactNode } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Area,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { X, Plus, Minus, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';
import TimePicker from '@/components/calculators/shared/TimePicker';
import { formatTime12h, timeToday } from '@/utils/format-time';
import {
  DRINK_PRESETS,
  SAFE_BEDTIME_CAFFEINE_MG,
  calculateCutoff,
  type CaffeineLogEntry,
  type CaffeineDrink,
} from '@/utils/caffeine-half-life';

interface LogEntryWithId extends CaffeineLogEntry {
  id: string;
  servings: number;
}

export default function CaffeineCalculator() {
  const baseId = useId();
  const [bedtime, setBedtime] = useState<Date>(() => timeToday(23, 0));
  const [log, setLog] = useState<LogEntryWithId[]>([]);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Clear highlight after animation
  const clearHighlight = useCallback(() => {
    setTimeout(() => setLastAddedId(null), 600);
  }, []);

  const addDrink = useCallback(
    (drink: CaffeineDrink) => {
      const id = `${baseId}-${Date.now()}`;
      setLog((prev) => [
        ...prev,
        { id, drink, consumedAt: new Date(), servings: 1 },
      ]);
      setLastAddedId(id);
      clearHighlight();
    },
    [baseId, clearHighlight],
  );

  const removeDrink = useCallback((id: string) => {
    setLog((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateServings = useCallback((id: string, delta: number) => {
    setLog((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, servings: Math.max(1, Math.min(10, e.servings + delta)) }
          : e,
      ),
    );
  }, []);

  const updateTime = useCallback((id: string, timeStr: string) => {
    setLog((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const next = new Date(e.consumedAt);
        next.setHours(hours, minutes, 0, 0);
        return { ...e, consumedAt: next };
      }),
    );
  }, []);

  // Expand servings into individual log entries for the calculation engine
  const expandedLog: CaffeineLogEntry[] = useMemo(() => {
    return log.flatMap((entry) =>
      Array.from({ length: entry.servings }, () => ({
        drink: entry.drink,
        consumedAt: entry.consumedAt,
      })),
    );
  }, [log]);

  const result = useMemo(
    () => calculateCutoff(bedtime, expandedLog),
    [bedtime, expandedLog],
  );

  // Chart data: transform decay curve into recharts-friendly format
  const chartData = useMemo(() => {
    return result.decayCurve.map((point) => ({
      time: point.time.getTime(),
      caffeine: Math.round(point.totalMg),
      label: formatTime12h(point.time),
    }));
  }, [result.decayCurve]);

  const caffeineColor =
    result.caffeineAtBedtime <= 50
      ? '#55efc4'
      : result.caffeineAtBedtime <= 100
        ? '#fdcb6e'
        : '#ff6b6b';

  const statusMessage =
    result.caffeineAtBedtime <= 50
      ? "You're in the clear! Caffeine should not affect your sleep."
      : result.caffeineAtBedtime <= 100
        ? 'You may have trouble falling asleep. Consider cutting off caffeine earlier.'
        : 'Caffeine will significantly impact your sleep quality and duration.';

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

      {/* Bedtime picker */}
      <div className="mb-8">
        <TimePicker value={bedtime} onChange={setBedtime} label="Your Bedtime" />
      </div>

      {/* Drink selection grid */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4">
          Add a drink
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DRINK_PRESETS.map((drink) => (
            <button
              key={drink.name}
              type="button"
              onClick={() => addDrink(drink)}
              className="glass-card rounded-xl p-3 cursor-pointer hover:bg-surface-container-high/50 transition-all text-center group active:scale-95"
            >
              <span className="text-2xl block mb-1" aria-hidden="true">
                {drink.icon}
              </span>
              <span className="text-xs font-semibold text-on-surface block">
                {drink.name}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {drink.caffeineContentMg} mg
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Drink log */}
      {log.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4">
            Today&apos;s caffeine log
          </p>
          <div className="space-y-2">
            {log.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'glass-card rounded-xl px-4 py-3 flex items-center gap-3 transition-all',
                  lastAddedId === entry.id &&
                    'ring-2 ring-[#46eae5]/40 bg-surface-container-high/30',
                )}
              >
                {/* Icon + name */}
                <span className="text-lg shrink-0" aria-hidden="true">
                  {entry.drink.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {entry.drink.name}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {entry.drink.caffeineContentMg * entry.servings} mg total
                  </p>
                </div>

                {/* Time input */}
                <input
                  type="time"
                  aria-label={`Time consumed for ${entry.drink.name}`}
                  value={`${entry.consumedAt.getHours().toString().padStart(2, '0')}:${entry.consumedAt.getMinutes().toString().padStart(2, '0')}`}
                  onChange={(e) => updateTime(entry.id, e.target.value)}
                  className="bg-surface-container-high/50 border border-outline-variant/20 rounded-lg px-2 py-1 text-xs text-on-surface font-mono w-[5.5rem] focus:outline-none focus:ring-1 focus:ring-primary-container"
                />

                {/* Servings */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Decrease servings"
                    onClick={() => updateServings(entry.id, -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface-container-high/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono text-on-surface w-5 text-center tabular-nums">
                    {entry.servings}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase servings"
                    onClick={() => updateServings(entry.id, 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface-container-high/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  aria-label={`Remove ${entry.drink.name}`}
                  onClick={() => removeDrink(entry.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {log.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center mb-8">
          <Coffee className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">
            Tap a drink above to start logging your caffeine intake.
          </p>
        </div>
      )}

      {/* Decay chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-2xl p-4 mt-6">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-4 px-2">
            Caffeine level over time
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="caffeineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#46eae5" />
                  <stop offset="100%" stopColor="#ff6b6b" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#46eae5" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#46eae5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(71,69,84,0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(ts: number) => formatTime12h(new Date(ts))}
                tick={{ fontSize: 10, fill: '#c8c4d7' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={60}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#c8c4d7' }}
                tickLine={false}
                axisLine={false}
                width={40}
                unit=" mg"
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(30,30,47,0.95)',
                  border: '1px solid rgba(71,69,84,0.3)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#e3e0f8',
                }}
                labelFormatter={(label: ReactNode) =>
                  typeof label === 'number'
                    ? formatTime12h(new Date(label))
                    : String(label ?? '')
                }
                formatter={(value: unknown) => [
                  `${value ?? 0} mg`,
                  'Caffeine',
                ]}
              />
              {/* Safe threshold line */}
              <ReferenceLine
                y={SAFE_BEDTIME_CAFFEINE_MG}
                stroke="#fdcb6e"
                strokeDasharray="6 4"
                strokeWidth={1}
                label={{
                  value: `${SAFE_BEDTIME_CAFFEINE_MG} mg safe`,
                  position: 'right',
                  fontSize: 10,
                  fill: '#fdcb6e',
                }}
              />
              {/* Bedtime line */}
              <ReferenceLine
                x={bedtime.getTime()}
                stroke="#c6bfff"
                strokeDasharray="6 4"
                strokeWidth={1}
                label={{
                  value: 'Bedtime',
                  position: 'top',
                  fontSize: 10,
                  fill: '#c6bfff',
                }}
              />
              <Area
                type="monotone"
                dataKey="caffeine"
                fill="url(#areaGradient)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="caffeine"
                stroke="url(#caffeineGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: '#46eae5',
                  stroke: '#121222',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Results */}
      {log.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mt-6">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label mb-5">
            Your results
          </p>

          {/* Caffeine at bedtime */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm text-on-surface-variant">
              Caffeine at bedtime:
            </span>
            <span
              className="font-mono text-2xl font-bold"
              style={{ color: caffeineColor }}
            >
              {Math.round(result.caffeineAtBedtime)} mg
            </span>
          </div>

          {/* Status message */}
          <p
            className="text-sm mb-6"
            style={{ color: caffeineColor }}
          >
            {statusMessage}
          </p>

          {/* Last safe coffee time */}
          <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5 text-[#c6bfff]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                Last safe coffee
              </p>
              <p className="font-mono text-xl font-bold text-on-surface">
                {formatTime12h(result.cutoffTime)}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Based on a standard 95 mg drip coffee
              </p>
            </div>
          </div>

          {/* Per-drink cutoff recommendations */}
          {result.perDrinkStatus.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-on-surface-variant mb-3">
                Caffeine at bedtime per drink
              </p>
              <div className="space-y-1.5">
                {result.perDrinkStatus.map((status, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-surface-container-high/30 transition-colors"
                  >
                    <span className="text-on-surface-variant">
                      {status.drink.icon} {status.drink.name} at{' '}
                      {formatTime12h(status.consumedAt)}
                    </span>
                    <span
                      className="font-mono font-semibold"
                      style={{
                        color: status.isSafe ? '#55efc4' : '#ff6b6b',
                      }}
                    >
                      {Math.round(status.mgAtBedtime)} mg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
