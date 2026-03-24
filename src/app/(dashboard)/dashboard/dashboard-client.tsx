'use client';

import type { SleepSession } from '@/lib/supabase/types';
import { LastNight } from '@/components/dashboard/LastNight';
import { VsCalculator } from '@/components/dashboard/VsCalculator';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { AICoach } from '@/components/dashboard/AICoach';
import { PersonalCycles } from '@/components/dashboard/PersonalCycles';
import {
  LayoutDashboard,
  Zap,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardClientProps {
  sessions: SleepSession[];
}

function WeeklySummary({ sessions }: { sessions: SleepSession[] }) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const prevWeekStart = new Date();
  prevWeekStart.setDate(prevWeekStart.getDate() - 14);

  const thisWeek = sessions.filter(
    (s) => new Date(s.bedtime_start) >= sevenDaysAgo
  );
  const lastWeek = sessions.filter(
    (s) =>
      new Date(s.bedtime_start) >= prevWeekStart &&
      new Date(s.bedtime_start) < sevenDaysAgo
  );

  if (thisWeek.length === 0) return null;

  const avgHours = (arr: SleepSession[]) => {
    if (!arr.length) return 0;
    const avg = arr.reduce((sum, s) => sum + (s.total_duration_min ?? 0), 0) / arr.length;
    return Math.round(avg / 6) / 10;
  };

  const avgScore = (arr: SleepSession[]) => {
    const scored = arr.filter((s) => s.sleep_score != null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((sum, s) => sum + (s.sleep_score ?? 0), 0) / scored.length);
  };

  const avgEfficiency = (arr: SleepSession[]) => {
    const withEff = arr.filter((s) => s.efficiency != null);
    if (!withEff.length) return null;
    return Math.round(
      withEff.reduce((sum, s) => sum + Number(s.efficiency ?? 0), 0) / withEff.length
    );
  };

  const thisHours = avgHours(thisWeek);
  const lastHours = avgHours(lastWeek);
  const thisScore = avgScore(thisWeek);
  const lastScore = avgScore(lastWeek);
  const thisEff = avgEfficiency(thisWeek);

  const trend = (current: number, prev: number, threshold = 0.2) => {
    const diff = current - prev;
    if (Math.abs(diff) < threshold) return 'flat';
    return diff > 0 ? 'up' : 'down';
  };

  const hoursTrend = lastWeek.length > 0 ? trend(thisHours, lastHours) : 'flat';
  const scoreTrend =
    thisScore != null && lastScore != null ? trend(thisScore, lastScore, 2) : 'flat';

  const TrendIcon = ({ t }: { t: string }) =>
    t === 'up' ? (
      <TrendingUp className="w-3.5 h-3.5 text-accent" />
    ) : t === 'down' ? (
      <TrendingDown className="w-3.5 h-3.5 text-[#ff6b6b]" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-on-surface-variant" />
    );

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-on-surface font-headline flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          This Week
        </h2>
        <span className="text-xs text-on-surface-variant">{thisWeek.length} nights tracked</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-high rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg font-bold text-on-surface font-mono">{thisHours}h</span>
            <TrendIcon t={hoursTrend} />
          </div>
          <p className="text-xs text-on-surface-variant">Avg sleep</p>
        </div>
        {thisScore != null && (
          <div className="bg-surface-container-high rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-lg font-bold text-primary font-mono">{thisScore}</span>
              <TrendIcon t={scoreTrend} />
            </div>
            <p className="text-xs text-on-surface-variant">Avg score</p>
          </div>
        )}
        {thisEff != null && (
          <div className="bg-surface-container-high rounded-xl p-3 text-center">
            <span className="text-lg font-bold text-accent font-mono">{thisEff}%</span>
            <p className="text-xs text-on-surface-variant mt-1">Efficiency</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OnboardingCard() {
  const steps = [
    {
      number: '1',
      title: 'Import your data',
      description: 'Upload an Apple Health export to get started',
      href: '/dashboard/import',
      cta: 'Import Now',
      color: '#6c5ce7',
    },
    {
      number: '2',
      title: 'Review your history',
      description: 'See all your past sleep sessions',
      href: '/dashboard/history',
      cta: 'View History',
      color: '#00cec9',
    },
    {
      number: '3',
      title: 'Get AI insights',
      description: 'Personalized coaching based on your data',
      href: '/dashboard/coach',
      cta: 'Try AI Coach',
      color: '#a29bfe',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-primary/15">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
          🌙
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface font-headline mb-1">
            Welcome to Sleep Stack
          </h2>
          <p className="text-sm text-on-surface-variant">
            Get started in 3 steps to unlock your personal sleep insights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <Link
            key={step.number}
            href={step.href}
            className="group flex flex-col p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#0a0a1a] mb-3"
              style={{ backgroundColor: step.color }}
            >
              {step.number}
            </div>
            <p className="text-sm font-semibold text-on-surface mb-1">{step.title}</p>
            <p className="text-xs text-on-surface-variant mb-3 flex-1">{step.description}</p>
            <span
              className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              style={{ color: step.color }}
            >
              {step.cta}
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/dashboard/coach"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        Ask AI Coach
      </Link>
      <Link
        href="/dashboard/history"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
      >
        <TrendingUp className="w-4 h-4" />
        View History
      </Link>
    </div>
  );
}

export function DashboardClient({ sessions }: DashboardClientProps) {
  const latest = sessions.length > 0 ? sessions[0] : null;
  const hasData = sessions.length >= 3;
  const hasAnyData = sessions.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-on-surface font-headline">Sleep Dashboard</h1>
        </div>
        {hasAnyData && <QuickActions />}
      </div>

      {/* Onboarding — shown when no data yet */}
      {!hasAnyData && <OnboardingCard />}

      {/* Weekly summary — shown when data exists */}
      {hasAnyData && <WeeklySummary sessions={sessions} />}

      {/* Quick actions on mobile (below heading) */}
      {hasAnyData && (
        <div className="sm:hidden">
          <QuickActions />
        </div>
      )}

      {/* Top row: Last Night + AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LastNight session={latest} />
        </div>
        <div>
          <AICoach hasData={hasData} />
        </div>
      </div>

      {/* Second row: Vs Calculator + Personal Cycles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VsCalculator sessions={sessions} />
        <PersonalCycles sessions={sessions} />
      </div>

      {/* Trend Charts - full width */}
      <TrendCharts sessions={sessions} />
    </div>
  );
}
