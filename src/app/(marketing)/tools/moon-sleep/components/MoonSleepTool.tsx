'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getMoonPhase,
  getMonthMoonCalendar,
  getMoonSleepImpact,
} from '@/utils/moon';

/* -------------------------------------------------------------------------- */
/*  Moon SVG Visualisation                                                   */
/* -------------------------------------------------------------------------- */

function MoonVisual({ illumination, direction }: { illumination: number; direction: 'waxing' | 'waning' }) {
  const r = 60;
  // Shadow path: grows from left (waxing) or right (waning)
  const k = (illumination / 100) * 2 - 1; // -1 (new) -> +1 (full)
  const rx = Math.abs(k) * r;
  const ry = r;

  // When waxing: shadow is on the left side (lit side on right)
  // When waning: shadow is on the right side (lit side on left)
  const shadowSide = direction === 'waxing' ? -1 : 1;

  const shadowPath =
    illumination === 0
      ? `M 0 -${r} A ${r} ${r} 0 0 1 0 ${r}` // full shadow
      : illumination === 100
      ? '' // no shadow
      : [
          `M 0 -${r}`,
          `A ${r} ${r} 0 0 ${direction === 'waxing' ? 1 : 0} 0 ${r}`, // half-circle edge
          `A ${rx} ${ry} 0 0 ${direction === 'waxing' ? 0 : 1} 0 -${r}`, // terminator ellipse
        ].join(' ');

  return (
    <div className="flex items-center justify-center my-4">
      <svg width="144" height="144" viewBox="-72 -72 144 144">
        {/* Glow */}
        {illumination > 60 && (
          <circle cx="0" cy="0" r={r + 12} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
        )}
        {/* Moon disc */}
        <circle cx="0" cy="0" r={r} fill="#d4d0c8" />
        {/* Shadow overlay */}
        {illumination < 100 && illumination > 0 && (
          <path d={shadowPath} fill="rgba(10,10,26,0.82)" />
        )}
        {illumination === 0 && (
          <circle cx="0" cy="0" r={r} fill="rgba(10,10,26,0.90)" />
        )}
        {/* Craters for texture */}
        <circle cx={shadowSide * 18} cy="-22" r="7" fill="rgba(0,0,0,0.10)" />
        <circle cx={shadowSide * 28} cy="12" r="4" fill="rgba(0,0,0,0.08)" />
        <circle cx={shadowSide * 8} cy="32" r="5" fill="rgba(0,0,0,0.09)" />
        <circle cx={shadowSide * (-12)} cy="-10" r="3" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Month Calendar                                                           */
/* -------------------------------------------------------------------------- */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function MonthCalendar({ year, month }: { year: number; month: number }) {
  const days = useMemo(() => getMonthMoonCalendar(year, month), [year, month]);
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] text-on-surface-variant py-1">
            {d}
          </div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isToday =
            day.date.toDateString() === new Date().toDateString();
          return (
            <div
              key={day.date.getDate()}
              className={`flex flex-col items-center rounded-xl py-1.5 px-0.5 transition-all ${
                isToday
                  ? 'bg-primary/20 border border-primary/40'
                  : 'hover:bg-surface-container-high/40'
              }`}
            >
              <span className="text-lg leading-none">{day.emoji}</span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isToday ? 'text-on-surface font-semibold' : 'text-on-surface-variant'
                }`}
              >
                {day.date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  MoonSleepTool — Interactive Client Component                             */
/* -------------------------------------------------------------------------- */

export default function MoonSleepTool() {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const moonPhase = useMemo(() => getMoonPhase(today), []);
  const sleepImpact = useMemo(() => getMoonSleepImpact(moonPhase), [moonPhase]);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      {/* Today's moon card */}
      <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-container/15 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-secondary-container/15 blur-[60px]" />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Moon visual */}
          <div className="shrink-0">
            <MoonVisual illumination={moonPhase.illumination} direction={moonPhase.direction} />
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Tonight</p>
            <p className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-1">
              {moonPhase.emoji} {moonPhase.name}
            </p>
            <p className="text-lg font-mono font-semibold text-[#c6bfff] mb-4">
              {moonPhase.illumination}% illuminated
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-on-surface-variant">
              <div>
                <span className="text-[10px] uppercase tracking-wider block mb-0.5">Moon Age</span>
                <span className="font-mono font-semibold text-on-surface">
                  {moonPhase.age.toFixed(1)} days
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider block mb-0.5">Next Full Moon</span>
                <span className="font-mono font-semibold text-on-surface">
                  {formatDate(moonPhase.nextFull)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider block mb-0.5">Next New Moon</span>
                <span className="font-mono font-semibold text-on-surface">
                  {formatDate(moonPhase.nextNew)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep impact card */}
      <div className="glass-card rounded-2xl p-6 mb-8 border border-[#c6bfff]/20">
        <p className="text-xs uppercase tracking-widest text-[#c6bfff] mb-2">Tonight&apos;s Sleep Outlook</p>
        <p className="font-headline text-xl font-bold text-on-surface mb-2">{sleepImpact.headline}</p>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{sleepImpact.description}</p>
        <div className="flex gap-2 items-start">
          <span className="text-[#46eae5] text-sm font-semibold shrink-0">Tip:</span>
          <p className="text-sm text-on-surface-variant leading-relaxed">{sleepImpact.tip}</p>
        </div>
      </div>

      {/* Monthly Calendar */}
      <div className="glass-card rounded-3xl p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-surface-container-high/50 transition-all text-on-surface-variant hover:text-on-surface"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-headline text-xl font-bold text-on-surface">
            {MONTH_NAMES[calMonth]} {calYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-surface-container-high/50 transition-all text-on-surface-variant hover:text-on-surface"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <MonthCalendar year={calYear} month={calMonth} />

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 justify-center">
          {['🌑 New', '🌒 Wax. Crescent', '🌓 1st Quarter', '🌔 Wax. Gibbous',
            '🌕 Full', '🌖 Wan. Gibbous', '🌗 Last Quarter', '🌘 Wan. Crescent'].map((label) => (
            <span key={label} className="text-[11px] text-on-surface-variant">{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}
