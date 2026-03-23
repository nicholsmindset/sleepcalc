'use client';

import { useState, useMemo } from 'react';
import { AGE_RECOMMENDATIONS, type AgeRecommendation } from '@/utils/age-recommendations';

/** Filter to child-relevant age groups (Newborn through School Age) */
const CHILD_AGE_GROUPS = AGE_RECOMMENDATIONS.filter((rec) =>
  ['Newborn', 'Infant', 'Toddler', 'Preschool', 'School Age'].includes(rec.ageGroup)
);

interface WakeWindowInfo {
  label: string;
  range: string;
}

/** Estimated wake windows by age group */
function getWakeWindow(ageGroup: string): WakeWindowInfo {
  switch (ageGroup) {
    case 'Newborn':
      return { label: 'Very short', range: '45 min - 1 hour' };
    case 'Infant':
      return { label: 'Short', range: '1.5 - 3 hours' };
    case 'Toddler':
      return { label: 'Moderate', range: '4 - 6 hours' };
    case 'Preschool':
      return { label: 'Long', range: '5 - 7 hours' };
    case 'School Age':
      return { label: 'Full day', range: 'No naps needed' };
    default:
      return { label: 'Variable', range: '4 - 6 hours' };
  }
}

interface NapInfo {
  count: string;
  duration: string;
  totalNapHours: number;
}

/** Estimated nap details by age group */
function getNapInfo(ageGroup: string): NapInfo {
  switch (ageGroup) {
    case 'Newborn':
      return { count: '4-5 naps', duration: '30 min - 2 hours each', totalNapHours: 5 };
    case 'Infant':
      return { count: '2-3 naps', duration: '30 min - 2 hours each', totalNapHours: 3.5 };
    case 'Toddler':
      return { count: '1-2 naps', duration: '1 - 2 hours total', totalNapHours: 1.5 };
    case 'Preschool':
      return { count: '0-1 naps', duration: '30 min - 1 hour', totalNapHours: 0.5 };
    case 'School Age':
      return { count: 'None needed', duration: 'N/A', totalNapHours: 0 };
    default:
      return { count: '1 nap', duration: '1 hour', totalNapHours: 1 };
  }
}

/** Schedule block for the timeline visualization */
interface ScheduleBlock {
  type: 'night' | 'nap' | 'wake';
  label: string;
  startHour: number; // 0-24 (relative to 6 AM = 0)
  endHour: number;
}

