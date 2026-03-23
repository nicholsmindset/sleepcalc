'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Moon, Zap } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TimePicker from '@/components/calculators/shared/TimePicker';
import ResultCard from '@/components/calculators/shared/ResultCard';
import SleepCycleChart from '@/components/calculators/shared/SleepCycleChart';
import TimeWheel from '@/components/calculators/shared/TimeWheel';
import { cn } from '@/lib/utils';
import {
  calculateBedtimes,
  calculateWakeUpTimes,
  calculateSleepNow,
  getSleepPhases,
} from '@/utils/sleep-cycle';
import { timeToday, formatTime12h } from '@/utils/format-time';
import type { SleepRecommendation } from '@/utils/sleep-cycle';

export default function BedtimeCalculator() {
  const [activeTab, setActiveTab] = useState<'wake' | 'bed'>('wake');
  const [wakeTime, setWakeTime] = useState<Date>(() => timeToday(7, 0));
  const [bedTime, setBedTime] = useState<Date>(() => timeToday(23, 0));
  const [sleepLatency, setSleepLatency] = useState(15);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sleepNowResults, setSleepNowResults] = useState<SleepRecommendation[] | null>(null);

  // Calculate results based on active tab
  const results = useMemo<SleepRecommendation[]>(() => {
    if (sleepNowResults) return sleepNowResults;
    if (activeTab === 'wake') {
      return calculateBedtimes(wakeTime, sleepLatency);
    }
    return calculateWakeUpTimes(bedTime, sleepLatency);
  }, [activeTab, wakeTime, bedTime, sleepLatency, sleepNowResults]);

  // Find the recommended index (5-cycle option)
  const recommendedIndex = useMemo(() => {
    return results.findIndex((r) => r.cycles === 5);
  }, [results]);

  // The effective selected index — default to recommended
  const effectiveIndex = selectedIndex ?? recommendedIndex;

  // Get the selected recommendation
  const selected = results[effectiveIndex] ?? null;

  // Generate sleep phases for the chart
  const phases = useMemo(() => {
    if (!selected) return [];
    return getSleepPhases(selected.cycles);
  }, [selected]);

  // Determine bedtime and wake time for the wheel
  const wheelTimes = useMemo(() => {
    if (!selected) return { bedtime: undefined, wakeTime: undefined };
    if (activeTab === 'wake' && !sleepNowResults) {
      return { bedtime: selected.time, wakeTime };
    }
    if (sleepNowResults) {
      return { bedtime: new Date(), wakeTime: selected.time };
    }
    // bed tab
    return { bedtime: bedTime, wakeTime: selected.time };
  }, [activeTab, selected, wakeTime, bedTime, sleepNowResults]);

  // Chart start time (the bedtime for the selected recommendation)
  const chartStartTime = useMemo(() => {
    if (!selected) return undefined;
    if (activeTab === 'wake' && !sleepNowResults) return selected.time;
    if (sleepNowResults) return new Date();
    return bedTime;
  }, [activeTab, selected, bedTime, sleepNowResults]);

  const handleTabChange = useCallback((value: string | number | null) => {
    if (value === 'wake' || value === 'bed') {
      setActiveTab(value);
      setSelectedIndex(null);
      setSleepNowResults(null);
    }
  }, []);

  const handleSleepNow = useCallback(() => {
    const now = calculateSleepNow(sleepLatency);
    setSleepNowResults(now);
    setSelectedIndex(null);
  }, [sleepLatency]);

  const handleWakeTimeChange = useCallback((date: Date) => {
    setWakeTime(date);
    setSelectedIndex(null);
    setSleepNowResults(null);
  }, []);

  const handleBedTimeChange = useCallback((date: Date) => {
    setBedTime(date);
    setSelectedIndex(null);
    setSleepNowResults(null);
  }, []);

  const handleLatencyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSleepLatency(Number(e.target.value));
    setSelectedIndex(null);
    if (sleepNowResults) {
      setSleepNowResults(calculateSleepNow(Number(e.target.value)));
    }
  }, [sleepNowResults]);

  const resultLabel = activeTab === 'wake' && !sleepNowResults
    ? 'Go to bed at...'
    : 'Wake up at...';

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 max-w-3xl mx-auto relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary-container/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary-container/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-ds-secondary/5 blur-[80px] -z-10 rounded-full" />

      <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
        Sleep Cycle Calculator
      </p>

      {/* Tabs */}
      <Tabs defaultValue="wake" onValueChange={handleTabChange}>
        <TabsList
          className={cn(
            'glass-card bg-surface-container rounded-xl p-1 w-full mb-6',
            'inline-flex'
          )}
        >
          <TabsTrigger
            value="wake"
            className="rounded-lg text-sm font-medium data-active:bg-surface-container-high data-active:text-on-surface flex-1 py-2"
          >
            <Moon className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
            I need to wake up at...
          </TabsTrigger>
          <TabsTrigger
            value="bed"
            className="rounded-lg text-sm font-medium data-active:bg-surface-container-high data-active:text-on-surface flex-1 py-2"
          >
            <Moon className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
            I want to go to bed at...
          </TabsTrigger>
        </TabsList>

        {/* Wake tab */}
        <TabsContent value="wake">
          <div className="space-y-6">
            <TimePicker
              value={wakeTime}
              onChange={handleWakeTimeChange}
              label="What time do you need to wake up?"
            />
          </div>
        </TabsContent>

        {/* Bed tab */}
        <TabsContent value="bed">
          <div className="space-y-6">
            <TimePicker
              value={bedTime}
              onChange={handleBedTimeChange}
              label="What time do you want to go to bed?"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Sleep Now button */}
      <div className="flex justify-center mt-4 mb-6">
        <button
          type="button"
          onClick={handleSleepNow}
          className={cn(
            'btn-gradient inline-flex items-center gap-2 px-6 py-2.5',
            'rounded-full font-bold text-sm transition-all',
            'active:scale-[0.97]'
          )}
        >
          <Zap className="w-4 h-4" />
          If I sleep now...
        </button>
      </div>

      {/* Fall asleep time slider */}
      <div className="mb-8">
        <label
          htmlFor="sleep-latency"
          className="block text-xs text-on-surface-variant mb-3"
        >
          I usually fall asleep in{' '}
          <span className="font-mono font-semibold text-on-surface">
            {sleepLatency} min
          </span>
        </label>
        <input
          id="sleep-latency"
          type="range"
          min={5}
          max={30}
          step={1}
          value={sleepLatency}
          onChange={handleLatencyChange}
          className={cn(
            'w-full h-1.5 rounded-full appearance-none cursor-pointer',
            'bg-surface-container-high/60',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-primary-container',
            '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ds-primary',
            '[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-container/30',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:hover:scale-110',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-primary-container',
            '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ds-primary',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
        />
        <div className="flex justify-between text-[10px] text-on-surface-variant/50 mt-1 font-mono">
          <span>5 min</span>
          <span>30 min</span>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
            {sleepNowResults
              ? `If you sleep now (${formatTime12h(new Date())}), wake up at...`
              : resultLabel}
          </p>

          <div className="grid gap-3">
            {results.map((rec, i) => (
              <ResultCard
                key={`${rec.cycles}-${rec.time.getTime()}`}
                recommendation={rec}
                isRecommended={rec.cycles === 5}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>

          {/* Visualization: Chart + Wheel */}
          {selected && (
            <div className="mt-8 space-y-8">
              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                {/* Sleep Cycle Chart */}
                <div className="min-w-0">
                  <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
                    Sleep stages &mdash; {selected.cycles} cycles
                  </p>
                  <SleepCycleChart
                    phases={phases}
                    startTime={chartStartTime}
                    className="rounded-xl"
                  />
                </div>

                {/* Time Wheel */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
                    Your night
                  </p>
                  <TimeWheel
                    bedtime={wheelTimes.bedtime}
                    wakeTime={wheelTimes.wakeTime}
                  />
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="text-center pt-4">
            <Link
              href="/signup"
              className="text-sm text-on-surface-variant hover:text-ds-secondary transition-colors inline-flex items-center gap-1"
            >
              Connect your sleep tracker for personalized times
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
