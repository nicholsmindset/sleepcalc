'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/utils/format-time';

interface TimeWheelProps {
  bedtime?: Date;
  wakeTime?: Date;
  className?: string;
}

/** Deterministic 12-hour time format to avoid SSR/client mismatch. */
function formatTime12(date: Date): string {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const SIZE = 200;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 88;
const TRACK_RADIUS = 76;
const INNER_RADIUS = 58;
const MARKER_RADIUS = 6;

/** Convert a Date to an angle in degrees where 12 AM = 0 (top), clockwise. */
function timeToAngle(date: Date): number {
  const hours = date.getHours() + date.getMinutes() / 60;
  // 24-hour clock: 0h = top (0 deg), 12h = bottom (180 deg)
  return (hours / 24) * 360;
}

/** Convert degrees to radians. */
function degToRad(deg: number): number {
  return ((deg - 90) * Math.PI) / 180;
}

/** Get x,y point on a circle at a given angle and radius from center. */
function pointOnCircle(
  angleDeg: number,
  radius: number,
): { x: number; y: number } {
  const rad = degToRad(angleDeg);
  return {
    x: Math.round((CENTER + radius * Math.cos(rad)) * 100) / 100,
    y: Math.round((CENTER + radius * Math.sin(rad)) * 100) / 100,
  };
}

/**
 * Build an SVG arc path from startAngle to endAngle (clockwise).
 * Handles the case where the arc crosses 0 degrees (midnight).
 */
function describeArc(
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  let sweep = endAngle - startAngle;
  if (sweep < 0) sweep += 360;

  const largeArc = sweep > 180 ? 1 : 0;
  const start = pointOnCircle(startAngle, radius);
  const end = pointOnCircle(endAngle, radius);

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
  ].join(' ');
}

/** Calculate sleep duration in minutes between bedtime and wakeTime (next day aware). */
function sleepMinutes(bedtime: Date, wakeTime: Date): number {
  let diff = wakeTime.getTime() - bedtime.getTime();
  if (diff < 0) diff += 24 * 60 * 60 * 1000; // next day
  return Math.round(diff / 60_000);
}

const HOUR_LABELS = [12, 2, 4, 6, 8, 10, 12, 2, 4, 6, 8, 10];
const HOUR_SUFFIXES = [
  'a', 'a', 'a', 'a', 'a', 'a',
  'p', 'p', 'p', 'p', 'p', 'p',
];

export default function TimeWheel({
  bedtime,
  wakeTime,
  className,
}: TimeWheelProps) {
  const bedAngle = useMemo(
    () => (bedtime ? timeToAngle(bedtime) : null),
    [bedtime],
  );
  const wakeAngle = useMemo(
    () => (wakeTime ? timeToAngle(wakeTime) : null),
    [wakeTime],
  );

  const duration = useMemo(() => {
    if (!bedtime || !wakeTime) return null;
    return sleepMinutes(bedtime, wakeTime);
  }, [bedtime, wakeTime]);

  const arcPath = useMemo(() => {
    if (bedAngle == null || wakeAngle == null) return null;
    return describeArc(TRACK_RADIUS, bedAngle, wakeAngle);
  }, [bedAngle, wakeAngle]);

  const bedPoint = useMemo(
    () => (bedAngle != null ? pointOnCircle(bedAngle, TRACK_RADIUS) : null),
    [bedAngle],
  );
  const wakePoint = useMemo(
    () => (wakeAngle != null ? pointOnCircle(wakeAngle, TRACK_RADIUS) : null),
    [wakeAngle],
  );

  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="w-full h-full max-w-[200px] max-h-[200px]"
        role="img"
        aria-label={
          duration != null && bedtime && wakeTime
            ? `Sleep from ${formatTime12(bedtime)} to ${formatTime12(wakeTime)}, ${formatDuration(duration)}`
            : 'Sleep time wheel'
        }
      >
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6c5ce7" />
            <stop offset="100%" stopColor="#00cec9" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 24h track background */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TRACK_RADIUS}
          fill="none"
          stroke="rgba(71, 69, 84, 0.25)"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {/* Hour markers */}
        {HOUR_LABELS.map((label, i) => {
          const angle = (i / 12) * 360;
          const tickOuter = pointOnCircle(angle, OUTER_RADIUS);
          const tickInner = pointOnCircle(angle, OUTER_RADIUS - 4);
          const labelPos = pointOnCircle(angle, OUTER_RADIUS + 2);

          return (
            <g key={`hour-${i}`}>
              {/* Tick mark */}
              <line
                x1={tickOuter.x}
                y1={tickOuter.y}
                x2={tickInner.x}
                y2={tickInner.y}
                stroke="rgba(200, 196, 215, 0.3)"
                strokeWidth={1}
              />
              {/* Label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(200, 196, 215, 0.45)"
                fontSize={7}
                fontFamily="var(--font-inter), Inter, sans-serif"
              >
                {label}
                {HOUR_SUFFIXES[i]}
              </text>
            </g>
          );
        })}

        {/* Sleep arc */}
        {arcPath && (
          <path
            d={arcPath}
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth={10}
            strokeLinecap="round"
            filter="url(#glowFilter)"
            className="transition-all duration-700 ease-out"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 0,
              animation: 'arcReveal 0.8s ease-out forwards',
            }}
          />
        )}

        {/* Bedtime marker */}
        {bedPoint && (
          <circle
            cx={bedPoint.x}
            cy={bedPoint.y}
            r={MARKER_RADIUS}
            fill="#6c5ce7"
            stroke="#1e1e2f"
            strokeWidth={2}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Wake time marker */}
        {wakePoint && (
          <circle
            cx={wakePoint.x}
            cy={wakePoint.y}
            r={MARKER_RADIUS}
            fill="#46eae5"
            stroke="#1e1e2f"
            strokeWidth={2}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Center text: duration */}
        {duration != null ? (
          <>
            <text
              x={CENTER}
              y={CENTER - 6}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#e3e0f8"
              fontSize={18}
              fontWeight={700}
              fontFamily="var(--font-jetbrains), JetBrains Mono, monospace"
            >
              {formatDuration(duration)}
            </text>
            <text
              x={CENTER}
              y={CENTER + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(200, 196, 215, 0.6)"
              fontSize={8}
              fontFamily="var(--font-inter), Inter, sans-serif"
              letterSpacing="0.08em"
            >
              SLEEP
            </text>
          </>
        ) : (
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(200, 196, 215, 0.35)"
            fontSize={10}
            fontFamily="var(--font-inter), Inter, sans-serif"
          >
            Set a time
          </text>
        )}
      </svg>

      {/* Arc reveal animation */}
      <style>{`
        @keyframes arcReveal {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
