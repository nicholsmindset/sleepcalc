import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Jet Lag Calculator — Day-by-Day Recovery Plan for Any Flight',
  description:
    'Calculate how long jet lag will last and get a personalised day-by-day recovery plan. Enter your origin and destination cities to see bedtime and wake time adjustments for each recovery day.',
  alternates: { canonical: '/tools/jet-lag-calculator' },
  openGraph: {
    title: 'Jet Lag Calculator — Day-by-Day Recovery Plan for Any Flight',
    description:
      'See how many days jet lag will last and get a day-by-day sleep adjustment plan for any flight. Enter origin and destination cities for personalised recovery times.',
    url: '/tools/jet-lag-calculator',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Jet Lag Calculator — Day-by-Day Recovery Plan'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function JetLagCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
