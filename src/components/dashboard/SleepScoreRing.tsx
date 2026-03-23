'use client';

import { useEffect, useState } from 'react';

interface SleepScoreRingProps {
  score: number | null;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#55efc4';
  if (score >= 70) return '#46eae5';
  if (score >= 50) return '#fdcb6e';
  return '#ff6b6b';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

export function SleepScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  label,
}: SleepScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const displayScore = score ?? 0;
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;
  const color = getScoreColor(displayScore);

  useEffect(() => {
    if (score == null) return;

    let frame: number;
    const duration = 1000;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(eased * score!));
      if (t < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  if (score == null) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-on-surface-variant font-mono">--</p>
          <p className="text-xs text-on-surface-variant/60">No data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-outline-variant/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono text-on-surface">
          {animatedScore}
        </span>
        <span className="text-xs font-medium mt-0.5" style={{ color }}>
          {label ?? getScoreLabel(displayScore)}
        </span>
      </div>
    </div>
  );
}
