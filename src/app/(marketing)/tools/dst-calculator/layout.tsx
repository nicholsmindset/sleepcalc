import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Daylight Saving Time Sleep Calculator — 7-Day Adjustment Plan',
  description:
    'Get a personalised 7-day sleep adjustment plan for Daylight Saving Time. Auto-detects your timezone and calculates gradual bedtime shifts to minimise clock-change disruption.',
  alternates: { canonical: '/tools/dst-calculator' },
  openGraph: {
    title: 'Daylight Saving Time Sleep Calculator — 7-Day Adjustment Plan',
    description:
      'Get a personalised 7-day sleep adjustment plan for Daylight Saving Time. Auto-detects your timezone for spring forward and fall back.',
    url: '/tools/dst-calculator',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Daylight Saving Time Sleep Calculator'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function DstCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
