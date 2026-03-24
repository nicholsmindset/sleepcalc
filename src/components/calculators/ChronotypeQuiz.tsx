'use client';

import { useState, useCallback, useMemo } from 'react';
import { CHRONOTYPE_QUESTIONS, scoreChronotype, type ChronotypeResult } from '@/utils/chronotype';

const CHRONOTYPE_EMOJIS: Record<string, string> = {
  lion: '\u{1F981}',
  bear: '\u{1F43B}',
  wolf: '\u{1F43A}',
  dolphin: '\u{1F42C}',
};

const CHRONOTYPE_GRADIENTS: Record<string, string> = {
  lion: 'from-amber-500/20 to-orange-500/20',
  bear: 'from-emerald-500/20 to-green-500/20',
  wolf: 'from-purple-500/20 to-indigo-500/20',
  dolphin: 'from-cyan-500/20 to-teal-500/20',
};

const CHRONOTYPE_ACCENT: Record<string, string> = {
  lion: '#f9ca24',
  bear: '#46eae5',
  wolf: '#c6bfff',
  dolphin: '#00cec9',
};

const SHARE_GRADIENTS: Record<string, string> = {
  lion: 'linear-gradient(135deg, #f9ca24, #f0932b)',
  bear: 'linear-gradient(135deg, #46eae5, #00cec9)',
  wolf: 'linear-gradient(135deg, #6c5ce7, #c6bfff)',
  dolphin: 'linear-gradient(135deg, #00cec9, #46eae5)',
};

export default function ChronotypeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ChronotypeResult | null>(null);

  const totalQuestions = CHRONOTYPE_QUESTIONS.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback(
    (questionId: number, score: number) => {
      const newAnswers = { ...answers, [questionId]: score };
      setAnswers(newAnswers);

      if (currentQuestion < totalQuestions - 1) {
        // Advance to next question
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // All questions answered, score it
        const chronoResult = scoreChronotype(newAnswers);
        setResult(chronoResult);
      }
    },
    [answers, currentQuestion, totalQuestions]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const handleRetake = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  }, []);

  // Results screen
  if (result) {
    const emoji = CHRONOTYPE_EMOJIS[result.type];
    const accentColor = CHRONOTYPE_ACCENT[result.type];
    const shareGradient = SHARE_GRADIENTS[result.type];

    return (
      <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

        {/* Result Header */}
        <div className="text-center mb-8">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
            Your Chronotype
          </p>
          <div className="text-7xl md:text-8xl mb-4">{emoji}</div>
          <h2
            className="font-headline text-4xl md:text-5xl font-extrabold mb-3"
            style={{ color: accentColor }}
          >
            The {result.label}
          </h2>
          <p className="text-on-surface-variant text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* Sleep Window & Peak Productivity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-5 text-center">
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
              Ideal Sleep Window
            </p>
            <p className="font-mono text-2xl md:text-3xl font-extrabold text-on-surface">
              {result.sleepWindow.bedtime}
            </p>
            <p className="text-on-surface-variant text-xs mt-1">to</p>
            <p className="font-mono text-2xl md:text-3xl font-extrabold text-on-surface">
              {result.sleepWindow.wakeTime}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 text-center">
            <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-2">
              Peak Productivity
            </p>
            <p
              className="font-mono text-2xl md:text-3xl font-extrabold"
              style={{ color: accentColor }}
            >
              {result.peakProductivity}
            </p>
            <p className="text-on-surface-variant text-xs mt-2">
              Schedule your hardest work here
            </p>
          </div>
        </div>

        {/* Traits */}
        <div className="mb-8">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant mb-4">
            Key Traits
          </p>
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait) => (
              <span
                key={trait}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Population Percentage */}
        <div className="glass-card rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-on-surface-variant">Population</p>
            <p className="font-headline text-lg font-bold text-on-surface">
              {result.percentage}% of people
            </p>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${result.percentage}%`,
                background: shareGradient,
              }}
            />
          </div>
          <p className="text-xs text-on-surface-variant mt-2">
            You&apos;re in the {result.percentage}% of people who are {result.label}s
          </p>
        </div>

        {/* Share Card */}
        <div
          className="rounded-2xl p-6 md:p-8 text-center mb-8"
          style={{ background: shareGradient }}
        >
          <p className="text-white/80 text-xs uppercase tracking-widest mb-2 font-label">
            My Sleep Chronotype
          </p>
          <div className="text-5xl mb-2">{emoji}</div>
          <p className="text-white text-2xl font-headline font-extrabold mb-1">
            The {result.label}
          </p>
          <p className="text-white/80 text-sm mb-3">
            {result.sleepWindow.bedtime} &ndash; {result.sleepWindow.wakeTime}
          </p>
          <p className="text-white/60 text-[10px] tracking-wide">
            sleepstackapp.com/calculators/chronotype-quiz
          </p>
        </div>

        {/* Retake */}
        <div className="text-center">
          <button
            onClick={handleRetake}
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors underline underline-offset-4"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz flow
  const question = CHRONOTYPE_QUESTIONS[currentQuestion];
  const selectedScore = answers[question.id];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 blur-[100px] -z-10 rounded-full" />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
          <p className="text-xs text-on-surface-variant">
            {Math.round(progress)}% complete
          </p>
        </div>
        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(to right, #6c5ce7, #46eae5)',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface leading-snug">
          {question.text}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => {
          const isSelected = selectedScore === option.score;
          return (
            <button
              key={option.label}
              onClick={() => handleAnswer(question.id, option.score)}
              className={`w-full text-left rounded-2xl p-4 md:p-5 transition-all border ${
                isSelected
                  ? 'bg-primary-container/20 border-primary-container/50 shadow-lg shadow-primary-container/10'
                  : 'glass-card border-transparent hover:bg-surface-container-high/50 hover:border-outline-variant/20'
              }`}
              aria-pressed={isSelected}
            >
              <p
                className={`text-sm md:text-base font-medium ${
                  isSelected ? 'text-on-surface' : 'text-on-surface-variant'
                }`}
              >
                {option.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &larr; Back
        </button>
        <div className="flex gap-1.5">
          {CHRONOTYPE_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentQuestion
                  ? 'bg-primary-container w-4'
                  : answers[CHRONOTYPE_QUESTIONS[i].id] !== undefined
                    ? 'bg-on-surface-variant/40'
                    : 'bg-surface-container'
              }`}
            />
          ))}
        </div>
        <div className="w-12" /> {/* Spacer for alignment */}
      </div>
    </div>
  );
}
