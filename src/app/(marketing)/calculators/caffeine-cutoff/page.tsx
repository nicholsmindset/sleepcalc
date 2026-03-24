import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQ } from '@/components/content/FAQ';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import CaffeineCalculator from '@/components/calculators/CaffeineCalculator';

export const metadata: Metadata = {
  title: 'Caffeine Sleep Calculator — When to Stop Drinking Coffee',
  description:
    'Find out exactly when to stop drinking coffee, tea, and energy drinks based on your bedtime. See how caffeine affects your sleep with our real-time decay calculator.',
  alternates: {
    canonical: '/calculators/caffeine-cutoff',
  },
  openGraph: {
    title: 'Caffeine Sleep Calculator — When to Stop Drinking Coffee',
    description:
      'Find out exactly when to stop drinking coffee, tea, and energy drinks based on your bedtime.',
    url: '/calculators/caffeine-cutoff',
    siteName: 'Sleep Stack',
  },
};

const FAQ_ITEMS = [
  {
    question: 'How long before bed should I stop drinking coffee?',
    answer:
      'Most sleep researchers recommend stopping caffeine at least 6 to 8 hours before bedtime. For a standard cup of drip coffee containing 95 mg of caffeine, approximately 4.7 hours are needed for the caffeine to decay to half its original level. To reach the sleep-safe threshold of around 50 mg, you need roughly 4.6 hours. However, if you drink stronger beverages like cold brew (200 mg), you need closer to 10 hours. Individual metabolism varies significantly, so use this calculator with your actual beverages to get a personalized recommendation.',
  },
  {
    question: 'Does caffeine actually affect sleep quality?',
    answer:
      'Yes, research consistently shows that caffeine impairs sleep quality even when you feel like you fall asleep normally. A 2013 study in the Journal of Clinical Sleep Medicine found that consuming caffeine 6 hours before bed reduced total sleep time by over 40 minutes. Caffeine primarily reduces deep sleep (slow-wave sleep), which is critical for physical recovery, immune function, and memory consolidation. Even moderate caffeine levels at bedtime (50 to 100 mg) can increase sleep latency, reduce sleep efficiency, and cause more nighttime awakenings.',
  },
  {
    question: 'What is caffeine half-life?',
    answer:
      'Caffeine half-life is the time it takes for your body to eliminate half the caffeine in your system. The average half-life in healthy adults is about 5 hours, but it ranges from 1.5 to 9.5 hours depending on genetics, liver function, age, and other factors. For example, if you drink a 200 mg cold brew at noon, you would still have approximately 100 mg in your system at 5 PM, and about 50 mg at 10 PM. Oral contraceptives can nearly double caffeine half-life, while smoking tends to decrease it.',
  },
  {
    question: 'Is afternoon tea safe for sleep?',
    answer:
      'It depends on the type of tea and when you drink it. Green tea contains roughly 28 mg of caffeine per cup, which is low enough that an afternoon cup (around 2 to 3 PM) will typically decay to negligible levels by an 11 PM bedtime. Black tea at 47 mg per cup has slightly more but is still generally safe in the early afternoon. However, matcha can contain 70 mg per serving, so treat it more like coffee. Herbal teas like chamomile, valerian, and passionflower contain zero caffeine and can actually promote sleep.',
  },
  {
    question: 'Do energy drinks affect sleep worse than coffee?',
    answer:
      'Energy drinks and coffee affect sleep through the same mechanism — caffeine blocking adenosine receptors. The key difference is caffeine content and additional stimulants. A standard energy drink has about 80 mg of caffeine (similar to a cup of coffee), but larger cans can contain 200 to 300 mg. Some energy drinks also contain taurine, guarana (which adds more caffeine), and B vitamins that may have additional stimulant effects. The sugar content in non-diet energy drinks can also disrupt sleep by causing blood sugar fluctuations during the night.',
  },
  {
    question: 'Can I build a tolerance to caffeine and sleep fine?',
    answer:
      'You can develop tolerance to some of caffeine\'s effects, such as feeling more alert, but research suggests your sleep is still negatively affected even if you feel adapted. A 2023 study found that habitual coffee drinkers who reported "sleeping fine" with evening caffeine still showed reduced deep sleep and lower sleep efficiency on EEG monitoring compared to caffeine-free nights. Your brain may tolerate the wakefulness effects, but the disruption to sleep architecture — particularly deep sleep suppression — persists regardless of tolerance.',
  },
];

