'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Timer, X } from 'lucide-react';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';

/* -------------------------------------------------------------------------- */
/*  Sound Data                                                                */
/* -------------------------------------------------------------------------- */

const SOUNDS = [
  {
    id: 'nMfPqeZjc2c',
    label: 'White Noise',
    emoji: '⬜',
    desc: 'Classic broadband static — masks all frequencies equally',
    color: '#f1f1f7',
  },
  {
    id: 'ZV6D3kBt3Tk',
    label: 'Brown Noise',
    emoji: '🟤',
    desc: 'Deep, low rumble — warmer and less harsh than white noise',
    color: '#d4956a',
  },
  {
    id: 'ZXtB6tfxIUs',
    label: 'Pink Noise',
    emoji: '🩷',
    desc: 'Balanced spectrum — often described as the most natural sounding',
    color: '#f9c4d4',
  },
  {
    id: 'nDq-DxLLAt4',
    label: 'Rain',
    emoji: '🌧️',
    desc: 'Gentle rainfall on a window — deeply familiar and calming',
    color: '#74b9ff',
  },
  {
    id: 'bn9C4--F9Jk',
    label: 'Ocean Waves',
    emoji: '🌊',
    desc: 'Rolling waves on a beach — rhythmic and soothing',
    color: '#00cec9',
  },
  {
    id: 'BofsmZ2RIWA',
    label: 'Fan',
    emoji: '💨',
    desc: 'Steady electric fan hum — a favourite for light sleepers',
    color: '#a29bfe',
  },
  {
    id: 'xNN7iIB9OHg',
    label: 'Forest',
    emoji: '🌲',
    desc: 'Birds, wind in trees, crickets — peaceful nature ambience',
    color: '#55efc4',
  },
  {
    id: 'ZXtB6tfxIUs',
    label: 'Binaural Beats',
    emoji: '🧠',
    desc: 'Delta waves (2–4 Hz) — designed to promote deep sleep onset',
    color: '#c6bfff',
  },
] as const;

const TIMER_OPTIONS = [
  { label: '15 min', ms: 15 * 60 * 1000 },
  { label: '30 min', ms: 30 * 60 * 1000 },
  { label: '60 min', ms: 60 * 60 * 1000 },
  { label: '90 min', ms: 90 * 60 * 1000 },
];

/* -------------------------------------------------------------------------- */
/*  Metadata (separate export for client component)                           */
/* -------------------------------------------------------------------------- */

