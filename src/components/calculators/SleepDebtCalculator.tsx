'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  AGE_RECOMMENDATIONS,
  type AgeRecommendation,
} from '@/utils/age-recommendations';
import {
  calculateSleepDebt,
  generateRecoveryPlan,
  type SleepDebtResult,
  type RecoveryPlan,
  type DailyLog,
} from '@/utils/sleep-debt';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Only show age groups relevant for self-reporting (teens+) */
const SELECTABLE_AGE_GROUPS = AGE_RECOMMENDATIONS.filter(
  (rec) => rec.minHours >= 7 || rec.ageGroup === 'Teen'
);

/** Generate ISO dates for the past 7 days */
function getPast7Dates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function getSeverityColor(severity: SleepDebtResult['severity']): string {
  switch (severity) {
    case 'none':
      return '#46eae5';
    case 'mild':
      return '#fdcb6e';
    case 'moderate':
      return '#f0932b';
    case 'severe':
      return '#ff6b6b';
  }
}

function getSeverityMessage(severity: SleepDebtResult['severity'], hours: number): string {
  switch (severity) {
    case 'none':
      return "You're in great shape. Your sleep over the past week matches or exceeds your recommended hours. Keep up the consistent schedule.";
    case 'mild':
      return `You've accumulated ${hours} hours of sleep debt this week. This is a manageable deficit that you can recover from in a few days by adding 1-2 extra hours of sleep per night. You may notice mild fatigue or reduced focus.`;
    case 'moderate':
      return `At ${hours} hours of accumulated sleep debt, you're likely experiencing noticeable effects: difficulty concentrating, mood changes, and increased appetite. Recovery will take about a week of consistently longer sleep. Avoid relying on caffeine to mask the fatigue.`;
    case 'severe':
      return `${hours} hours of sleep debt is a serious deficit. At this level, your immune function, reaction time, decision-making, and emotional regulation are all significantly impaired. Recovery requires a sustained, gradual approach over 2-3 weeks. Consider consulting a healthcare provider if this pattern is ongoing.`;
  }
}

function getSliderColor(value: number, recommended: number): string {
  const diff = recommended - value;
  if (diff <= 0) return '#46eae5';
  if (diff <= 1) return '#fdcb6e';
  return '#ff6b6b';
}

interface ChartDatum {
  day: string;
  deficit: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const isDeficit = value > 0;

  return (
    <div className="glass-card rounded-xl px-4 py-3 text-sm">
      <p className="text-on-surface font-bold mb-1">{label}</p>
      <p style={{ color: isDeficit ? '#ff6b6b' : '#46eae5' }}>
        {isDeficit ? `${value.toFixed(1)}h deficit` : `${Math.abs(value).toFixed(1)}h surplus`}
      </p>
    </div>
  );
}