export default function CaffeineCutoffPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: 'Caffeine Sleep Calculator',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description:
            'Calculate when to stop drinking coffee, tea, and energy drinks based on your bedtime using real-time caffeine decay modeling.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />

      <div className="relative">
        <div className="star-field fixed inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
          {/* Breadcrumbs */}
          <div className="pt-8">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Calculators', href: '/calculators' },
                { label: 'Caffeine Calculator', href: '/calculators/caffeine-cutoff' },
              ]}
            />
          </div>

          {/* Header */}
          <section className="pb-8 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
              Caffeine Sleep Calculator
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Log your drinks, set your bedtime, and see exactly how caffeine
              decays in your body. Find out the latest safe time for your last
              cup.
            </p>
          </section>

          {/* Calculator */}
          <CaffeineCalculator />

          {/* Educational content */}
          <article className="py-12 max-w-3xl mx-auto">
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-on-surface">
                How Caffeine Affects Your Sleep
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Caffeine is the most widely consumed psychoactive substance on
                  earth, and for good reason: it sharpens focus, elevates mood,
                  and fights fatigue. But the same mechanism that keeps you alert
                  during the day can wreak havoc on your sleep if you time it
                  poorly.
                </p>
                <p>
                  Caffeine works by blocking adenosine receptors in your brain.
                  Adenosine is a neurotransmitter that accumulates throughout the
                  day and creates the feeling of sleepiness known as sleep
                  pressure. When caffeine occupies those receptors, adenosine
                  cannot signal the brain to wind down, so you stay alert even
                  when your body is ready for rest.
                </p>
                <p>
                  The problem is that adenosine does not disappear just because
                  caffeine is blocking its receptors. It continues to build up
                  behind the scenes. Once the caffeine wears off, the accumulated
                  adenosine floods those receptors all at once, which is why a
                  caffeine crash can feel so sudden and intense. If caffeine is
                  still active at bedtime, it prevents your brain from responding
                  to normal sleep signals, increasing the time it takes to fall
                  asleep (sleep latency) and reducing the amount of restorative
                  deep sleep you get.
                </p>
                <p>
                  Research published in the{' '}
                  <em>Journal of Clinical Sleep Medicine</em> found that consuming
                  400 mg of caffeine (roughly four cups of coffee) even 6 hours
                  before bed still reduced total sleep time by more than an hour.
                  Even moderate amounts consumed in the afternoon can suppress
                  slow-wave sleep, the deepest stage of non-REM sleep responsible
                  for tissue repair, immune function, and memory consolidation.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-on-surface">
                Caffeine Half-Life Explained
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  The concept of half-life is central to understanding how long
                  caffeine stays active in your body. Caffeine half-life is the
                  time it takes for your body to eliminate exactly half the
                  caffeine you consumed. In healthy adults, the average
                  half-life is approximately 5 hours, though this number varies
                  significantly from person to person.
                </p>
                <p>
                  Here is how the math works in practice. If you drink a cup of
                  drip coffee containing 95 mg of caffeine at 8:00 AM, by 1:00
                  PM (5 hours later) you will have about 47.5 mg remaining. By
                  6:00 PM, that drops to roughly 24 mg. By 11:00 PM, only about
                  12 mg remains in your system, which is well below the sleep-safe
                  threshold of 50 mg.
                </p>
                <p>
                  However, the story changes dramatically if you drink that same
                  coffee at 2:00 PM. By 7:00 PM you still have 47.5 mg. By
                  midnight, you are at roughly 20 mg. That may sound fine, but if
                  you had a second coffee at 3:00 PM, both doses are stacking:
                  the combined total at 11:00 PM could be 60 mg or more,
                  comfortably above the threshold where sleep disruption begins.
                </p>
                <p>
                  Several factors alter your personal caffeine half-life.
                  Genetics play the largest role: variations in the CYP1A2 liver
                  enzyme determine whether you are a fast or slow caffeine
                  metabolizer. Oral contraceptives can nearly double caffeine
                  half-life. Pregnancy increases it to 9 to 11 hours by the third
                  trimester. Smoking accelerates caffeine clearance, while liver
                  disease and certain medications (particularly fluvoxamine and
                  some fluoroquinolone antibiotics) can extend it considerably.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-on-surface">
                Caffeine Content by Beverage
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  Not all caffeinated drinks are created equal. Understanding the
                  caffeine content in your favorite beverages helps you make
                  informed decisions about when to stop.
                </p>
              </div>

              {/* Beverage table */}
              <div className="glass-card rounded-2xl overflow-hidden mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/15">
                      <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                        Beverage
                      </th>
                      <th className="text-right py-3 px-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                        Caffeine (mg)
                      </th>
                      <th className="text-right py-3 px-4 text-[10px] uppercase tracking-widest text-on-surface-variant font-label hidden sm:table-cell">
                        Serving
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-on-surface-variant">
                    {[
                      ['Drip Coffee', '95', '8 oz'],
                      ['Espresso (single shot)', '63', '1 oz'],
                      ['Cold Brew Coffee', '200', '16 oz'],
                      ['Black Tea', '47', '8 oz'],
                      ['Green Tea', '28', '8 oz'],
                      ['Matcha Latte', '70', '8 oz'],
                      ['Energy Drink', '80', '8.4 oz'],
                      ['Large Energy Drink', '200-300', '16 oz'],
                      ['Diet Cola', '46', '12 oz'],
                      ['Dark Chocolate Bar', '23', '1 oz'],
                      ['Pre-Workout Supplement', '150-300', '1 scoop'],
                      ['Decaf Coffee', '2-15', '8 oz'],
                    ].map(([name, mg, serving]) => (
                      <tr
                        key={name}
                        className="border-b border-outline-variant/5 hover:bg-surface-container-high/20 transition-colors"
                      >
                        <td className="py-2.5 px-4 text-on-surface font-medium">
                          {name}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono">
                          {mg}
                        </td>
                        <td className="py-2.5 px-4 text-right hidden sm:table-cell">
                          {serving}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4 mt-4">
                <p>
                  Keep in mind that these are approximate values. Actual caffeine
                  content varies based on bean variety, brew method, water
                  temperature, and steeping time. A Starbucks Grande (16 oz) drip
                  coffee, for example, contains approximately 310 mg of caffeine,
                  more than three times a standard 8 oz cup. Always check the
                  label on commercial beverages and adjust your intake
                  accordingly.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4 text-on-surface">
                Tips for Managing Caffeine and Sleep
              </h2>
              <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                <p>
                  <strong className="text-on-surface">
                    Set a personal caffeine cutoff time.
                  </strong>{' '}
                  Use this calculator to determine when your last caffeinated
                  beverage should be, based on your actual bedtime and the drinks
                  you consume. For most people, this means no coffee after early
                  to mid-afternoon. Write it down, set a phone alarm, or stick a
                  note on your coffee machine.
                </p>
                <p>
                  <strong className="text-on-surface">
                    Front-load your caffeine intake.
                  </strong>{' '}
                  Drink your strongest caffeinated beverages in the morning and
                  taper to weaker ones as the day progresses. Start with coffee in
                  the morning, switch to tea after lunch, and move to herbal tea
                  or water by mid-afternoon. This approach maintains daytime
                  alertness while allowing caffeine to clear before bed.
                </p>
                <p>
                  <strong className="text-on-surface">
                    Watch for hidden caffeine sources.
                  </strong>{' '}
                  Caffeine hides in unexpected places: chocolate, certain pain
                  relievers (Excedrin contains 65 mg per tablet), some ice creams
                  and yogurts, protein bars, and even decaf coffee which can
                  contain up to 15 mg per cup. Read labels carefully, especially
                  for anything consumed after your cutoff time.
                </p>
                <p>
                  <strong className="text-on-surface">
                    Substitute, do not just subtract.
                  </strong>{' '}
                  If cutting afternoon caffeine leaves you in an energy slump,
                  replace it with strategies that genuinely boost alertness: a
                  10-minute walk outside, a glass of cold water, a brief
                  mindfulness break, or a short power nap (20 minutes or less).
                  These provide real energy without interfering with nighttime
                  sleep.
                </p>
                <p>
                  <strong className="text-on-surface">
                    Track your sensitivity over time.
                  </strong>{' '}
                  Everyone metabolizes caffeine differently. Pay attention to
                  patterns in your sleep quality relative to your caffeine intake.
                  If you connect a wearable device to{' '}
                  <strong className="text-[#46eae5]">Sleep Stack Pro</strong>,
                  you can correlate your actual sleep stages, deep sleep duration,
                  and sleep efficiency with your daily caffeine log for data-driven
                  optimization.
                </p>
                <p>
                  <strong className="text-on-surface">
                    Be patient with changes.
                  </strong>{' '}
                  If you are used to late-day caffeine, cutting it back may cause
                  temporary fatigue and headaches for 2 to 9 days as your body
                  adjusts. This withdrawal period is short-lived, and most people
                  report feeling more naturally energetic within a week once their
                  sleep quality improves.
                </p>
              </div>
            </section>
          </article>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <FAQ items={FAQ_ITEMS} />
          </div>

          {/* Related Tools */}
          <div className="max-w-3xl mx-auto">
            <RelatedTools exclude="/calculators/caffeine-cutoff" />
          </div>

          {/* Medical Disclaimer */}
          <div className="max-w-3xl mx-auto">
            <MedicalDisclaimer />
          </div>

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
}
