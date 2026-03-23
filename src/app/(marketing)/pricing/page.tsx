import type { Metadata } from 'next';
import PricingTable from '@/components/marketing/PricingTable';
import { FAQ } from '@/components/content/FAQ';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    'Start with free sleep calculators and tools. Upgrade to Pro for unlimited AI coaching, 90-day history, wearable connections, and ad-free experience. Just $5.99/month.',
  openGraph: {
    title: 'Pricing — Free & Pro Plans | Drift Sleep',
    description:
      'Start with free sleep calculators and tools. Upgrade to Pro for unlimited AI coaching, 90-day history, wearable connections, and ad-free experience.',
  },
};

const PRICING_FAQ = [
  {
    question: 'Can I try Pro features before subscribing?',
    answer:
      'All calculator tools are completely free to use. Create a free account to access the basic dashboard, connect one wearable device, and try 3 AI coaching sessions per week. When you\'re ready for more, upgrade to Pro.',
  },
  {
    question: 'How does billing work?',
    answer:
      'Pro subscriptions are billed through Stripe. Choose monthly ($5.99/mo) or yearly ($49.99/yr — save 30%). You can cancel anytime from your dashboard settings. No contracts, no hidden fees.',
  },
  {
    question: 'What happens if I cancel my Pro subscription?',
    answer:
      'When you cancel, you keep Pro access until the end of your billing period. After that, your account reverts to the Free tier. Your sleep data is never deleted — it\'s just limited to 7-day history on the Free plan.',
  },
  {
    question: 'Do I need a wearable device to use Drift Sleep?',
    answer:
      'No! All calculators work without a device. However, connecting an Oura Ring, Fitbit, or WHOOP unlocks personalized insights based on your real sleep data — that\'s where the real value is.',
  },
  {
    question: 'Is my sleep data secure?',
    answer:
      'Absolutely. All data is encrypted in transit and at rest. OAuth tokens from wearable devices are encrypted with AES-256 before storage. We never sell your data. See our Privacy Policy for details.',
  },
  {
    question: 'Can I switch between monthly and yearly plans?',
    answer:
      'Yes! Go to Dashboard → Settings → Manage Subscription. You can switch plans at any time. When upgrading from monthly to yearly, you\'ll receive credit for the unused portion of your monthly plan.',
  },
];

export default function PricingPage() {
  return (
    <>
      <SchemaMarkup
        type="WebSite"
        data={{
          name: 'Pricing — Drift Sleep',
          description: metadata.description,
          url: '/pricing',
        }}
      />

      <main className="pt-32 pb-20 px-4">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
            Start free.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f9ca24] to-[#f0932b]">
              Go Pro
            </span>{' '}
            when you&apos;re ready.
          </h1>
          <p className="text-lg text-on-surface-variant">
            Every sleep calculator is free, forever. Upgrade to Pro for personalized
            insights powered by your real wearable data.
          </p>
        </div>

        {/* Pricing table */}
        <PricingTable />

        {/* FAQ */}
        <section className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-on-surface font-headline text-center mb-8">
            Frequently Asked Questions
          </h2>
          <FAQ items={PRICING_FAQ} />
        </section>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-on-surface-variant mb-4">
            Still not sure? Start with a free account — no credit card required.
          </p>
          <a href="/signup" className="btn-gradient inline-block">
            Sign Up Free
          </a>
        </div>
      </main>
    </>
  );
}
