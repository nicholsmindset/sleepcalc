'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Share2, CheckCircle, Moon, Zap, Shield, Clock, TrendingUp, Flame } from 'lucide-react';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import {
  calculateSleepScore,
  SLEEP_SCORE_QUESTIONS,
  type SleepScoreInputs,
  type SleepScoreResult,
} from '@/utils/sleep-score';

/* -------------------------------------------------------------------------- */
/*  Score Ring SVG                                                            */
/* -------------------------------------------------------------------------- */

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [displayNum, setDisplayNum] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Delay slightly so CSS transition fires on mount
    const t = setTimeout(() => setAnimatedScore(score), 60);
    // Animate the number counter
    const start = performance.now();
    const duration = 1200;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-back
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNum(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const gradeColors: Record<string, string> = {
    A: '#46eae5',
    B: '#55efc4',
    C: '#f9ca24',
    D: '#fdcb6e',
    F: '#ff6b6b',
  };
  const color = gradeColors[grade] ?? '#6c5ce7';

  return (
    <div className="relative flex items-center justify-center w-44 h-44 mx-auto">
      <svg width="176" height="176" className="-rotate-90" viewBox="0 0 176 176">
        {/* Track */}
        <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        {/* Progress */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-headline text-4xl font-extrabold text-on-surface">{displayNum}</span>
        <span className="text-xs text-on-surface-variant uppercase tracking-widest">/100</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-score Bar                                                             */
/* -------------------------------------------------------------------------- */

function SubScoreBar({
  label,
  score,
  max,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  score: number;
  max: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((score / max) * 100), delay);
    return () => clearTimeout(t);
  }, [score, max, delay]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs text-on-surface-variant">{label}</span>
        </div>
        <span className="text-xs font-mono font-semibold text-on-surface">
          {score}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  History helpers                                                           */
/* -------------------------------------------------------------------------- */

const HISTORY_KEY = 'sleep_score_history';

interface ScoreEntry {
  score: number;
  grade: string;
  date: string; // ISO
}

function loadHistory(): ScoreEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveHistory(entry: ScoreEntry) {
  const existing = loadHistory();
  const updated = [entry, ...existing].slice(0, 10);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

function calcStreak(history: ScoreEntry[]): number {
  if (history.length === 0) return 0;
  // Count consecutive weeks (7-day windows from newest entry backward)
  let streak = 1;
  for (let i = 1; i < history.length; i++) {
    const prev = new Date(history[i - 1].date).getTime();
    const curr = new Date(history[i].date).getTime();
    const daysDiff = (prev - curr) / (1000 * 60 * 60 * 24);
    if (daysDiff <= 14) streak++; // allow up to 2 weeks between entries
    else break;
  }
  return streak;
}

/* -------------------------------------------------------------------------- */
/*  Results Screen                                                            */
/* -------------------------------------------------------------------------- */

function ResultsScreen({ result, history, onRetake }: { result: SleepScoreResult; history: ScoreEntry[]; onRetake: () => void }) {
  const gradeColors: Record<string, string> = {
    A: '#46eae5',
    B: '#55efc4',
    C: '#f9ca24',
    D: '#fdcb6e',
    F: '#ff6b6b',
  };
  const color = gradeColors[result.grade] ?? '#6c5ce7';
  const streak = calcStreak(history);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const text = `My Sleep Score: ${result.total}/100 (${result.label}) 🌙 — Test yours at sleepstackapp.com/tools/sleep-score`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

  return (
    <div className="space-y-6">
      {/* Score card */}
      <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary-container/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-secondary-container/20 blur-[80px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Your Sleep Score</p>
          <ScoreRing score={result.total} grade={result.grade} />
          <div
            className="mt-4 inline-block px-5 py-1.5 rounded-full text-sm font-bold"
            style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
          >
            {result.grade} — {result.label}
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-headline text-lg font-bold text-on-surface mb-2">Score Breakdown</h2>
        <SubScoreBar label="Duration" score={result.duration} max={30} icon={Clock} color="#c6bfff" delay={200} />
        <SubScoreBar label="Efficiency" score={result.efficiency} max={25} icon={Zap} color="#46eae5" delay={350} />
        <SubScoreBar label="Quality" score={result.quality} max={25} icon={Moon} color="#a29bfe" delay={500} />
        <SubScoreBar label="Hygiene" score={result.hygiene} max={20} icon={Shield} color="#55efc4" delay={650} />
      </div>

      {/* Sleep stage estimates */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="font-headline text-lg font-bold text-on-surface mb-4">Estimated Sleep Stages</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Light Sleep', value: result.stageEstimates.light, color: '#a29bfe' },
            { label: 'Deep Sleep', value: result.stageEstimates.deep, color: '#46eae5' },
            { label: 'REM Sleep', value: result.stageEstimates.rem, color: '#c6bfff' },
            { label: 'Awake', value: result.stageEstimates.awake, color: '#fdcb6e' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container/40 rounded-2xl p-4 text-center">
              <p className="font-mono text-2xl font-bold" style={{ color: s.color }}>
                {s.value}%
              </p>
              <p className="text-xs text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-on-surface-variant/60 mt-3 text-center">
          Estimates based on your responses — not a medical measurement.
        </p>
      </div>

      {/* Tips */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="font-headline text-lg font-bold text-on-surface mb-4">
          Top 3 Ways to Improve Your Score
        </h2>
        <div className="space-y-3">
          {result.tips.map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle className="w-4 h-4 text-[#46eae5] shrink-0 mt-0.5" />
              <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History + Streak */}
      {history.length > 1 && (
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#46eae5]" />
              Your Progress
            </h2>
            {streak >= 2 && (
              <div className="flex items-center gap-1.5 bg-[#f9ca24]/10 border border-[#f9ca24]/30 rounded-full px-3 py-1">
                <Flame className="w-3.5 h-3.5 text-[#f9ca24]" />
                <span className="text-xs font-bold text-[#f9ca24]">{streak} week streak</span>
              </div>
            )}
          </div>
          <div className="flex items-end gap-2">
            {history.slice(0, 6).reverse().map((entry, i) => {
              const isLatest = i === history.slice(0, 6).length - 1;
              const dotColor = entry.score >= 85 ? '#46eae5' : entry.score >= 70 ? '#55efc4' : entry.score >= 55 ? '#f9ca24' : entry.score >= 40 ? '#fdcb6e' : '#ff6b6b';
              const heightPct = Math.max(20, entry.score);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{ height: `${heightPct * 0.6}px`, background: isLatest ? dotColor : `${dotColor}55`, minHeight: '12px' }}
                  />
                  <span className="text-[10px] font-mono text-on-surface-variant">{entry.score}</span>
                  <span className="text-[9px] text-on-surface-variant/50">
                    {new Date(entry.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-on-surface-variant/50 mt-3">
            💡 Retake every Monday to track your weekly sleep trend
          </p>
        </div>
      )}

      {history.length === 1 && (
        <div className="glass-card rounded-3xl p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#46eae5] shrink-0" />
          <p className="text-sm text-on-surface-variant">
            <strong className="text-on-surface">Retake every Monday</strong> to build your sleep trend chart and track your streak.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 glass-card rounded-2xl py-3.5 text-sm font-semibold text-on-surface hover:bg-surface-container-high/50 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: '#fff' }}
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Copied!' : 'Share Score'}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Quiz Component                                                            */
/* -------------------------------------------------------------------------- */

function SleepScoreQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<SleepScoreInputs>>({});
  const [result, setResult] = useState<SleepScoreResult | null>(null);
  const [history, setHistory] = useState<ScoreEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const totalQuestions = SLEEP_SCORE_QUESTIONS.length;
  const q = SLEEP_SCORE_QUESTIONS[currentQuestion];

  const handleAnswer = useCallback(
    (value: number | boolean) => {
      const newAnswers = { ...answers, [q.id]: value } as Partial<SleepScoreInputs>;
      setAnswers(newAnswers);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // All done — calculate and save
        const inputs = newAnswers as SleepScoreInputs;
        const scored = calculateSleepScore(inputs);
        const entry: ScoreEntry = { score: scored.total, grade: scored.grade, date: new Date().toISOString() };
        saveHistory(entry);
        const updated = loadHistory();
        setHistory(updated);
        setResult(scored);
      }
    },
    [answers, currentQuestion, q.id, totalQuestions],
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  }, [currentQuestion]);

  const handleRetake = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  }, []);

  if (result) {
    return <ResultsScreen result={result} history={history} onRetake={handleRetake} />;
  }

  const currentAnswer = answers[q.id as keyof SleepScoreInputs];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary-container/15 blur-[70px]" />

      {/* Progress */}
      <div className="relative mb-8">
        <div className="flex justify-between text-xs text-on-surface-variant mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              background: 'linear-gradient(to right, #6c5ce7, #00cec9)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-8 leading-snug">
        {q.text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {q.options?.map((opt) => {
          const isSelected = currentAnswer === opt.value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => handleAnswer(opt.value)}
              className={`w-full text-left rounded-2xl px-5 py-4 text-sm transition-all border ${
                isSelected
                  ? 'border-primary bg-primary/10 text-on-surface font-semibold'
                  : 'border-outline-variant/30 text-on-surface-variant hover:border-outline-variant hover:bg-surface-container-high/40'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      {currentQuestion > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function SleepScorePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Sleep Score Test
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Answer 8 quick questions about last night&apos;s sleep to get your personalised sleep quality
          score — broken down into Duration, Efficiency, Quality, and Hygiene.
        </p>
      </div>

      {/* Quiz */}
      <SleepScoreQuiz />

      {/* Long-form content */}
      <section className="mt-16 space-y-10 max-w-2xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is a Sleep Score?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              A sleep score is a single number — typically 0 to 100 — that summarises how restorative your
              last night of sleep was. Consumer wearables like Oura Ring, Fitbit, and WHOOP popularised the
              concept, but you don&apos;t need a device to get meaningful feedback. This quiz uses the same
              four domains those devices measure and translates your self-reported experiences into an
              evidence-based score.
            </p>
            <p>
              The four domains are weighted to reflect their relative impact on next-day cognitive performance
              and long-term health: Duration (30%), Efficiency (25%), Quality (25%), and Hygiene (20%).
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How Each Domain Is Scored
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              <strong className="text-on-surface">Duration (0–30 pts)</strong> — The National Sleep
              Foundation recommends 7–9 hours for adults. Scores peak at 8 hours and decline symmetrically
              for both under and over-sleeping. Chronic short sleep (under 6 hours) is associated with
              increased risk of cardiovascular disease, obesity, and impaired immune function.
            </p>
            <p>
              <strong className="text-on-surface">Efficiency (0–25 pts)</strong> — Sleep efficiency combines
              two factors: how quickly you fell asleep (sleep onset latency) and how many times you woke up.
              Healthy sleep onset is under 20 minutes. Multiple awakenings fragment sleep architecture,
              reducing the proportion of deep and REM sleep.
            </p>
            <p>
              <strong className="text-on-surface">Quality (0–25 pts)</strong> — This domain captures your
              subjective experience: how rested you feel on waking and how deep your sleep felt. Research
              consistently shows that subjective sleep quality correlates strongly with objective measures
              like heart rate variability and slow-wave sleep duration.
            </p>
            <p>
              <strong className="text-on-surface">Hygiene (0–20 pts)</strong> — Sleep hygiene practices —
              screen exposure, caffeine timing, and schedule consistency — have an outsized impact on sleep
              quality relative to the effort required to improve them. This domain rewards good pre-sleep
              habits that support natural melatonin release and circadian rhythm stability.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Does Your Grade Mean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { grade: 'A (85–100)', label: 'Excellent', desc: 'Restorative sleep, optimal duration, strong habits.', color: '#46eae5' },
              { grade: 'B (70–84)', label: 'Good', desc: 'Solid sleep with minor room for improvement.', color: '#55efc4' },
              { grade: 'C (55–69)', label: 'Fair', desc: 'Adequate but not restorative — address weak domains.', color: '#f9ca24' },
              { grade: 'D (40–54)', label: 'Poor', desc: 'Sleep debt accumulating — prioritise changes.', color: '#fdcb6e' },
              { grade: 'F (0–39)', label: 'Very Poor', desc: 'Significant sleep deprivation — consider professional support.', color: '#ff6b6b' },
            ].map((row) => (
              <div key={row.grade} className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm" style={{ color: row.color }}>{row.grade}</span>
                  <span className="text-xs text-on-surface-variant">— {row.label}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{row.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How to Improve Your Sleep Score
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The most impactful change most people can make is <strong className="text-on-surface">
              fixing their sleep schedule</strong>. Going to bed and waking at the same time every day —
              including weekends — anchors your circadian rhythm and improves every metric within two weeks.
            </p>
            <p>
              For those scoring low on Efficiency, the key is <strong className="text-on-surface">
              stimulus control</strong>: reserving your bed only for sleep, and getting out of bed if you
              can&apos;t fall asleep within 20 minutes. This cognitive-behavioural technique (CBT-I) is the
              gold-standard treatment for insomnia and outperforms sleep medication in long-term studies.
            </p>
            <p>
              Low Hygiene scores respond quickly to <strong className="text-on-surface">two specific
              changes</strong>: eliminating caffeine after 2 PM (accounting for its 5–7 hour half-life) and
              cutting screen exposure in the 60 minutes before bed. Both changes typically improve subjective
              sleep quality within the first week.
            </p>
            <p>
              If your Duration score is low despite adequate time in bed, consider whether sleep apnea,
              restless legs syndrome, or another sleep disorder may be causing fragmented sleep. A sleep
              study can diagnose these conditions, and effective treatments exist for all of them.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-score" />
      </div>

      <AffiliateCard context="tracker" />
      <MedicalDisclaimer />
    </main>
  );
}
