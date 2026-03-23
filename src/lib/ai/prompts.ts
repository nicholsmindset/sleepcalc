/**
 * AI prompt templates for sleep coaching.
 */

export const SLEEP_COACH_SYSTEM = `You are an expert sleep coach with deep knowledge of sleep science, circadian rhythms, and evidence-based sleep improvement strategies.

IMPORTANT RULES:
- Keep responses concise (under 200 words)
- Reference the user's ACTUAL sleep data in your response
- Be specific with numbers and comparisons
- Give 2-3 actionable recommendations
- Use a warm, encouraging tone
- NEVER give medical advice or diagnose conditions
- Always end with a disclaimer: "This is not medical advice."
- Focus on sleep hygiene, timing, and behavioral changes`;

export const SCORE_EXPLAINER_SYSTEM = `You are a sleep data analyst. Explain sleep scores in plain English.
Keep it under 100 words. Reference specific metrics. Be encouraging but honest.`;

export const WEEKLY_DIGEST_SYSTEM = `You are writing a brief weekly sleep summary for a user.
Highlight improvements, flag concerns, and give one key recommendation.
Keep it under 150 words. Be concise and data-driven.`;

interface SleepAggregate {
  avgDurationMin: number;
  avgEfficiency: number | null;
  avgDeepMin: number | null;
  avgRemMin: number | null;
  avgScore: number | null;
  nightsTracked: number;
  sleepDebtMin: number;
  bestNightScore: number | null;
  worstNightScore: number | null;
  avgBedtime: string | null;
  avgWakeTime: string | null;
}

export function buildCoachPrompt(data: SleepAggregate): string {
  const lines: string[] = [
    `Here is my sleep data from the past ${data.nightsTracked} nights:`,
    `- Average sleep duration: ${Math.floor(data.avgDurationMin / 60)}h ${Math.round(data.avgDurationMin % 60)}m`,
  ];

  if (data.avgEfficiency != null) {
    lines.push(`- Average efficiency: ${Math.round(data.avgEfficiency)}%`);
  }
  if (data.avgDeepMin != null) {
    lines.push(`- Average deep sleep: ${Math.round(data.avgDeepMin)} minutes`);
  }
  if (data.avgRemMin != null) {
    lines.push(`- Average REM sleep: ${Math.round(data.avgRemMin)} minutes`);
  }
  if (data.avgScore != null) {
    lines.push(`- Average sleep score: ${Math.round(data.avgScore)}/100`);
  }
  if (data.sleepDebtMin > 0) {
    lines.push(`- Accumulated sleep debt: ${Math.floor(data.sleepDebtMin / 60)}h ${Math.round(data.sleepDebtMin % 60)}m`);
  }
  if (data.bestNightScore != null && data.worstNightScore != null) {
    lines.push(`- Best night score: ${data.bestNightScore}, Worst: ${data.worstNightScore}`);
  }
  if (data.avgBedtime) {
    lines.push(`- Average bedtime: ${data.avgBedtime}`);
  }
  if (data.avgWakeTime) {
    lines.push(`- Average wake time: ${data.avgWakeTime}`);
  }

  lines.push('', 'Based on this data, what specific improvements can I make to my sleep?');

  return lines.join('\n');
}

export function buildScoreExplainerPrompt(
  score: number,
  durationMin: number | null,
  efficiency: number | null,
  deepMin: number | null,
  remMin: number | null,
  awakeMin: number | null,
): string {
  const lines = [`My sleep score was ${score}/100 last night.`];
  if (durationMin != null) lines.push(`Total sleep: ${Math.floor(durationMin / 60)}h ${durationMin % 60}m`);
  if (efficiency != null) lines.push(`Efficiency: ${Math.round(efficiency)}%`);
  if (deepMin != null) lines.push(`Deep sleep: ${deepMin} min`);
  if (remMin != null) lines.push(`REM sleep: ${remMin} min`);
  if (awakeMin != null) lines.push(`Time awake: ${awakeMin} min`);
  lines.push('', 'Explain why my score is what it is in simple terms.');
  return lines.join('\n');
}
