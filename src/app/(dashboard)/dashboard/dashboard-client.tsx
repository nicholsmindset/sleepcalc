'use client';

import type { SleepSession } from '@/lib/supabase/types';
import { LastNight } from '@/components/dashboard/LastNight';
import { VsCalculator } from '@/components/dashboard/VsCalculator';
import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { AICoach } from '@/components/dashboard/AICoach';
import { PersonalCycles } from '@/components/dashboard/PersonalCycles';
import { LayoutDashboard } from 'lucide-react';

interface DashboardClientProps {
  sessions: SleepSession[];
}

export function DashboardClient({ sessions }: DashboardClientProps) {
  const latest = sessions.length > 0 ? sessions[0] : null;
  const hasData = sessions.length >= 3;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">Sleep Dashboard</h1>
      </div>

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
