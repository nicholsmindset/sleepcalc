import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Sleep Score Test — Rate Your Sleep Quality in 8 Questions',
  description:
    'Take our free sleep quality test and get a personalised sleep score across duration, efficiency, quality, and hygiene. Discover what\'s dragging your sleep score down.',
  alternates: { canonical: '/tools/sleep-score' },
  openGraph: {
    title: 'Sleep Score Test — Rate Your Sleep Quality in 8 Questions',
    description:
      'Take our free sleep quality test and get a personalised sleep score across duration, efficiency, quality, and hygiene.',
    url: '/tools/sleep-score',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Sleep Score Test — Rate Your Sleep Quality'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
