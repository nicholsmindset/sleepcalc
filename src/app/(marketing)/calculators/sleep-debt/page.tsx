import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import SleepDebtCalculator from '@/components/calculators/SleepDebtCalculator';
import { FAQ } from '@/components/content/FAQ';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';

export const metadata: Metadata = {
  title: 'Sleep Debt Calculator: Estimate Your 7-Day Sleep Shortfall',
  description:
    'Compare the last seven nights of sleep with an age-based target. See your average, nights below target, and estimated shortfall with a clear explanation of the calculation.',
  alternates: { canonical: '/calculators/sleep-debt' },
  openGraph: {
    title: 'Sleep Debt Calculator: Estimate Your 7-Day Sleep Shortfall',
    description: 'A transparent seven-night sleep shortfall estimate.',
    url: '/calculators/sleep-debt',
    siteName: 'Sleep Stack',
  },
};

const faqItems = [
  {
    question: 'How does this sleep debt calculator work?',
    answer: 'Choose a nightly target and enter how long you actually slept on each of the last seven nights. The tool adds up the hours below your target. It also shows your average sleep and the number of nights below target. The result is an estimate based on self-reported hours, not a medical measurement.',
  },
  {
    question: 'Does one long night cancel out several short nights?',
    answer: 'A long night may help you feel better, but recovery is not a simple hour-for-hour transaction. This tool shows longer nights in the weekly average while leaving each short night visible in the shortfall total.',
  },
  {
    question: 'How many days does it take to recover from lost sleep?',
    answer: 'There is no reliable formula that converts a shortfall estimate into an exact recovery date. After repeated short nights, you may need several nights of adequate sleep. Prioritize a regular schedule and enough sleep opportunity rather than trying to repay a number on a fixed deadline.',
  },
  {
    question: 'What if I sleep enough but still feel tired?',
    answer: 'Sleep duration is only one part of sleep health. Persistent daytime sleepiness, loud snoring, breathing pauses, or difficulty sleeping despite enough opportunity are reasons to speak with a healthcare professional.',
  },
];

export default function SleepDebtPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 md:px-8 pt-4 pb-10 md:pb-16">
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: 'Sleep Stack Sleep Debt Calculator',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description: 'Compare seven nights of logged sleep with a chosen nightly target.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: '/calculators' },
          { label: 'Sleep Debt Calculator', href: '/calculators/sleep-debt' },
        ]}
      />

      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
          Sleep Debt Calculator
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
          Enter how much you slept on each of the last seven nights. Compare those hours with a
          target you choose and see where your week fell short.
        </p>
      </header>

      <SleepDebtCalculator />

      <section className="py-12 max-w-3xl mx-auto space-y-5 text-on-surface-variant leading-relaxed">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
          What the number means
        </h2>
        <p>
          This tool measures a simple difference between your sleep and a chosen target. If your
          target is 8 hours and you slept 6 hours, that night contributes 2 hours to the seven-day
          shortfall. The result does not measure your biological sleep need, sleep quality, or
          impairment. A night above your target appears in the average but does not mathematically
          erase a night below it.
        </p>
        <p>
          The age ranges are a starting point. The{' '}
          <a className="text-primary underline" href="https://www.cdc.gov/sleep/about/index.html" target="_blank" rel="noopener noreferrer">
            CDC sleep-duration guidance
          </a>{' '}
          says most adults need at least seven hours, while needs vary by age and individual.
          Set a target within the range shown for your age group, and use actual sleep time rather
          than time spent in bed.
        </p>

        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
          Can you catch up on lost sleep?
        </h2>
        <p>
          Additional sleep can help after short nights, but there is no reliable one-hour-lost to
          one-hour-repaid schedule. After repeated short nights, recovery may take several nights.
          The{' '}
          <a className="text-primary underline" href="https://www.nhlbi.nih.gov/health/sleep-deprivation/how-much-sleep" target="_blank" rel="noopener noreferrer">
            NIH explains sleep debt
          </a>, and an{' '}
          <a className="text-primary underline" href="https://www.nih.gov/news-events/nih-research-matters/weekend-catch-cant-counter-chronic-sleep-deprivation" target="_blank" rel="noopener noreferrer">
            NIH review of a weekend catch-up study
          </a>{' '}
          found that weekend recovery sleep did not reverse all measured effects of weekday sleep
          restriction in that study. Give yourself adequate sleep opportunity on a regular basis.
        </p>
        <p>
          If you are trying to make more room for sleep, use our{' '}
          <Link href="/" className="text-primary underline">bedtime calculator</Link>{' '}
          to compare possible bedtimes. If your schedule keeps drifting, see our{' '}
          <Link href="/blog/how-to-fix-sleep-schedule" className="text-primary underline">
            practical sleep-schedule reset plan
          </Link>.
        </p>
      </section>

      <FAQ items={faqItems} />
      <MedicalDisclaimer />
      <RelatedTools />
    </main>
  );
}