/** Generate a visual daily schedule for the timeline */
function generateSchedule(ageGroup: string, totalSleep: number, napInfo: NapInfo): ScheduleBlock[] {
  const nighttimeHours = totalSleep - napInfo.totalNapHours;
  const blocks: ScheduleBlock[] = [];

  switch (ageGroup) {
    case 'Newborn':
      // Newborns: polyphasic sleep pattern across 24 hours
      blocks.push({ type: 'night', label: 'Sleep', startHour: 0, endHour: 3 }); // 6 AM - 9 AM
      blocks.push({ type: 'wake', label: 'Wake', startHour: 3, endHour: 4 });
      blocks.push({ type: 'nap', label: 'Nap', startHour: 4, endHour: 6 });
      blocks.push({ type: 'wake', label: 'Wake', startHour: 6, endHour: 7 });
      blocks.push({ type: 'nap', label: 'Nap', startHour: 7, endHour: 9 });
      blocks.push({ type: 'wake', label: 'Wake', startHour: 9, endHour: 10 });
      blocks.push({ type: 'nap', label: 'Nap', startHour: 10, endHour: 12 });
      blocks.push({ type: 'wake', label: 'Wake', startHour: 12, endHour: 13 });
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 13, endHour: 24 });
      break;

    case 'Infant':
      // Infant: 2-3 naps, 7 PM - 7 AM night sleep
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 0, endHour: 1 }); // 6 AM - 7 AM
      blocks.push({ type: 'wake', label: 'Wake', startHour: 1, endHour: 3.5 }); // 7 - 9:30 AM
      blocks.push({ type: 'nap', label: 'Morning nap', startHour: 3.5, endHour: 5 }); // 9:30 - 11 AM
      blocks.push({ type: 'wake', label: 'Wake', startHour: 5, endHour: 7 }); // 11 AM - 1 PM
      blocks.push({ type: 'nap', label: 'Afternoon nap', startHour: 7, endHour: 9 }); // 1 - 3 PM
      blocks.push({ type: 'wake', label: 'Wake', startHour: 9, endHour: 11 }); // 3 - 5 PM
      blocks.push({ type: 'nap', label: 'Late nap', startHour: 11, endHour: 11.5 }); // 5 - 5:30 PM
      blocks.push({ type: 'wake', label: 'Wake', startHour: 11.5, endHour: 13 }); // 5:30 - 7 PM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 13, endHour: 24 }); // 7 PM - 6 AM
      break;

    case 'Toddler':
      // Toddler: 1 afternoon nap, 7:30 PM - 6:30 AM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 0, endHour: 0.5 }); // 6 - 6:30 AM
      blocks.push({ type: 'wake', label: 'Morning', startHour: 0.5, endHour: 7 }); // 6:30 AM - 1 PM
      blocks.push({ type: 'nap', label: 'Afternoon nap', startHour: 7, endHour: 8.5 }); // 1 - 2:30 PM
      blocks.push({ type: 'wake', label: 'Afternoon', startHour: 8.5, endHour: 13.5 }); // 2:30 - 7:30 PM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 13.5, endHour: 24 }); // 7:30 PM - 6 AM
      break;

    case 'Preschool':
      // Preschool: optional short nap, 7:30 PM - 7 AM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 0, endHour: 1 }); // 6 - 7 AM
      blocks.push({ type: 'wake', label: 'Morning', startHour: 1, endHour: 7.5 }); // 7 AM - 1:30 PM
      blocks.push({ type: 'nap', label: 'Rest time', startHour: 7.5, endHour: 8 }); // 1:30 - 2 PM
      blocks.push({ type: 'wake', label: 'Afternoon', startHour: 8, endHour: 13.5 }); // 2 - 7:30 PM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 13.5, endHour: 24 }); // 7:30 PM - 6 AM
      break;

    case 'School Age':
      // School age: no naps, 8:30 PM - 6:30 AM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 0, endHour: 0.5 }); // 6 - 6:30 AM
      blocks.push({ type: 'wake', label: 'Full day', startHour: 0.5, endHour: 14.5 }); // 6:30 AM - 8:30 PM
      blocks.push({ type: 'night', label: 'Night sleep', startHour: 14.5, endHour: 24 }); // 8:30 PM - 6 AM
      break;

    default:
      blocks.push({ type: 'wake', label: 'Day', startHour: 0, endHour: 14 });
      blocks.push({ type: 'night', label: 'Night', startHour: 14, endHour: 24 });
  }

  return blocks;
}

/** Get the hour label for the timeline axis */
function getTimeLabel(offsetHour: number): string {
  const actualHour = (6 + offsetHour) % 24;
  if (actualHour === 0) return '12 AM';
  if (actualHour === 12) return '12 PM';
  if (actualHour < 12) return `${actualHour} AM`;
  return `${actualHour - 12} PM`;
}

