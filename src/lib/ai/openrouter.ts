/**
 * OpenRouter API client for AI coaching.
 * Uses free models first, then falls back to cheap paid models.
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat',
] as const;

export async function callOpenRouter(
  messages: ChatMessage[],
  maxTokens: number = 500,
): Promise<{ content: string; model: string; tokensUsed: number }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'xxx') {
    throw new Error('OPENROUTER_API_KEY not configured');
  }

  let lastError: Error | null = null;

  for (const model of MODELS) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://sleepcyclecalc.com',
          'X-Title': 'Drift Sleep AI Coach',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        lastError = new Error(`OpenRouter ${model} error ${res.status}: ${text}`);
        continue;
      }

      const data: OpenRouterResponse = await res.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`Empty response from ${model}`);
        continue;
      }

      return {
        content,
        model,
        tokensUsed: data.usage?.total_tokens ?? 0,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      continue;
    }
  }

  throw lastError ?? new Error('All AI models failed');
}