// Metadata is handled by layout.tsx or a generateMetadata in a server wrapper.
// This page is purely client-side interactive.

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function WhiteNoisePage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerMs, setTimerMs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSound = SOUNDS.find((s) => s.id === activeId) ?? null;

  const buildSrc = (videoId: string) =>
    `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&rel=0&mute=0`;

  const stopPlayback = useCallback(() => {
    if (iframeRef.current) iframeRef.current.src = '';
    setIsPlaying(false);
    setActiveId(null);
    setTimeLeft(null);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const playSound = useCallback((id: string) => {
    // If same sound — toggle pause/play
    if (activeId === id && isPlaying) { stopPlayback(); return; }
    if (iframeRef.current) iframeRef.current.src = buildSrc(id);
    setActiveId(id);
    setIsPlaying(true);
    // Reset timer countdown if active
    if (timerMs !== null) setTimeLeft(timerMs);
  }, [activeId, isPlaying, timerMs, stopPlayback]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeLeft === null) return;
    if (timeLeft <= 0) { stopPlayback(); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1000) { stopPlayback(); return null; }
        return prev - 1000;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, timeLeft === null]);

  const handleTimer = (ms: number) => {
    const same = timerMs === ms;
    setTimerMs(same ? null : ms);
    if (!same && isPlaying) setTimeLeft(ms);
    else if (same) { setTimeLeft(null); if (timerRef.current) clearInterval(timerRef.current); }
  };

  const formatTimeLeft = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          White Noise & Sleep Sounds
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Free ambient sounds to help you fall asleep faster. Choose a sound, set a sleep timer, and drift off.
        </p>
      </div>

      {/* Sound grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {SOUNDS.map((sound) => {
          const active = activeId === sound.id && isPlaying;
          return (
            <button
              key={`${sound.id}-${sound.label}`}
              onClick={() => playSound(sound.id)}
              className={`glass-card rounded-2xl p-4 text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                active ? 'ring-2' : ''
              }`}
              style={active ? { outline: `2px solid ${sound.color}`, outlineOffset: '2px' } : {}}
            >
              <div className="text-3xl mb-2">{sound.emoji}</div>
              <p className="text-xs font-bold text-on-surface mb-1">{sound.label}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {active ? (
                  <>
                    <Pause className="w-3 h-3" style={{ color: sound.color }} />
                    <span className="text-[10px]" style={{ color: sound.color }}>Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-on-surface-variant" />
                    <span className="text-[10px] text-on-surface-variant">Play</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Now playing bar */}
      {isPlaying && activeSound && (
        <div
          className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4"
          style={{ borderLeft: `3px solid ${activeSound.color}` }}
        >
          <div className="text-2xl">{activeSound.emoji}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-on-surface">{activeSound.label}</p>
            <p className="text-xs text-on-surface-variant truncate">{activeSound.desc}</p>
          </div>
          {timeLeft !== null && (
            <div className="font-mono text-sm font-bold" style={{ color: activeSound.color }}>
              {formatTimeLeft(timeLeft)}
            </div>
          )}
          <button onClick={stopPlayback} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Sleep Timer */}
      <div className="glass-card rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="w-4 h-4 text-on-surface-variant" />
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">Sleep Timer</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.ms}
              onClick={() => handleTimer(opt.ms)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                timerMs === opt.ms
                  ? 'bg-primary text-white'
                  : 'glass-card text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {opt.label}
            </button>
          ))}
          {timerMs !== null && (
            <button
              onClick={() => { setTimerMs(null); setTimeLeft(null); }}
              className="rounded-xl px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {timerMs !== null && !isPlaying && (
          <p className="text-xs text-on-surface-variant/60 mt-2">
            Timer will start when you play a sound.
          </p>
        )}
      </div>

      {/* Hidden YouTube iframe */}
      <iframe
        ref={iframeRef}
        src=""
        allow="autoplay"
        className="w-0 h-0 absolute opacity-0 pointer-events-none"
        aria-hidden="true"
        title="Sleep sound player"
      />

      {/* Long-form content */}
      <section className="mt-16 space-y-10 max-w-2xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is White Noise and Why Does It Help Sleep?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              White noise is a random signal that contains all audible frequencies at equal intensity — like static from an untuned radio. When played at a moderate volume during sleep, it creates a consistent acoustic "mask" that prevents sudden sounds (traffic, neighbours, notifications) from spiking above background levels and triggering arousal responses.
            </p>
            <p>
              Research published in <em>Sleep Medicine Reviews</em> found that continuous white noise reduced sleep onset latency by an average of 38% in hospital environments. In home settings with typical urban noise, studies show it can reduce nighttime awakenings by masking transient sounds that would otherwise interrupt sleep cycles.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            White vs Pink vs Brown Noise: What&apos;s the Difference?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
            {[
              { label: 'White Noise', emoji: '⬜', color: '#f1f1f7', desc: 'Equal energy across all frequencies. Sounds like TV static or a strong fan. Best for masking a wide range of sounds.' },
              { label: 'Pink Noise', emoji: '🩷', color: '#f9c4d4', desc: 'More energy in low frequencies. Sounds like steady rain or rustling leaves. Studies suggest it may enhance deep sleep.' },
              { label: 'Brown Noise', emoji: '🟤', color: '#d4956a', desc: 'Concentrated in very low frequencies. Sounds like a deep waterfall or strong wind. Preferred by many ADHD users for focus and relaxation.' },
            ].map((n) => (
              <div key={n.label} className="glass-card rounded-2xl p-4">
                <div className="text-2xl mb-2">{n.emoji}</div>
                <p className="font-bold text-on-surface mb-1" style={{ color: n.color }}>{n.label}</p>
                <p className="text-xs text-on-surface-variant">{n.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The "best" noise colour is highly individual. If you find white noise too harsh or clinical, try pink or brown noise first. Many people prefer brown noise because it more closely resembles the low-frequency sounds found in nature.
          </p>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Binaural Beats for Sleep: Does the Science Hold Up?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Binaural beats work by playing slightly different frequencies in each ear — the brain perceives the difference as a low-frequency pulse. For sleep, delta frequencies (0.5–4 Hz) are used to encourage the slow-wave brainwaves associated with deep, restorative sleep.
            </p>
            <p>
              A 2020 meta-analysis in <em>Psychological Research</em> found that delta binaural beats significantly improved subjective sleep quality in healthy adults. However, they require stereo headphones and work best when combined with a relaxing environment — they are not a substitute for good sleep hygiene.
            </p>
            <p>
              <strong className="text-on-surface">Important:</strong> Do not use binaural beats while driving or operating machinery. Some people with epilepsy should consult a doctor before use.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How to Use the Sleep Timer
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Playing ambient sound continuously all night is generally safe, but some sleep researchers recommend using a timer to allow your brain to experience natural silence during later sleep cycles when sleep is lighter. A 90-minute timer aligns with one full sleep cycle.
            </p>
            <p>
              For most people, 30–60 minutes is sufficient — long enough to fall asleep but short enough to prevent any dependency on continuous noise. If you find yourself waking when the sound stops, try a 90-minute timer instead.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/white-noise" />
      </div>
      <MedicalDisclaimer />
    </main>
  );
}
