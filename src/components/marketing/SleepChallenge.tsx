'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Moon } from 'lucide-react';

const STORAGE_KEY = 'sleepstack_challenge_dismissed';
const DAYS = [
  { label: 'Day 1', title: 'Find your ideal bedtime', icon: '🌙' },
  { label: 'Day 2', title: 'Cut caffeine by 2 PM', icon: '☕' },
  { label: 'Day 3', title: 'No screens 30 min before bed', icon: '📵' },
  { label: 'Day 4', title: 'Cool bedroom to 18°C (65°F)', icon: '❄️' },
  { label: 'Day 5', title: 'Try a pre-sleep magnesium snack', icon: '🥜' },
  { label: 'Day 6', title: 'Get morning sunlight within 1 hour of waking', icon: '☀️' },
  { label: 'Day 7', title: 'Consistent wake time — no snooze', icon: '⏰' },
];

interface SleepChallengeProps {
  variant?: 'banner' | 'card';
}

export function SleepChallenge({ variant = 'card' }: SleepChallengeProps) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDismissed(true);
      else setDismissed(false);
    } catch {
      setDismissed(true);
    }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  const validate = (val: string) => {
    if (!val.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch { /* silently handle */ }
    setLoading(false);
    setSubmitted(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (dismissed) return null;

  if (submitted) {
    return (
      <div className={`glass-card rounded-3xl p-6 md:p-8 relative ${variant === 'banner' ? 'text-center' : ''}`}>
        <button onClick={dismiss} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
        <CheckCircle className="w-8 h-8 text-[#46eae5] mx-auto mb-3" />
        <p className="font-headline text-lg font-bold text-on-surface mb-1">You&apos;re in!</p>
        <p className="text-sm text-on-surface-variant">Your 7-Day Sleep Challenge starts now. Check your inbox for Day 1.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-primary/20 blur-[60px]" />

      <button onClick={dismiss} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface z-10" aria-label="Close">
        <X className="w-4 h-4" />
      </button>

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="w-5 h-5 text-[#c6bfff]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#c6bfff]">Free Challenge</span>
        </div>
        <h3 className="font-headline text-xl md:text-2xl font-extrabold text-on-surface mb-2">
          7-Day Sleep Challenge
        </h3>
        <p className="text-sm text-on-surface-variant mb-5 max-w-md">
          One science-backed habit per day. Most people feel a noticeable difference by Day 4.
        </p>

        {/* Day badges */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {DAYS.map((day, i) => (
            <div
              key={i}
              className="group relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-mono font-bold cursor-default"
              style={{
                background: i === 0 ? 'linear-gradient(135deg, #6c5ce7, #00cec9)' : 'rgba(255,255,255,0.07)',
                color: i === 0 ? '#fff' : '#8b8ba7',
              }}
              title={`${day.label}: ${day.title}`}
            >
              {i === 0 ? day.icon : i + 1}
            </div>
          ))}
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.com"
                className="w-full glass-card rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/60 outline-none focus:ring-2 focus:ring-primary bg-transparent"
                aria-label="Email address"
              />
              {error && <p className="text-xs text-red-400 mt-1 ml-1">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all shrink-0"
              style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: '#fff', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Joining…' : 'Start the Challenge →'}
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant/60 mt-2 ml-1">
            Free. No spam. Unsubscribe any time.
          </p>
        </form>
      </div>
    </div>
  );
}
