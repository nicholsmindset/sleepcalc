import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';
import { RelatedTools } from '@/components/content/RelatedTools';
import JetLagTool from './components/JetLagTool';

export const metadata: Metadata = {
  title: 'Jet Lag Calculator — Day-by-Day Recovery Plan for Any Flight',
  description:
    'Calculate how long jet lag will last and get a personalised day-by-day recovery plan. Enter your origin and destination cities to see bedtime and wake time adjustments for each recovery day.',
  alternates: { canonical: '/tools/jet-lag-calculator' },
  openGraph: {
    title: 'Jet Lag Calculator — Day-by-Day Recovery Plan for Any Flight',
    description:
      'See how many days jet lag will last and get a day-by-day sleep adjustment plan for any flight. Enter origin and destination cities for personalised recovery times.',
    url: '/tools/jet-lag-calculator',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Jet Lag Calculator — Day-by-Day Recovery Plan'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function JetLagCalculatorPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/calculators' },
          { label: 'Jet Lag Calculator', href: '/tools/jet-lag-calculator' },
        ]}
      />

      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Jet Lag Calculator
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-2xl">
        Select your origin and destination cities to get a personalised day-by-day recovery plan with
        optimal bedtimes, light exposure tips, and a realistic timeline for full adjustment.
      </p>

      {/* Interactive calculator (client component) */}
      <JetLagTool />

      {/* Static content (server-rendered for SEO) */}
      <section className="space-y-10 max-w-3xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            What Is Jet Lag — and Why Does It Happen?
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Jet lag (formally called <strong className="text-on-surface">desynchronosis</strong>) occurs when your
              internal circadian clock is misaligned with the local time at your destination. Your circadian rhythm is
              an approximately 24-hour biological oscillator regulated by the suprachiasmatic nucleus (SCN) in the
              hypothalamus. It controls sleep timing, cortisol peaks, digestion, body temperature, and dozens of other
              physiological processes.
            </p>
            <p>
              When you cross multiple time zones rapidly by air, your destination&apos;s light-dark cycle suddenly
              conflicts with your body&apos;s entrained schedule. The result: you feel alert at 2 AM, exhausted at noon,
              your digestive system fires at wrong times, and your cognitive performance is measurably impaired. The
              more time zones crossed, the more severe the misalignment.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Why Eastward Travel Is Harder Than Westward
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Your circadian clock naturally runs slightly longer than 24 hours — closer to 24.2 hours on average. This
              means it is biologically easier to <strong className="text-on-surface">delay</strong> your sleep
              (stay up later, as in westward travel) than to <strong className="text-on-surface">advance</strong> it
              (go to bed earlier, as in eastward travel).
            </p>
            <p>
              Eastward travel requires you to fall asleep earlier than your body wants to, which fights your natural
              rhythm. Research consistently shows eastward jet lag takes approximately <strong className="text-on-surface">50%
              longer to resolve</strong> than equivalent westward travel. This is why our calculator assigns 1.5 days of
              recovery per hour when traveling east, versus 1 day per hour heading west.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {[
                { dir: 'Westward \u2190', color: '#46eae5', rule: '~1 day per time zone', detail: 'Clock delay — goes with your natural drift' },
                { dir: 'Eastward \u2192', color: '#ff6b6b', rule: '~1.5 days per time zone', detail: 'Clock advance — fights your natural drift' },
              ].map((item) => (
                <div key={item.dir} className="glass-card rounded-2xl p-4">
                  <p className="font-semibold text-sm mb-1" style={{ color: item.color }}>{item.dir}</p>
                  <p className="font-mono text-xs text-on-surface mb-1">{item.rule}</p>
                  <p className="text-xs text-on-surface-variant">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Light: The Most Powerful Jet Lag Tool
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Light exposure is the most powerful zeitgeber (time-giver) for the circadian system. Light hitting the
              retina sends signals via the retinohypothalamic tract directly to the SCN, which adjusts melatonin
              secretion accordingly. The timing of light exposure determines whether your clock advances or delays:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Light in the morning</strong> (after your temperature minimum) advances your clock — helpful for eastward travel.</li>
              <li><strong className="text-on-surface">Light in the evening</strong> delays your clock — helpful for westward travel.</li>
              <li><strong className="text-on-surface">Avoiding light at the wrong time</strong> is equally important — use blackout curtains or blue-light blocking glasses when light would push your clock in the wrong direction.</li>
            </ul>
            <p>
              A practical rule: after crossing more than 6 time zones eastward, avoid outdoor sunlight during the first
              morning at the destination (your body may interpret it as &quot;evening&quot; light and delay your clock further).
              Instead, seek bright light in the late morning.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Melatonin for Jet Lag: Timing Matters
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Low-dose melatonin (0.5–1 mg) taken at the destination&apos;s target bedtime is one of the most
              evidence-supported interventions for jet lag. A 2002 Cochrane review of 10 randomised trials found
              melatonin significantly reduced jet lag scores when taken correctly — but the timing must match the
              direction of travel:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Eastward travel</strong>: Take melatonin at destination bedtime, starting the night you arrive or even 3 nights before departure if preparing in advance.</li>
              <li><strong className="text-on-surface">Westward travel</strong>: Less evidence supports melatonin use; the natural clock drift works with you.</li>
            </ul>
            <p className="text-xs italic">
              Consult a healthcare provider before using melatonin, especially if you take other medications or have
              health conditions.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Pre-Flight Strategies That Actually Work
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              For trips of 5+ time zones, starting adjustment before departure can meaningfully reduce recovery time:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-on-surface">Eastward:</strong> Shift bedtime 1 hour earlier for 3 nights before departure. Seek morning light each day.</li>
              <li><strong className="text-on-surface">Westward:</strong> Shift bedtime 1 hour later for 3 nights before departure. Seek evening light.</li>
              <li><strong className="text-on-surface">Hydration:</strong> Cabin air humidity is typically 10–20%, well below optimal 40–60%. Dehydration worsens fatigue and disrupts sleep. Drink 250ml of water per hour of flight.</li>
              <li><strong className="text-on-surface">Alcohol:</strong> Avoid inflight alcohol — it increases arousals and reduces sleep quality significantly, compounding jet lag.</li>
              <li><strong className="text-on-surface">Caffeine timing:</strong> Use caffeine strategically. During an overnight eastward flight, avoid it in the last 8 hours of flight so you can sleep at destination bedtime.</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/jet-lag-calculator" />
      </div>

      <AffiliateCard context="supplement" />
      <MedicalDisclaimer />
    </article>
  );
}
