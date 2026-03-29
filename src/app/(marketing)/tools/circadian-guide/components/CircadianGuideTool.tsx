'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Sunset, Moon, Zap, Coffee, EyeOff, Bed } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface SunTimes {
  sunrise: string; // HH:MM 24h
  sunset: string;
}

interface ScheduleEvent {
  time: string;
  label: string;
  detail: string;
  icon: React.ElementType;
  color: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function parseHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

function addMinutes(hhmm: string, minutes: number): string {
  const total = (parseHHMM(hhmm) + minutes + 1440) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function fmt12(hhmm: string): string {
  if (!hhmm || !hhmm.includes(':')) return hhmm;
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

function buildSchedule(sunrise: string, sunset: string): ScheduleEvent[] {
  const sunriseMin = parseHHMM(sunrise);
  const sunsetMin = parseHHMM(sunset);
  const daylightMin = sunsetMin - sunriseMin;

  // Derived times
  const morningSunlight = sunrise;                                   // At sunrise
  const peakAlertness = addMinutes(sunrise, 120);                   // 2h after sunrise
  const midMorningWork = addMinutes(sunrise, 150);                  // 2.5h after sunrise
  const afternoonDip = addMinutes(sunrise, Math.round(daylightMin * 0.55)); // ~55% of daylight
  const dimLights = addMinutes(sunset, -60);                         // 1h before sunset
  const blueLightCutoff = addMinutes(sunset, 60);                   // 1h after sunset
  const melatoninWindow = addMinutes(sunset, 90);                   // 90 min after sunset
  const optimalBedtime = addMinutes(sunset, Math.round((1440 - sunsetMin + 600) * 0.35)); // ~9-10h after sunrise

  return [
    {
      time: morningSunlight,
      label: 'Morning Sunlight Window',
      detail: 'Get 10-30 min of direct outdoor light within 30 minutes of waking. This triggers the cortisol awakening response and sets your circadian clock for the day.',
      icon: Sun,
      color: '#f9ca24',
    },
    {
      time: peakAlertness,
      label: 'Peak Alertness & Cognitive Performance',
      detail: 'Your cortisol and core body temperature have risen to their daily peak. Schedule your most demanding cognitive work — deep focus, creative tasks, important meetings — in this window.',
      icon: Zap,
      color: '#fdcb6e',
    },
    {
      time: midMorningWork,
      label: 'Caffeine Optimal Window',
      detail: 'Cortisol peaks are subsiding. This is the ideal time for your first coffee — caffeine boosts alertness without fighting your natural hormonal peak, and metabolism will clear it before bed.',
      icon: Coffee,
      color: '#a29bfe',
    },
    {
      time: afternoonDip,
      label: 'Afternoon Energy Dip',
      detail: 'A mild circadian trough occurs roughly 12 hours after your midpoint of sleep. A 10-20 min nap here can restore alertness without affecting night sleep if kept short.',
      icon: Moon,
      color: '#8b8ba7',
    },
    {
      time: dimLights,
      label: 'Start Dimming Indoor Lights',
      detail: 'Begin transitioning to warmer, lower-intensity lighting. Bright overhead lights at this stage delay melatonin onset and can push your natural bedtime later by 1-2 hours.',
      icon: Sunset,
      color: '#e17055',
    },
    {
      time: blueLightCutoff,
      label: 'Blue Light Cutoff',
      detail: 'Switch all screens to Night Mode or use blue-light blocking glasses. Alternatively, step away from screens entirely. Melatonin suppression from blue light can last up to 2 hours.',
      icon: EyeOff,
      color: '#6c5ce7',
    },
    {
      time: melatoninWindow,
      label: 'Melatonin Production Peaks',
      detail: 'Your pineal gland is now producing melatonin at maximum rate — assuming light exposure has been managed. You should begin feeling naturally sleepy. Wind down with a consistent pre-sleep routine.',
      icon: Moon,
      color: '#c6bfff',
    },
    {
      time: optimalBedtime,
      label: 'Optimal Bedtime',
      detail: 'Based on your local sunset, this is your ideal sleep window. Going to bed consistently within 30 minutes of this time anchors your circadian rhythm and maximises deep and REM sleep.',
      icon: Bed,
      color: '#46eae5',
    },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Arc Visualisation                                                        */
/* -------------------------------------------------------------------------- */

function CircadianArc({ schedule }: { schedule: ScheduleEvent[] }) {
  const cx = 150, cy = 150, r = 110;

  function timeToAngle(hhmm: string): number {
    const mins = parseHHMM(hhmm);
    return (mins / 1440) * 360 - 90; // 0h at top
  }

  function polarToXY(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  return (
    <div className="flex justify-center my-6">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="20" />
        {/* Day arc (sunrise to sunset) */}
        {schedule.length > 0 && (() => {
          const startAngle = timeToAngle(schedule[0].time);
          const endAngle = timeToAngle(schedule[6].time); // melatonin window
          const start = polarToXY(startAngle, r);
          const end = polarToXY(endAngle, r);
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
          return (
            <path
              d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`}
              fill="none"
              stroke="url(#dayGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />
          );
        })()}
        {/* Gradient definition */}
        <defs>
          <linearGradient id="dayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9ca24" />
            <stop offset="50%" stopColor="#fdcb6e" />
            <stop offset="100%" stopColor="#6c5ce7" />
          </linearGradient>
        </defs>
        {/* Event dots */}
        {schedule.map((event, i) => {
          const angle = timeToAngle(event.time);
          const pos = polarToXY(angle, r);
          return (
            <circle key={i} cx={pos.x} cy={pos.y} r={6} fill={event.color}
              stroke="rgba(10,10,26,0.8)" strokeWidth="2" />
          );
        })}
        {/* Center labels */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#f1f1f7" fontSize="13" fontWeight="700" fontFamily="system-ui">
          Your
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#f1f1f7" fontSize="13" fontWeight="700" fontFamily="system-ui">
          Circadian
        </text>
        <text x={cx} y={cy + 28} textAnchor="middle" fill="#8b8ba7" fontSize="11" fontFamily="system-ui">
          Schedule
        </text>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Interactive Tool Component                                          */
/* -------------------------------------------------------------------------- */

export default function CircadianGuideTool() {
  const [sunState, setSunState] = useState<'idle' | 'loading' | 'done' | 'denied' | 'error'>('idle');
  const [schedule, setSchedule] = useState<ScheduleEvent[] | null>(null);
  const [sunTimes, setSunTimes] = useState<SunTimes | null>(null);

  const load = useCallback(() => {
    setSunState('loading');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.sunrisesunset.io/json?lat=${coords.latitude}&lng=${coords.longitude}&formatted=0`,
          );
          if (!res.ok) throw new Error();
          const json = await res.json();

          const parse = (iso: string) => {
            const d = new Date(iso);
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          };

          const sun: SunTimes = {
            sunrise: parse(json.results.sunrise),
            sunset: parse(json.results.sunset),
          };
          setSunTimes(sun);
          setSchedule(buildSchedule(sun.sunrise, sun.sunset));
          setSunState('done');
        } catch {
          setSunState('error');
        }
      },
      () => setSunState('denied'),
      { timeout: 8000 },
    );
  }, []);

  // Use sensible defaults if not loaded
  const fallbackSchedule = buildSchedule('06:30', '19:30');

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    navigator.permissions?.query({ name: 'geolocation' }).then((r) => {
      if (r.state === 'granted') load();
    });
  }, [load]);

  const displaySchedule = schedule ?? fallbackSchedule;

  return (
    <>
      {/* Location prompt */}
      {sunState === 'idle' || sunState === 'denied' || sunState === 'error' ? (
        <div className="glass-card rounded-3xl p-6 mb-6 flex items-center gap-4">
          <Sun className="w-6 h-6 text-[#f9ca24] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface mb-1">
              Personalise with your sunrise/sunset
            </p>
            <p className="text-xs text-on-surface-variant">
              {sunState === 'denied'
                ? 'Location access denied — showing example schedule for 6:30 AM sunrise / 7:30 PM sunset.'
                : sunState === 'error'
                ? 'Could not load sun times. Showing example schedule.'
                : 'Share your location for a schedule built around today\'s actual sunrise and sunset.'}
            </p>
          </div>
          {sunState !== 'denied' && sunState !== 'error' && (
            <button
              onClick={load}
              className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, #f9ca24, #fdcb6e)', color: '#0a0a1a' }}
            >
              Use My Location
            </button>
          )}
        </div>
      ) : sunState === 'loading' ? (
        <div className="glass-card rounded-3xl p-5 mb-6 flex items-center gap-3">
          <div className="w-4 h-4 rounded-full border-2 border-[#f9ca24] border-t-transparent animate-spin" />
          <p className="text-sm text-on-surface-variant">Loading your sun times...</p>
        </div>
      ) : sunTimes ? (
        <div className="glass-card rounded-2xl px-5 py-3 mb-6 flex gap-6 text-sm">
          <span className="text-on-surface-variant">
            Sunrise <span className="text-[#f9ca24] font-mono font-semibold">{fmt12(sunTimes.sunrise)}</span>
          </span>
          <span className="text-on-surface-variant">
            Sunset <span className="text-[#c6bfff] font-mono font-semibold">{fmt12(sunTimes.sunset)}</span>
          </span>
        </div>
      ) : null}

      {/* Arc visualisation */}
      <CircadianArc schedule={displaySchedule} />

      {/* Timeline */}
      <div className="space-y-0 mt-2">
        {displaySchedule.map((event, i) => {
          const Icon = event.icon;
          return (
            <div key={i} className="flex gap-4 group">
              {/* Time */}
              <div className="w-24 shrink-0 pt-4 text-right">
                <p className="font-mono text-xs font-semibold" style={{ color: event.color }}>
                  {fmt12(event.time)}
                </p>
              </div>
              {/* Connector */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-2"
                  style={{ background: `${event.color}22`, border: `1px solid ${event.color}44` }}
                >
                  <Icon className="w-4 h-4" style={{ color: event.color }} />
                </div>
                {i < displaySchedule.length - 1 && (
                  <div className="w-px flex-1 bg-outline-variant/20 mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="pb-5 pt-2 min-w-0 flex-1">
                <p className="text-sm font-semibold text-on-surface mb-1">{event.label}</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{event.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
