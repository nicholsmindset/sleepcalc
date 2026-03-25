'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageSquare } from 'lucide-react';

// ---------- types ----------

type Step = 1 | 2 | 3 | 'result' | 'limit';

interface FormState {
  bedtime: string;
  wakeTime: string;
  quality: number; // 1–5, 0 = unset
  challenge: string;
}

// ---------- constants ----------

const STORAGE_KEY = 'psc_uses';
const FREE_LIMIT = 3;

const QUALITY_OPTIONS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: '😴', label: 'Terrible' },
  { value: 2, emoji: '😪', label: 'Poor' },
  { value: 3, emoji: '😐', label: 'Fair' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

const CHALLENGE_OPTIONS: string[] = [
  'Trouble falling asleep',
  'Waking during the night',
  'Morning grogginess',
  'Not enough hours',
  'Unrefreshing sleep',
  'Irregular schedule',
];

// ---------- helpers ----------

function getUsageCount(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function incrementUsageCount(): void {
  try {
    const current = getUsageCount();
    localStorage.setItem(STORAGE_KEY, String(current + 1));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// ---------- sub-components ----------

function ProgressDots({ step }: { step: Step }) {
  const active = typeof step === 'number' && step <= 3 ? step : 3;
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`block rounded-full transition-all ${
            n === active
              ? 'w-6 h-2.5 bg-primary'
              : n < active
              ? 'w-2.5 h-2.5 bg-primary/40'
              : 'w-2.5 h-2.5 bg-outline-variant/30'
          }`}
        />
      ))}
    </div>
  );
}

// ---------- main component ----------

export function PublicSleepCoach() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>({
    bedtime: '23:00',
    wakeTime: '07:00',
    quality: 0,
    challenge: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleReset() {
    setStep(1);
    setResult(null);
    setError(null);
    setForm({ bedtime: '23:00', wakeTime: '07:00', quality: 0, challenge: '' });
  }

  async function handleSubmit(selectedChallenge: string) {
    // Check usage limit before making the request
    if (getUsageCount() >= FREE_LIMIT) {
      setStep('limit');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/public-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bedtime: form.bedtime,
          wakeTime: form.wakeTime,
          quality: form.quality,
          challenge: selectedChallenge,
        }),
      });

      const data = (await res.json()) as { content?: string; error?: string };

      if (!res.ok || !data.content) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setStep(3);
        setLoading(false);
        return;
      }

      incrementUsageCount();
      setResult(data.content);
      setStep('result');
    } catch {
      setError('Could not reach the AI service. Please try again.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  }

  // ---- Step 1 ----
  if (step === 1) {
    return (
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
        <ProgressDots step={step} />
        <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
          What are your typical sleep times?
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Enter your usual bedtime and the time you want to wake up.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Bedtime
            </span>
            <input
              type="time"
              value={form.bedtime}
              onChange={(e) => setForm((f) => ({ ...f, bedtime: e.target.value }))}
              className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-on-surface font-mono text-base focus:outline-none focus:border-primary/60 transition-colors"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Wake time
            </span>
            <input
              type="time"
              value={form.wakeTime}
              onChange={(e) => setForm((f) => ({ ...f, wakeTime: e.target.value }))}
              className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-on-surface font-mono text-base focus:outline-none focus:border-primary/60 transition-colors"
            />
          </label>
        </div>

        <button
          onClick={() => setStep(2)}
          className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
        >
          Next
        </button>
      </div>
    );
  }

  // ---- Step 2 ----
  if (step === 2) {
    return (
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
        <ProgressDots step={step} />
        <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
          How would you rate your recent sleep quality?
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Think about the past week on average.
        </p>

        <div className="grid grid-cols-5 gap-2 mb-8">
          {QUALITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setForm((f) => ({ ...f, quality: opt.value }))}
              className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 px-2 transition-all ${
                form.quality === opt.value
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                  : 'border-outline-variant/20 bg-surface-container hover:border-primary/30'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant leading-tight text-center">
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setStep(1)}
            className="flex-1 border border-outline-variant/30 text-on-surface-variant px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setStep(3)}
            disabled={form.quality === 0}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 3 ----
  if (step === 3) {
    return (
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6">
        <ProgressDots step={step} />
        <h2 className="font-headline text-xl font-bold text-on-surface mb-1">
          What&apos;s your biggest sleep challenge?
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Select the one that affects you most.
        </p>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-8">
          {CHALLENGE_OPTIONS.map((ch) => (
            <button
              key={ch}
              onClick={() => {
                setForm((f) => ({ ...f, challenge: ch }));
                handleSubmit(ch);
              }}
              disabled={loading}
              className="relative flex items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container px-4 py-4 text-sm font-medium text-on-surface hover:border-primary/40 hover:bg-surface-container-high active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-center leading-snug"
            >
              {loading && form.challenge === ch ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              ) : (
                ch
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep(2)}
          disabled={loading}
          className="w-full border border-outline-variant/30 text-on-surface-variant px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Back
        </button>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Generating your personalised tips&hellip;
          </div>
        )}
      </div>
    );
  }

  // ---- Usage limit ----
  if (step === 'limit') {
    return (
      <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-6 text-center">
        <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="font-headline text-xl font-bold text-on-surface mb-2">
          You&apos;ve used your {FREE_LIMIT} free sessions
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          Create a free account for unlimited AI sleep coaching, plus a personal sleep dashboard
          when you connect your wearable.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Create free account
        </Link>
        <button
          onClick={handleReset}
          className="block mx-auto mt-3 text-xs text-on-surface-variant hover:text-on-surface transition-colors"
        >
          Start over
        </button>
      </div>
    );
  }

  // ---- Result ----
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-primary/20 bg-surface-container-low/40 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          <h2 className="font-headline text-lg font-bold text-on-surface">
            Your Personalised Sleep Tips
          </h2>
        </div>
        <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
          {result}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleReset}
          className="flex-1 border border-outline-variant/30 text-on-surface-variant px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-container transition-colors"
        >
          Get another recommendation
        </button>
        <Link
          href="/signup"
          className="flex-1 text-center bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Track your sleep daily &rarr;
        </Link>
      </div>

      <p className="text-xs text-on-surface-variant/50 text-center">
        Create a free account for unlimited coaching and a personal sleep dashboard.
      </p>
    </div>
  );
}
