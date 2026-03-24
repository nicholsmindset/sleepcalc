import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Sleep Stack';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 60%, #1a1a3a 100%)',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,92,231,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '40px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,206,201,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Site name badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#6c5ce7',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#a29bfe',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Sleep Stack
          </span>
        </div>

        {/* Page title */}
        <h1
          style={{
            fontSize: title.length > 50 ? '48px' : '60px',
            fontWeight: '800',
            color: '#f1f1f7',
            lineHeight: '1.15',
            margin: '0 0 24px 0',
            maxWidth: '900px',
          }}
        >
          {title}
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '22px',
            color: '#8b8ba7',
            margin: '0',
            fontWeight: '400',
          }}
        >
          sleepstackapp.com — Free Sleep Calculators & Tools
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
