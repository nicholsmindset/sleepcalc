'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, CheckCircle, Moon, Zap, Shield, Clock } from 'lucide-react';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
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
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
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
        <span className="font-headline text-4xl font-extrabold text-on-surface">{score}</span>
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
}: {
  label: string;
  score: number;
  max: number;
  icon: React.ElementType;
  color: string;
}) {
  const pct = (score / max) * 100;
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
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Results Screen                                                            */
/* -------------------------------------------------------------------------- */

function ResultsScreen({ result, onRetake }: { result: SleepScoreResult; onRetake: () => void }) {
  const gradeColors: Record<string, string> = {
    A: '#46eae5',
    B: '#55efc4',
    C: '#f9ca24',
    D: '#fdcb6e',
    F: '#ff6b6b',
  };
  const color = gradeColors[result.grade] ?? '#6c5ce7';

  function handleShare() {
    const text = `My Sleep Score: ${result.total}/100 (${result.label}) — Test yours at sleepstackapp.com/tools/sleep-score`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
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
        <SubScoreBar label="Duration" score={result.duration} max={30} icon={Clock} color="#c6bfff" />
        <SubScoreBar label="Efficiency" score={result.efficiency} max={25} icon={Zap} color="#46eae5" />
        <SubScoreBar label="Quality" score={result.quality} max={25} icon={Moon} color="#a29bfe" />
        <SubScoreBar label="Hygiene" score={result.hygiene} max={20} icon={Shield} color="#55efc4" />
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
          Share Score
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

  const totalQuestions = SLEEP_SCORE_QUESTIONS.length;
  const q = SLEEP_SCORE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleAnswer = useCallback(
    (value: number | boolean) => {
      const newAnswers = { ...answers, [q.id]: value } as Partial<SleepScoreInputs>;
      setAnswers(newAnswers);

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // All done — calculate
        const inputs = newAnswers as SleepScoreInputs;
        setResult(calculateSleepScore(inputs));
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
    return <ResultsScreen result={result} onRetake={handleRetake} />;
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

      <MedicalDisclaimer />
    </main>
  );
}
