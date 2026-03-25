import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  bedtime: z.string(),
  wakeTime: z.string(),
  quality: z.number().min(1).max(5),
  challenge: z.string(),
});

// Simple in-memory rate limiter — resets on cold start / serverless restart.
// Keyed by IP, stores { count, reset } where reset is a Unix ms timestamp.
const ipCounts = new Map<string, { count: number; reset: number }>();

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 3_600_000; // 1 hour

const QUALITY_LABELS: Record<number, string> = {
  1: 'terrible',
  2: 'poor',
  3: 'fair',
  4: 'good',
  5: 'great',
};

const SYSTEM_PROMPT =
  'You are an expert sleep coach with deep knowledge of sleep science. ' +
  'Provide personalized, evidence-based sleep advice. Be warm, encouraging, and practical. ' +
  'Focus on actionable recommendations the person can implement tonight. ' +
  'Format your response with numbered tips. Keep it under 300 words.';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // --- IP-based rate limiting ---
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (entry && entry.reset > now) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 },
      );
    }
    entry.count += 1;
  } else {
    ipCounts.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
  }

  // --- Input validation ---
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  const { bedtime, wakeTime, quality, challenge } = parsed.data;

  // --- Build user message ---
  const qualityLabel = QUALITY_LABELS[quality] ?? 'unknown';
  const userMessage =
    `My sleep schedule: I go to bed at ${bedtime} and wake up at ${wakeTime}. ` +
    `My recent sleep quality has been ${qualityLabel}. ` +
    `My biggest sleep challenge is: ${challenge}. ` +
    `Please give me 3-4 specific, actionable tips to improve my sleep based on this information. ` +
    `Keep your response concise and practical.`;

  // --- Check AI service configuration ---
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'xxx') {
    return NextResponse.json(
      { error: 'AI service not configured.' },
      { status: 503 },
    );
  }

  // --- Call OpenRouter ---
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sleepstackapp.com',
        'X-Title': 'Sleep Stack',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'AI service returned an error. Please try again.' },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: 'AI service error. Please try again.' },
      { status: 502 },
    );
  }
}
