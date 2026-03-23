'use client';

import { format } from 'date-fns';
import { MessageSquare, Clock } from 'lucide-react';
import { AICoach } from '@/components/dashboard/AICoach';
import type { AIInsight } from '@/lib/supabase/types';

interface CoachClientProps {
  hasData: boolean;
  recentInsights: AIInsight[];
}

export function CoachClient({ hasData, recentInsights }: CoachClientProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface font-headline">AI Sleep Coach</h1>
      </div>

      <AICoach hasData={hasData} />

      {/* Previous coaching sessions */}
      {recentInsights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-on-surface font-headline">Previous Advice</h2>
          {recentInsights.map((insight) => (
            <div key={insight.id} className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Clock className="w-3.5 h-3.5" />
                {format(new Date(insight.generated_at), 'MMM d, yyyy h:mm a')}
              </div>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                {insight.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
