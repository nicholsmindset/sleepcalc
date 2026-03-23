'use client';

import { TrendCharts } from '@/components/dashboard/TrendCharts';
import { VsCalculator } from '@/components/dashboard/VsCalculator';
import { TrendingUp } from 'lucide-react';
import type { SleepSession } from '@/lib/supabase/types';

interface TrendsClientProps {
  sessions: SleepSession[];
}

export function TrendsClient({ sessions }: TrendsClientProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">Sleep Trends</h1>
      </div>

      <TrendCharts sessions={sessions} />
      <VsCalculator sessions={sessions} />
    </div>
  );
}
