import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import SleepJournalTool from './components/SleepJournalTool';

export const metadata: Metadata = {
  title: 'Free Sleep Journal — Track Your Sleep & Spot Patterns',
  description:
    'Log your sleep daily, track patterns over time, and export your data to CSV. Private and free — everything stays in your browser with no account needed.',
  alternates: { canonical: '/tools/sleep-journal' },
  openGraph: {
    title: 'Free Sleep Journal — Track Your Sleep & Spot Patterns',
    description:
      'Log your sleep daily, track patterns over time, and export your data to CSV. Private and free — everything stays in your browser.',
    url: '/tools/sleep-journal',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Free Sleep Journal — Track Your Sleep'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepJournalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Sleep Journal
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Track your sleep daily, spot patterns over time, and export your data to CSV. Everything
          stays private — stored only in your browser.
        </p>
      </div>

      {/* Interactive tool (client component) */}
      <SleepJournalTool />

      {/* Static content (server-rendered for SEO) */}
      <section className="space-y-8 mt-8">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why Keep a Sleep Journal?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep tracking is one of the most evidence-backed behavioural interventions for improving
              sleep quality. Simply recording your sleep — even manually — activates metacognitive
              awareness that tends to motivate better habits. Cognitive-Behavioural Therapy for Insomnia
              (CBT-I), the gold-standard treatment for chronic insomnia, uses sleep diary data as the
              foundation for all adjustments to sleep schedules and stimulus control.
            </p>
            <p>
              Unlike wearable devices, a manual journal captures nuanced information that sensors
              miss: what you ate or drank, stress levels, exercise timing, and subjective experiences like
              vivid dreams or mid-night anxiety. Over weeks, patterns emerge that explain persistent
              sleep problems in ways that raw duration data alone cannot.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Understanding Your Sleep Efficiency Score
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep efficiency is the percentage of time in bed that you actually spend asleep. It&apos;s
              calculated as: (time asleep ÷ time in bed) × 100. A healthy sleep efficiency is 85% or
              higher. Chronic insomniacs often show efficiencies below 70%, meaning they spend significant
              time in bed lying awake.
            </p>
            <p>
              CBT-I uses a technique called <strong className="text-on-surface">sleep restriction
              therapy</strong> — temporarily limiting time in bed to match actual sleep time — to rapidly
              improve efficiency. As efficiency climbs above 85%, time in bed is gradually extended. This
              is one of the most effective insomnia treatments available, though it requires guidance to
              implement safely.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-journal" />
      </div>

      <AffiliateCard context="tracker" />
      <MedicalDisclaimer />
    </main>
  );
}
