import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Moon & Sleep — Does the Full Moon Affect Your Sleep?',
  description:
    'See today\'s moon phase and how it may affect your sleep tonight. Monthly calendar with lunar illumination, sleep impact ratings, and the science behind moon-sleep connections.',
  alternates: { canonical: '/tools/moon-sleep' },
  openGraph: {
    title: 'Moon & Sleep — Does the Full Moon Affect Your Sleep?',
    description:
      'See today\'s moon phase and how it may affect your sleep tonight. Monthly calendar with lunar illumination and sleep impact ratings.',
    url: '/tools/moon-sleep',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Moon & Sleep — Does the Full Moon Affect Your Sleep?'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function MoonSleepLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