/** Animated semicircle speedometer gauge for sleep debt */
function DebtGauge({ debtHours, severity }: { debtHours: number; severity: SleepDebtResult['severity'] }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [debtHours]);

  const maxDebt = 14;
  const clampedDebt = Math.min(debtHours, maxDebt);
  const pct = animated ? clampedDebt / maxDebt : 0;

  // Semicircle arc — from 180° to 0° (left to right)
  const cx = 110, cy = 100, r = 80;
  const startAngle = Math.PI; // 180°
  const endAngle = 0;         // 0°
  const angle = startAngle + pct * (endAngle - startAngle);
  // arc endpoints
  const arcStart = { x: cx + r * Math.cos(startAngle), y: cy + r * Math.sin(startAngle) };
  const arcEnd   = { x: cx + r * Math.cos(angle),      y: cy + r * Math.sin(angle) };
  const largeArc = pct > 0.5 ? 1 : 0;
  const arcPath  = `M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${arcEnd.x} ${arcEnd.y}`;

  // needle tip
  const needleAngle = startAngle + pct * (endAngle - startAngle);
  const nx = cx + (r - 8) * Math.cos(needleAngle);
  const ny = cy + (r - 8) * Math.sin(needleAngle);

  const color = getSeverityColor(severity);

  // zone colors on track (0=none, 1=mild, 2=moderate, 3=severe — at 0%, 30%, 60%, 85% of arc)
  const zoneColors = ['#46eae5', '#fdcb6e', '#f0932b', '#ff6b6b'];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 120" className="w-56 overflow-visible">
        {/* Track zones */}
        {[0, 1, 2, 3].map((zone) => {
          const zStart = zone * 0.25;
          const zEnd = zStart + 0.25;
          const a1 = startAngle + zStart * (endAngle - startAngle);
          const a2 = startAngle + zEnd   * (endAngle - startAngle);
          const p1 = { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) };
          const p2 = { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) };
          return (
            <path
              key={zone}
              d={`M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`}
              fill="none"
              stroke={zoneColors[zone]}
              strokeOpacity="0.2"
              strokeWidth="10"
              strokeLinecap="butt"
            />
          );
        })}

        {/* Progress arc */}
        {pct > 0.01 && (
          <path
            d={arcPath}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ transition: 'all 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        )}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={animated ? nx : cx + r * Math.cos(startAngle)}
          y2={animated ? ny : cy + r * Math.sin(startAngle)}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: 'all 1.4s cubic-bezier(0.34,1.56,0.64,1)', transformOrigin: `${cx}px ${cy}px` }}
        />
        <circle cx={cx} cy={cy} r="5" fill={color} />

        {/* Labels */}
        <text x="28" y="112" fill="rgba(200,196,215,0.5)" fontSize="9" textAnchor="middle">0h</text>
        <text x="192" y="112" fill="rgba(200,196,215,0.5)" fontSize="9" textAnchor="middle">{maxDebt}h</text>
      </svg>

      <div className="text-center -mt-2">
        <p className="font-mono text-4xl font-extrabold" style={{ color }}>
          {debtHours.toFixed(1)}h
        </p>
        <p className="text-xs uppercase tracking-widest font-semibold mt-1" style={{ color }}>
          {severity === 'none' ? 'No Debt' : `${severity} deficit`}
        </p>
      </div>
    </div>
  );
}

