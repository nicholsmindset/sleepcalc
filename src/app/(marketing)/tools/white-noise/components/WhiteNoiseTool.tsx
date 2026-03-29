'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Timer, X } from 'lucide-react';

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
    desc: 'Delta waves (2-4 Hz) — designed to promote deep sleep onset',
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
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function buildSrc(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&rel=0&mute=0`;
}

function formatTimeLeft(ms: number) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function WhiteNoiseTool() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerMs, setTimerMs] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSound = SOUNDS.find((s) => s.id === activeId) ?? null;

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

  return (
    <>
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
    </>
  );
}
