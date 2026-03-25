import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';

export const metadata: Metadata = {
  title: 'Sleep-Friendly Foods — Best Foods to Eat Before Bed for Better Sleep',
  description:
    'Discover the best foods to eat before bed to improve sleep quality. Browse foods by tryptophan, magnesium, melatonin, B6, calcium, and potassium — and build your perfect evening snack.',
  alternates: { canonical: '/tools/sleep-foods' },
  openGraph: {
    title: 'Sleep-Friendly Foods — Best Foods to Eat Before Bed for Better Sleep',
    description:
      'Browse the top sleep-promoting foods by nutrient, build your ideal evening snack, and learn which foods to avoid before bed for better sleep.',
    url: '/tools/sleep-foods',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Sleep-Friendly Foods — Best Foods for Better Sleep'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepFoodsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
