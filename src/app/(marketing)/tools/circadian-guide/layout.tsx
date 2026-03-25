import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Circadian Rhythm Schedule — Your Personalised Light & Sleep Timeline',
  description:
    'Generate a personalised circadian rhythm schedule based on your local sunrise and sunset times. Discover the ideal times for morning light, peak focus, afternoon nap, and bedtime.',
  alternates: { canonical: '/tools/circadian-guide' },
  openGraph: {
    title: 'Circadian Rhythm Schedule — Your Personalised Light & Sleep Timeline',
    description:
      'Generate a personalised circadian rhythm schedule based on your local sunrise and sunset. Morning light, peak alertness, nap window, and bedtime — all timed to your location.',
    url: '/tools/circadian-guide',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Circadian Rhythm Schedule — Light & Sleep Timeline'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function CircadianGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
