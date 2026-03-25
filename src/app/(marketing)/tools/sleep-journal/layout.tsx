import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Sleep Journal — Track Your Sleep Quality & Patterns Over Time',
  description:
    'Log your sleep every night and track trends in duration, efficiency, and sleep score. Free sleep journal with CSV export and 90-day history stored locally in your browser.',
  alternates: { canonical: '/tools/sleep-journal' },
  openGraph: {
    title: 'Sleep Journal — Track Your Sleep Quality & Patterns Over Time',
    description:
      'Free sleep journal with automatic duration, efficiency, and sleep score calculation. 90-day history, trend charts, and CSV export.',
    url: '/tools/sleep-journal',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Sleep Journal — Track Your Sleep Patterns'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepJournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
