import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import SleepScoreTool from './components/SleepScoreTool';

export const metadata: Metadata = {
  title: 'Sleep Score Test — Rate Your Sleep Quality in 8 Questions',
  description:
    'Take our free sleep quality test and get a personalised sleep score across duration, efficiency, quality, and hygiene. Discover what\'s dragging your sleep score down.',
  alternates: { canonical: '/tools/sleep-score' },
  openGraph: {
    title: 'Sleep Score Test — Rate Your Sleep Quality in 8 Questions',
    description:
      'Take our free sleep quality test and get a personalised sleep score across duration, efficiency, quality, and hygiene.',
    url: '/tools/sleep-score',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Sleep Score Test — Rate Your Sleep Quality'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepScorePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Free Tool</p>
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
          Sleep Score Test
        </h1>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg">
          Answer 8 quick questions about last night&apos;s sleep to get your personalised sleep quality
          score — broken down into Duration, Efficiency, Quality, and Hygiene.
        </p>
      </div>

      {/* Interactive Quiz (Client Component) */}
      <SleepScoreTool />

      {/* Long-form static content (Server-rendered for SEO) */}
      <section className="mt-16 space-y-10 max-w-2xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is a Sleep Score?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              A sleep score is a single number — typically 0 to 100 — that summarises how restorative your
              last night of sleep was. Consumer wearables like Oura Ring, Fitbit, and WHOOP popularised the
              concept, but you don&apos;t need a device to get meaningful feedback. This quiz uses the same
              four domains those devices measure and translates your self-reported experiences into an
              evidence-based score.
            </p>
            <p>
              The four domains are weighted to reflect their relative impact on next-day cognitive performance
              and long-term health: Duration (30%), Efficiency (25%), Quality (25%), and Hygiene (20%).
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How Each Domain Is Scored
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              <strong className="text-on-surface">Duration (0–30 pts)</strong> — The National Sleep
              Foundation recommends 7–9 hours for adults. Scores peak at 8 hours and decline symmetrically
              for both under and over-sleeping. Chronic short sleep (under 6 hours) is associated with
              increased risk of cardiovascular disease, obesity, and impaired immune function.
            </p>
            <p>
              <strong className="text-on-surface">Efficiency (0–25 pts)</strong> — Sleep efficiency combines
              two factors: how quickly you fell asleep (sleep onset latency) and how many times you woke up.
              Healthy sleep onset is under 20 minutes. Multiple awakenings fragment sleep architecture,
              reducing the proportion of deep and REM sleep.
            </p>
            <p>
              <strong className="text-on-surface">Quality (0–25 pts)</strong> — This domain captures your
              subjective experience: how rested you feel on waking and how deep your sleep felt. Research
              consistently shows that subjective sleep quality correlates strongly with objective measures
              like heart rate variability and slow-wave sleep duration.
            </p>
            <p>
              <strong className="text-on-surface">Hygiene (0–20 pts)</strong> — Sleep hygiene practices —
              screen exposure, caffeine timing, and schedule consistency — have an outsized impact on sleep
              quality relative to the effort required to improve them. This domain rewards good pre-sleep
              habits that support natural melatonin release and circadian rhythm stability.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Does Your Grade Mean?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { grade: 'A (85–100)', label: 'Excellent', desc: 'Restorative sleep, optimal duration, strong habits.', color: '#46eae5' },
              { grade: 'B (70–84)', label: 'Good', desc: 'Solid sleep with minor room for improvement.', color: '#55efc4' },
              { grade: 'C (55–69)', label: 'Fair', desc: 'Adequate but not restorative — address weak domains.', color: '#f9ca24' },
              { grade: 'D (40–54)', label: 'Poor', desc: 'Sleep debt accumulating — prioritise changes.', color: '#fdcb6e' },
              { grade: 'F (0–39)', label: 'Very Poor', desc: 'Significant sleep deprivation — consider professional support.', color: '#ff6b6b' },
            ].map((row) => (
              <div key={row.grade} className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-sm" style={{ color: row.color }}>{row.grade}</span>
                  <span className="text-xs text-on-surface-variant">— {row.label}</span>
                </div>
                <p className="text-xs text-on-surface-variant">{row.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How to Improve Your Sleep Score
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              The most impactful change most people can make is <strong className="text-on-surface">
              fixing their sleep schedule</strong>. Going to bed and waking at the same time every day —
              including weekends — anchors your circadian rhythm and improves every metric within two weeks.
            </p>
            <p>
              For those scoring low on Efficiency, the key is <strong className="text-on-surface">
              stimulus control</strong>: reserving your bed only for sleep, and getting out of bed if you
              can&apos;t fall asleep within 20 minutes. This cognitive-behavioural technique (CBT-I) is the
              gold-standard treatment for insomnia and outperforms sleep medication in long-term studies.
            </p>
            <p>
              Low Hygiene scores respond quickly to <strong className="text-on-surface">two specific
              changes</strong>: eliminating caffeine after 2 PM (accounting for its 5–7 hour half-life) and
              cutting screen exposure in the 60 minutes before bed. Both changes typically improve subjective
              sleep quality within the first week.
            </p>
            <p>
              If your Duration score is low despite adequate time in bed, consider whether sleep apnea,
              restless legs syndrome, or another sleep disorder may be causing fragmented sleep. A sleep
              study can diagnose these conditions, and effective treatments exist for all of them.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-score" />
      </div>

      <AffiliateCard context="tracker" />
      <MedicalDisclaimer />
    </main>
  );
}
