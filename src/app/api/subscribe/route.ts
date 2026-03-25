import { NextRequest, NextResponse } from 'next/server';
import { getResend } from '@/lib/email/resend';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Sleep Stack <hello@sleepstackapp.com>';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const resend = getResend();

    // Add to Resend audience if configured
    if (AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        audienceId: AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Send welcome email
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Your 7-Day Sleep Challenge Starts Now 🌙',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#0a0a1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#f1f1f7;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <tr><td>
              <h1 style="font-size:28px;font-weight:800;margin:0 0 8px;background:linear-gradient(135deg,#c6bfff,#46eae5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                Sleep Smarter. Wake Refreshed.
              </h1>
              <p style="color:#8b8ba7;font-size:14px;margin:0 0 32px;">Your 7-Day Sleep Challenge from Sleep Stack</p>

              <p style="font-size:15px;line-height:1.7;color:#f1f1f7;margin:0 0 24px;">
                Welcome — you're in! Over the next 7 days, you'll make one small change each night to reset your sleep. Most people notice a difference by Day 3.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${[
                  ['Day 1', 'Set a consistent wake time — same time every day, no exceptions'],
                  ['Day 2', 'Cut caffeine 8 hours before bed (use our Caffeine Cutoff calculator)'],
                  ['Day 3', 'Lower your bedroom temperature to 16–20°C / 60–68°F'],
                  ['Day 4', 'No screens 30 minutes before bed — swap for reading or stretching'],
                  ['Day 5', 'Move your last meal 3 hours before your target bedtime'],
                  ['Day 6', 'Add 10 minutes of morning sunlight within 1 hour of waking'],
                  ['Day 7', 'Calculate your ideal bedtime with our Sleep Calculator and commit to it'],
                ].map(([day, tip]) => `
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #1e1e4a;vertical-align:top;">
                      <span style="display:inline-block;background:#6c5ce7;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;margin-right:12px;white-space:nowrap;">${day}</span>
                      <span style="font-size:14px;color:#f1f1f7;line-height:1.5;">${tip}</span>
                    </td>
                  </tr>
                `).join('')}
              </table>

              <a href="https://sleepstackapp.com" style="display:inline-block;background:#6c5ce7;color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;margin-bottom:32px;">
                Open Sleep Calculator →
              </a>

              <p style="font-size:13px;color:#4a4a6a;line-height:1.6;">
                You're receiving this because you signed up for the 7-Day Sleep Challenge at sleepstackapp.com.<br>
                <a href="https://sleepstackapp.com" style="color:#6c5ce7;">Unsubscribe</a>
              </p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[subscribe] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
