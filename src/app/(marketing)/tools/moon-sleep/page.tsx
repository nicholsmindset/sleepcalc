import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import MoonSleepTool from './components/MoonSleepTool';

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

export default function MoonSleepPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Moon & Sleep — Does the Lunar Cycle Affect Sleep?
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">
          Track today&apos;s moon phase, view the full monthly lunar calendar, and learn what
          peer-reviewed research says about the moon&apos;s effect on your sleep.
        </p>
      </div>

      {/* Interactive tool (client component) */}
      <MoonSleepTool />

      {/* Long-form content (server-rendered for SEO) */}
      <section className="space-y-10">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Does the Moon Actually Affect Sleep?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              For millennia, humans have attributed changes in mood, sleep, and behaviour to the lunar
              cycle — but is there scientific evidence? Two landmark studies from the 2010s and 2020s
              suggest the answer is a qualified yes.
            </p>
            <p>
              The most-cited study, published in <em>Current Biology</em> in 2013 by Christian Cajochen
              and colleagues at the University of Basel, analysed polysomnography recordings of 33 healthy
              volunteers in a controlled laboratory environment. The participants had no access to windows or
              clocks, eliminating any psychological expectation about the moon. Results showed that around
              the full moon, participants took an average of 5 minutes longer to fall asleep, slept 20
              minutes less overall, and showed a striking <strong className="text-on-surface">30%
              reduction in deep (slow-wave) sleep</strong> compared to the new moon phase.
            </p>
            <p>
              A 2021 study published by University of Washington researchers, analysing sleep data from
              indigenous communities in Argentina with no artificial lighting as well as urban participants
              in the US and Argentina, found a consistent pattern: people went to sleep later and slept
              for shorter durations in the nights before a full moon. This cross-cultural consistency
              suggests the effect is biological rather than cultural.
            </p>
            <p>
              The leading hypothesis is that humans evolved with moonlight as a key environmental signal.
              The bright full moon provided illumination for nocturnal activity, so our circadian rhythms
              may have adapted to produce lighter, more fragmented sleep during high-illumination phases —
              even when that moonlight is blocked by modern windows.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Full Moon and Sleep: Key Findings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { stat: '+5 min', label: 'Longer sleep onset', desc: 'Around the full moon vs. new moon' },
              { stat: '-20 min', label: 'Less total sleep', desc: 'Full moon nights on average' },
              { stat: '-30%', label: 'Deep sleep reduction', desc: 'Slow-wave sleep at full moon' },
            ].map((item) => (
              <div key={item.stat} className="glass-card rounded-2xl p-5 text-center">
                <p className="font-headline text-3xl font-extrabold text-[#c6bfff] mb-1">{item.stat}</p>
                <p className="text-sm font-semibold text-on-surface mb-1">{item.label}</p>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-3 text-center">
            Source: Cajochen et al. (2013), <em>Current Biology</em>, 23(15), 1485-1488.
          </p>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How to Sleep Better During a Full Moon
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The lunar effect is real but modest — a 20-minute reduction in sleep is noticeable but not
              catastrophic. For most people, good sleep hygiene practices during full moon nights are
              sufficient to compensate.
            </p>
            <p>
              <strong className="text-on-surface">Block the light.</strong> The most direct intervention
              is blackout curtains or a sleep mask. Even if your evolutionary circadian response to
              moonlight operates partly independent of direct light perception, eliminating physical
              moonlight through windows removes one obvious contributing factor.
            </p>
            <p>
              <strong className="text-on-surface">Move your bedtime earlier.</strong> Since sleep onset
              tends to be delayed around the full moon, scheduling an earlier bedtime by 20-30 minutes
              can compensate for the disruption and preserve your total sleep duration.
            </p>
            <p>
              <strong className="text-on-surface">Prioritise magnesium.</strong> Magnesium glycinate
              (200-400mg before bed) has well-documented effects on sleep depth and sleep onset. Some
              practitioners specifically recommend magnesium supplementation around full moon periods,
              though direct lunar-specific evidence is limited.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The 8 Phases of the Lunar Cycle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: '🌑', name: 'New Moon', days: '0', sleep: 'Best sleep' },
              { emoji: '🌒', name: 'Waxing Crescent', days: '1-7', sleep: 'Good sleep' },
              { emoji: '🌓', name: 'First Quarter', days: '7-8', sleep: 'Normal sleep' },
              { emoji: '🌔', name: 'Waxing Gibbous', days: '8-14', sleep: 'Watch light exposure' },
              { emoji: '🌕', name: 'Full Moon', days: '~15', sleep: 'Peak disruption' },
              { emoji: '🌖', name: 'Waning Gibbous', days: '15-22', sleep: 'Improving' },
              { emoji: '🌗', name: 'Last Quarter', days: '22-23', sleep: 'Normal sleep' },
              { emoji: '🌘', name: 'Waning Crescent', days: '23-29', sleep: 'Good sleep' },
            ].map((phase) => (
              <div key={phase.name} className="glass-card rounded-2xl p-4">
                <p className="text-2xl mb-2">{phase.emoji}</p>
                <p className="text-sm font-semibold text-on-surface mb-1">{phase.name}</p>
                <p className="text-[11px] text-on-surface-variant">Day {phase.days}</p>
                <p className="text-[11px] text-[#46eae5] mt-1">{phase.sleep}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/moon-sleep" />
      </div>

      <AffiliateCard context="environment" />
      <MedicalDisclaimer />
    </main>
  );
}
