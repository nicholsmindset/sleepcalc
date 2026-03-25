import type { Metadata } from 'next';
import { PublicSleepCoach } from '@/components/marketing/PublicSleepCoach';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Free AI Sleep Coach — Personalized Sleep Tips | Sleep Stack',
  description:
    'Get personalized sleep advice from our AI Sleep Coach. Answer 3 quick questions about your sleep habits and receive tailored recommendations.',
  alternates: {
    canonical: '/sleep-coach',
  },
  openGraph: {
    title: 'Free AI Sleep Coach — Personalized Sleep Tips | Sleep Stack',
    description:
      'Get personalized sleep advice from our AI Sleep Coach. Answer 3 quick questions about your sleep habits and receive tailored recommendations.',
    url: '/sleep-coach',
    siteName: 'Sleep Stack',
  },
};

export default function SleepCoachPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs
        items={[{ label: 'Home', href: '/' }, { label: 'AI Sleep Coach', href: '/sleep-coach' }]}
      />
      <h1 className="font-headline text-4xl font-bold text-on-surface mb-4">
        Free AI Sleep Coach
      </h1>
      <p className="text-on-surface-variant mb-8">
        Answer 3 quick questions and get personalised sleep advice powered by AI.
      </p>
      <PublicSleepCoach />
      <div className="mt-12">
        <RelatedTools exclude="/sleep-coach" />
      </div>
      <MedicalDisclaimer />
    </div>
  );
}