export default function BabySleepCalculator() {
  const [selectedIndex, setSelectedIndex] = useState(1); // Default to Infant

  const recommendation = CHILD_AGE_GROUPS[selectedIndex];
  const wakeWindow = useMemo(() => getWakeWindow(recommendation.ageGroup), [recommendation]);
  const napInfo = useMemo(() => getNapInfo(recommendation.ageGroup), [recommendation]);
  const nighttimeHours = useMemo(
    () => Math.max(0, recommendation.recommendedHours - napInfo.totalNapHours),
    [recommendation, napInfo]
  );
  const schedule = useMemo(
    () => generateSchedule(recommendation.ageGroup, recommendation.recommendedHours, napInfo),
    [recommendation, napInfo]
  );

  const blockColor = (type: ScheduleBlock['type']): string => {
    switch (type) {
      case 'night':
        return '#6c5ce7';
      case 'nap':
        return '#46eae5';
      case 'wake':
        return 'rgba(71, 69, 84, 0.3)';
    }
  };

  const blockTextColor = (type: ScheduleBlock['type']): string => {
    switch (type) {
      case 'night':
        return '#c6bfff';
      case 'nap':
        return '#003735';
      case 'wake':
        return '#c8c4d7';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

      {/* Age Group Selector */}
      <div className="mb-8">
        <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
          Child&apos;s Age Group
        </p>
        <div className="flex flex-wrap gap-2">
          {CHILD_AGE_GROUPS.map((group, index) => (
            <button
              key={group.ageGroup}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedIndex === index
                  ? 'bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/20'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              aria-pressed={selectedIndex === index}
            >
              {group.ageGroup}
              <span className="block text-[10px] mt-0.5 opacity-70">{group.ageRange}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Total Sleep */}
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
            Total Sleep
          </p>
          <p className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface">
            {recommendation.recommendedHours}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">hours / day</p>
          <p className="text-[10px] text-on-surface-variant/60 mt-1">
            Range: {recommendation.minHours}&ndash;{recommendation.maxHours}h
          </p>
        </div>

        {/* Nighttime Sleep */}
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
            Nighttime
          </p>
          <p className="font-headline text-3xl md:text-4xl font-extrabold text-[#c6bfff]">
            {nighttimeHours.toFixed(1)}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">hours at night</p>
        </div>

        {/* Naps */}
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
            Naps
          </p>
          <p className="font-headline text-3xl md:text-4xl font-extrabold text-[#46eae5]">
            {napInfo.count.split(' ')[0]}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">{napInfo.duration}</p>
        </div>

        {/* Wake Windows */}
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
            Wake Window
          </p>
          <p className="font-headline text-lg md:text-xl font-extrabold text-on-surface">
            {wakeWindow.range}
          </p>
          <p className="text-xs text-on-surface-variant mt-1">{wakeWindow.label}</p>
        </div>
      </div>

      {/* Visual Daily Schedule Timeline */}
      <div className="mb-8">
        <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
          Sample Daily Schedule
        </p>
        <div className="glass-card rounded-2xl p-5 overflow-x-auto">
          {/* Timeline bar */}
          <div className="min-w-[600px]">
            <div className="flex rounded-xl overflow-hidden h-14 mb-3">
              {schedule.map((block, i) => {
                const widthPercent = ((block.endHour - block.startHour) / 24) * 100;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center text-[10px] md:text-xs font-semibold relative overflow-hidden"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: blockColor(block.type),
                      color: blockTextColor(block.type),
                      minWidth: widthPercent > 3 ? undefined : '2px',
                    }}
                    title={`${block.label}: ${getTimeLabel(block.startHour)} - ${getTimeLabel(block.endHour)}`}
                  >
                    {widthPercent > 8 && (
                      <span className="truncate px-1">{block.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Time axis */}
            <div className="flex justify-between text-[10px] text-on-surface-variant/60 px-0.5">
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>12 AM</span>
              <span>6 AM</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6c5ce7' }} />
              <span>Night sleep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#46eae5' }} />
              <span>Nap</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(71, 69, 84, 0.3)' }} />
              <span>Awake</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-3">
          Clinical Notes &mdash; {recommendation.ageGroup} ({recommendation.ageRange})
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
          {recommendation.notes}
        </p>
        <div className="bg-surface-container/50 rounded-xl px-4 py-3">
          <p className="text-xs text-on-surface-variant">
            <span className="text-[#46eae5] font-semibold">Nap guidance: </span>
            {recommendation.napRecommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
