'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Sunset, Moon, Zap, Coffee, EyeOff, Bed } from 'lucide-react';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';

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
  const optimalBedtime = addMinutes(sunset, Math.round((1440 - sunsetMin + 600) * 0.35)); // ~9–10h after sunrise

  return [
    {
      time: morningSunlight,
      label: 'Morning Sunlight Window',
      detail: 'Get 10–30 min of direct outdoor light within 30 minutes of waking. This triggers the cortisol awakening response and sets your circadian clock for the day.',
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
      detail: 'A mild circadian trough occurs roughly 12 hours after your midpoint of sleep. A 10–20 min nap here can restore alertness without affecting night sleep if kept short.',
      icon: Moon,
      color: '#8b8ba7',
    },
    {
      time: dimLights,
      label: 'Start Dimming Indoor Lights',
      detail: 'Begin transitioning to warmer, lower-intensity lighting. Bright overhead lights at this stage delay melatonin onset and can push your natural bedtime later by 1–2 hours.',
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
/*  Page                                                                     */
/* -------------------------------------------------------------------------- */

export default function CircadianGuidePage() {
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
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#f9ca24] to-[#c6bfff] bg-clip-text text-transparent">
          Circadian Light Guide
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          A personalised daily schedule based on your local sunrise and sunset — showing exactly when to
          get light, when to dim it, and when your body is primed for sleep.
        </p>
      </div>

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
          <p className="text-sm text-on-surface-variant">Loading your sun times…</p>
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

      {/* Long-form content */}
      <section className="mt-16 space-y-10">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is the Circadian Rhythm?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The circadian rhythm is a roughly 24-hour internal clock that governs nearly every biological
              process in the human body — from sleep-wake cycles and hormone secretion to body temperature,
              metabolism, immune function, and cell repair. The word comes from the Latin <em>circa dies</em>,
              meaning &quot;about a day.&quot;
            </p>
            <p>
              The master clock lives in the suprachiasmatic nucleus (SCN), a tiny region in the hypothalamus
              containing about 20,000 neurons. This structure receives direct light input from specialised
              retinal cells called intrinsically photosensitive retinal ganglion cells (ipRGCs), which are
              most sensitive to short-wavelength (blue) light at around 480nm.
            </p>
            <p>
              Light is by far the most powerful zeitgeber (time-giver) for the circadian clock. Morning
              sunlight triggers the cortisol awakening response, suppresses residual melatonin, and advances
              the clock. Evening light does the opposite — it delays the clock and suppresses the onset of
              melatonin production. This is why artificial light exposure at night is one of the greatest
              disruptors of sleep in the modern world.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Science of Morning Sunlight
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Dr. Andrew Huberman&apos;s work at Stanford and the research of Dr. Satchin Panda at the Salk
              Institute have highlighted the outsized importance of morning light exposure. Getting bright
              natural light — ideally sunlight — within 30–60 minutes of waking triggers a cascade of
              biological events:
            </p>
            <ul className="space-y-2 list-none">
              {[
                'Cortisol secretion peaks sharply (the cortisol awakening response), boosting alertness and metabolism.',
                'The circadian clock is anchored to the local light-dark cycle.',
                'A timer is set for melatonin onset ~12–14 hours later.',
                'Serotonin synthesis is stimulated in the raphe nuclei, improving mood and daytime energy.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#f9ca24]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Even on overcast days, outdoor light provides 10–100x more lux intensity than indoor lighting.
              A bright indoor room provides ~400–500 lux; an overcast day outdoors provides 10,000+ lux;
              direct sunlight exceeds 100,000 lux. The difference in circadian signal strength is enormous.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Caffeine and Your Circadian Clock
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Caffeine works by blocking adenosine receptors — adenosine is the sleep-pressure molecule that
              builds up during waking hours. The problem with early-morning coffee is that cortisol is already
              at its daily peak in the first hour after waking, doing most of caffeine&apos;s job naturally.
              Caffeine consumed during this window provides minimal additional alertness but still delivers
              its full adenosine-blocking effect, which means when cortisol drops, the accumulated adenosine
              hits harder.
            </p>
            <p>
              Research suggests delaying your first coffee by 90–120 minutes after waking allows cortisol
              to peak naturally and begin its decline before caffeine takes over. This protocol tends to
              produce more sustained alertness with less mid-afternoon crash than early-morning caffeine use.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/circadian-guide" />
      </div>

      <AffiliateCard context="supplement" />
      <MedicalDisclaimer />
    </main>
  );
}
