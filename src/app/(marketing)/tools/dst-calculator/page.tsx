import type { Metadata } from 'next';
import { Sun, Moon } from 'lucide-react';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import DstCalculatorTool from './components/DstCalculatorTool';

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

export default function DSTCalculatorPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Daylight Saving Time Sleep Adjustment Calculator
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Get your personalised 7-day sleep adjustment plan for the next DST change, based on your
          auto-detected timezone and normal bedtime.
        </p>
      </div>

      {/* Interactive tool (client component) */}
      <DstCalculatorTool />

      {/* Long-form content (server-rendered for SEO) */}
      <section className="space-y-10 mt-6">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why DST Disrupts Sleep
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Daylight Saving Time is the largest scheduled disruption to human sleep patterns in the
              modern world. Unlike jet lag — which most people only experience occasionally — DST affects
              entire countries simultaneously, twice a year. The spring transition is significantly harder
              than the fall transition because it forces you to wake up when your body clock still thinks
              it&apos;s an hour earlier.
            </p>
            <p>
              Research consistently shows that in the week following the spring clock change, rates of
              heart attacks increase by approximately 24% (Michigan Medicine, 2014), traffic accidents spike
              by 6% (Sleep Medicine, 2020), and workplace injuries rise significantly. These effects are
              attributed to acute sleep deprivation from the abrupt one-hour shift.
            </p>
            <p>
              The fall transition is easier biologically — you&apos;re gaining an hour — but many people
              still experience disruption because their bodies continue waking at the old time, causing
              early-morning wakefulness and difficulty staying asleep until the desired time.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Spring Forward vs. Fall Back: Different Strategies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-4 h-4 text-[#f9ca24]" />
                <span className="font-semibold text-on-surface">Spring Forward (+1h)</span>
              </div>
              <ul className="space-y-2 text-on-surface-variant text-xs">
                <li>• Start shifting bedtime 15 min earlier 4 days before</li>
                <li>• Get bright light immediately on waking</li>
                <li>• Avoid naps longer than 20 minutes</li>
                <li>• Cut caffeine earlier than usual for 3–4 days</li>
                <li>• Expect fatigue to peak on days 1–3</li>
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-[#c6bfff]" />
                <span className="font-semibold text-on-surface">Fall Back (−1h)</span>
              </div>
              <ul className="space-y-2 text-on-surface-variant text-xs">
                <li>• Resist sleeping in on the transition morning</li>
                <li>• Keep meals and exercise at consistent clock times</li>
                <li>• Dim lights earlier in the evening for 3–4 days</li>
                <li>• Avoid bright light after 8 PM to prevent phase delay</li>
                <li>• Maintain your new wake time consistently</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Countries That Have Abolished DST
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              A growing number of countries and regions have eliminated clock changes entirely. China,
              Japan, India, most of Africa, and large parts of Asia do not observe DST. In 2019, the
              European Parliament voted to end DST across the EU — though implementation has been delayed
              by disagreements over whether to permanently adopt summer or winter time.
            </p>
            <p>
              In the US, several states have passed legislation to stay on permanent DST (Arizona already
              stays on standard time year-round), but federal law currently requires Congressional action
              to make the change nationwide. The Sunshine Protection Act has passed the Senate but
              remained in limbo as of 2024.
            </p>
            <p>
              Sleep scientists overwhelmingly favour permanent standard time over permanent summer time,
              as standard time better aligns with natural sunrise patterns and supports earlier, more
              consistent sleep timing — particularly beneficial for children and adolescents.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/dst-calculator" />
      </div>

      <AffiliateCard context="general" />
      <MedicalDisclaimer />
    </main>
  );
}
