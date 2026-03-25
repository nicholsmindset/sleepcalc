import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Free White Noise & Sleep Sounds — Brown Noise, Rain, Ocean & More',
  description:
    'Play free ambient sleep sounds including white noise, brown noise, pink noise, rain, ocean waves, and binaural beats. Set a sleep timer and drift off faster.',
  alternates: { canonical: '/tools/white-noise' },
  openGraph: {
    title: 'Free White Noise & Sleep Sounds',
    description:
      'Play free ambient sleep sounds including white noise, brown noise, pink noise, rain, ocean waves, and binaural beats. Set a sleep timer and drift off faster.',
    url: '/tools/white-noise',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Free White Noise & Sleep Sounds'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function WhiteNoiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
