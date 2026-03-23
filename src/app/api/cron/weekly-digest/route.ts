import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Implement weekly digest logic
  // 1. Query all Pro users
  // 2. For each user, aggregate last 7 days of sleep data
  // 3. Generate AI weekly digest using OpenRouter
  // 4. Send email via Resend
  // 5. Store insight in ai_insights table

  return NextResponse.json({ message: 'Weekly digest cron placeholder', processed: 0 });
}