export default function SleepDebtCalculator() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeRecommendation>(
    AGE_RECOMMENDATIONS.find((r) => r.ageGroup === 'Adult') ?? AGE_RECOMMENDATIONS[7]
  );
  const [sleepHours, setSleepHours] = useState<number[]>(Array(7).fill(7.0));
  const [result, setResult] = useState<SleepDebtResult | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const recommended = selectedAgeGroup.recommendedHours;

  const handleSliderChange = useCallback((index: number, value: number) => {
    setSleepHours((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleCalculate = useCallback(() => {
    const dates = getPast7Dates();
    const logs: DailyLog[] = dates.map((date, i) => ({
      date,
      hoursSlept: sleepHours[i],
    }));

    const debtResult = calculateSleepDebt(logs, recommended);
    const plan = generateRecoveryPlan(debtResult.totalDebtHours);

    setResult(debtResult);
    setRecoveryPlan(plan);
    setHasCalculated(true);
  }, [sleepHours, recommended]);

  const chartData: ChartDatum[] = useMemo(() => {
    if (!result) return [];
    return result.dailyDeficits.map((d, i) => ({
      day: DAY_LABELS[i] ?? `Day ${i + 1}`,
      deficit: Math.round(d.deficit * 10) / 10,
    }));
  }, [result]);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

      {/* Age Group Selector */}
      <div className="mb-8">
        <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
          Your Age Group
        </p>
        <select
          value={selectedAgeGroup.ageGroup}
          onChange={(e) => {
            const match = AGE_RECOMMENDATIONS.find((r) => r.ageGroup === e.target.value);
            if (match) setSelectedAgeGroup(match);
          }}
          className="w-full md:w-auto bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/50 transition-all appearance-none cursor-pointer"
          aria-label="Select your age group"
        >
          {SELECTABLE_AGE_GROUPS.map((rec) => (
            <option key={rec.ageGroup} value={rec.ageGroup}>
              {rec.ageGroup} ({rec.ageRange}) — {rec.recommendedHours}h recommended
            </option>
          ))}
        </select>
        <p className="text-xs text-on-surface-variant mt-2">
          Recommended: <span className="text-[#46eae5] font-semibold">{recommended}h</span> per
          night (NSF guideline)
        </p>
      </div>

      {/* 7-Day Sleep Log */}
      <div className="mb-8">
        <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
          Past 7 Nights of Sleep
        </p>
        <div className="space-y-4">
          {DAY_LABELS.map((day, index) => {
            const value = sleepHours[index];
            const color = getSliderColor(value, recommended);
            const percent = (value / 14) * 100;

            return (
              <div key={day} className="flex items-center gap-4">
                <span className="text-on-surface-variant text-sm font-medium w-10 shrink-0">
                  {day}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={14}
                    step={0.5}
                    value={value}
                    onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                    aria-label={`Hours slept on ${day}`}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, rgba(71,69,84,0.3) ${percent}%, rgba(71,69,84,0.3) 100%)`,
                      accentColor: color,
                    }}
                  />
                  {/* Recommended marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-on-surface-variant/40 pointer-events-none"
                    style={{ left: `${(recommended / 14) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="text-sm font-mono font-semibold w-12 text-right shrink-0"
                  style={{ color }}
                >
                  {value.toFixed(1)}h
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-on-surface-variant/60 mt-3">
          The thin marker on each slider shows the recommended {recommended}h target.
        </p>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleCalculate}
          className="btn-gradient text-base px-10 py-3"
          aria-label="Calculate sleep debt"
        >
          Calculate Sleep Debt
        </button>
      </div>

      {/* Results Section */}
      {hasCalculated && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Total Sleep Debt Gauge */}
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
              Total Sleep Debt This Week
            </p>
            <DebtGauge debtHours={result.totalDebtHours} severity={result.severity} />
            {result.recoveryDays > 0 && (
              <p className="text-xs text-on-surface-variant mt-3">
                Estimated recovery: ~{result.recoveryDays} day{result.recoveryDays !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Severity Message */}
          <div className="glass-card rounded-2xl p-6">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {getSeverityMessage(result.severity, result.totalDebtHours)}
            </p>
          </div>

          {/* Daily Deficit Chart */}
          {chartData.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
                Daily Deficit / Surplus
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,69,84,0.2)" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#c8c4d7', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(71,69,84,0.3)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#c8c4d7', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(71,69,84,0.3)' }}
                      tickLine={false}
                      label={{
                        value: 'Hours',
                        angle: -90,
                        position: 'insideLeft',
                        offset: 20,
                        fill: '#c8c4d7',
                        fontSize: 11,
                      }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(71,69,84,0.1)' }}
                    />
                    <ReferenceLine y={0} stroke="rgba(71,69,84,0.4)" />
                    <Bar dataKey="deficit" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.deficit > 0 ? '#ff6b6b' : '#46eae5'}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-on-surface-variant/60 mt-3 text-center">
                Positive bars = hours under-slept. Negative bars = hours of surplus sleep.
              </p>
            </div>
          )}

          {/* Recovery Plan */}
          {recoveryPlan && recoveryPlan.days.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
                Your Recovery Plan ({recoveryPlan.totalRecoveryDays} days)
              </p>
              <p className="text-xs text-on-surface-variant mb-4">
                Gradually add extra sleep each night to pay back your debt without disrupting your
                circadian rhythm. Weekends allow slightly more catch-up.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recoveryPlan.days.map((day) => {
                  const date = new Date(day.date + 'T00:00:00');
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  return (
                    <div
                      key={day.date}
                      className="flex items-center justify-between bg-surface-container/50 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface-variant text-xs font-medium w-16">
                          {dayName} {dateStr}
                        </span>
                        {isWeekend && (
                          <span className="text-[10px] uppercase tracking-wider text-[#c6bfff] bg-primary-container/20 rounded-full px-2 py-0.5">
                            Weekend
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-on-surface">
                          {day.targetHours.toFixed(1)}h
                        </span>
                        <span className="text-[#46eae5] text-xs ml-2">
                          +{day.extraSleep.toFixed(1)}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
