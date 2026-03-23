import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AdSlot } from '@/components/layout/AdSlot';
import { FAQ } from '@/components/content/FAQ';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import NapCalculator from '@/components/calculators/NapCalculator';

export const metadata: Metadata = {
  title: 'Nap Calculator — Find Your Perfect Nap Time',
  description:
    'Calculate the ideal nap duration and timing based on sleep science. Choose between power naps, recovery naps, and full-cycle naps for maximum benefit.',
  alternates: {
    canonical: '/calculators/nap-calculator',
  },
  openGraph: {
    title: 'Nap Calculator — Find Your Perfect Nap Time',
    description:
      'Calculate the ideal nap duration and timing. Choose between power naps, recovery naps, and full-cycle naps.',
    url: '/calculators/nap-calculator',
    siteName: 'Drift Sleep',
  },
};

const faqItems = [
  {
    question: 'How long should a power nap be?',
    answer:
      'A power nap should last about 20 minutes of actual sleep time, plus around 5 minutes to fall asleep. This keeps you in the lighter stages of sleep (N1 and N2), so you wake up feeling refreshed without the grogginess that comes from entering deep sleep. Research published in the journal Sleep found that naps of 10 to 20 minutes produced the most benefit for alertness and cognitive performance.',
  },
  {
    question: 'Is it bad to nap after 3 PM?',
    answer:
      'Napping after 3 PM can interfere with your ability to fall asleep at your regular bedtime. Your body builds up sleep pressure (adenosine) throughout the day, and a late nap discharges some of that pressure, making it harder to feel sleepy at night. If you must nap late, keep it under 20 minutes to minimize the impact on your nighttime sleep quality.',
  },
  {
    question: 'Why do I feel worse after a 45-minute nap?',
    answer:
      'A 45-minute nap often puts you into deep sleep (N3 stage) but wakes you before you complete the full cycle. Waking from deep sleep causes sleep inertia, a period of grogginess and reduced cognitive performance that can last 15 to 30 minutes. To avoid this, nap for either 20 minutes (staying in light sleep) or 90 minutes (completing a full sleep cycle and waking during light sleep).',
  },
  {
    question: 'How does caffeine affect napping?',
    answer:
      'Caffeine blocks adenosine receptors in your brain, which are the same receptors that create the feeling of sleepiness. If you have caffeine within 1 to 2 hours of napping, you may find it difficult to fall asleep. However, a "coffee nap" strategy, where you drink coffee immediately before a 20-minute nap, can work because caffeine takes about 20 minutes to reach peak effect. You wake up just as the caffeine kicks in, combining the restorative benefits of the nap with the stimulating effects of caffeine.',
  },
  {
    question: 'Can napping replace lost sleep?',
    answer:
      'Napping can partially compensate for lost sleep by improving alertness, mood, and cognitive performance, but it cannot fully replace a lost night of sleep. During a full night, your body cycles through multiple stages including extended periods of deep sleep and REM sleep that are difficult to replicate in a short nap. A 90-minute full-cycle nap comes closest by including one complete cycle, but chronic sleep debt requires restoring consistent nighttime sleep habits.',
  },
  {
    question: 'What is the best time of day to nap?',
    answer:
      'The ideal nap window is between 1 PM and 3 PM for most people. This coincides with a natural dip in your circadian rhythm, often called the post-lunch dip, which occurs regardless of whether you have eaten. Your core body temperature drops slightly and your alertness naturally decreases during this period, making it easier to fall asleep quickly. Napping during this window also leaves enough time before your evening bedtime to rebuild adequate sleep pressure.',
  },
];

export default function NapCalculatorPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: 'Drift Sleep Nap Calculator',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description: metadata.description,
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
                { label: 'Nap Calculator', href: '/calculators/nap-calculator' },
              ]}
            />
          </div>

          {/* Hero */}
          <section className="pb-10 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
              Nap Calculator
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
              Find the perfect nap length and timing so you wake up refreshed
              without disrupting tonight&apos;s sleep. Choose your nap type,
              set your alarm, and let sleep science do the rest.
            </p>
          </section>

          {/* Calculator */}
          <section className="mb-12">
            <NapCalculator />
          </section>

          {/* Ad slot */}
          <AdSlot slot="nap-calc-below" format="leaderboard" className="mb-12" />

          {/* Educational content */}
          <section className="py-12 max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
              The Science of Napping
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
              <p>
                Napping is not a sign of laziness. It is a biologically driven behavior rooted in your
                circadian rhythm. Humans are one of the few mammals that consolidate sleep into a single
                long period, but our internal clocks still produce a natural dip in alertness during the
                early afternoon, typically between 1 PM and 3 PM. This post-lunch dip occurs even if you
                skip lunch, because it is governed by your circadian pacemaker in the suprachiasmatic
                nucleus, not by food intake.
              </p>
              <p>
                Research from NASA found that pilots who took a planned 26-minute nap during long-haul
                flights improved their alertness by 54 percent and their overall performance by 34 percent
                compared to those who did not nap. Studies at the University of California, Berkeley showed
                that a 90-minute nap improved the ability to learn new information by restoring hippocampal
                function, effectively clearing short-term memory to make room for fresh input.
              </p>
              <p>
                The key to napping well lies in understanding what happens inside your brain during different
                nap durations. Sleep is not a uniform state. From the moment you close your eyes, your brain
                transitions through distinct stages, each with its own benefits and risks if interrupted at
                the wrong moment.
              </p>
            </div>
          </section>

          <section className="py-12 max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
              Types of Naps
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-6">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Power Nap (15 to 20 Minutes)
                </h3>
                <p>
                  The power nap is the most efficient form of daytime sleep. During the first 20 minutes of
                  a nap, you remain in the lighter sleep stages, N1 and N2. In N2, your brain produces sleep
                  spindles, brief bursts of electrical activity that help consolidate procedural memory
                  (skills and how-to knowledge) and protect the brain from being awakened by external noise.
                </p>
                <p>
                  Because you never descend into deep sleep, waking from a power nap is quick and clean.
                  Within one to two minutes of opening your eyes, you are fully alert. A 2006 study in the
                  journal Sleep compared naps of 5, 10, 20, and 30 minutes and found that the 10-to-20-minute
                  range produced the most immediate improvements in alertness, cognitive performance, and mood,
                  with benefits lasting up to three hours after waking.
                </p>
                <p>
                  Power naps are ideal for a midday boost when you need to stay productive. They are short
                  enough that they do not reduce your homeostatic sleep drive (the pressure to sleep at night)
                  in any meaningful way, making them safe to take even in the late afternoon in most cases.
                </p>
              </div>

              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Recovery Nap (60 Minutes)
                </h3>
                <p>
                  A 60-minute nap takes you into stage N3, also known as slow-wave sleep or deep sleep. This
                  is the stage where your body releases growth hormone, repairs muscle tissue, and strengthens
                  the immune system. Deep sleep is also critical for declarative memory consolidation, the type
                  of memory that stores facts, events, and learned information.
                </p>
                <p>
                  The trade-off with a recovery nap is sleep inertia. Because you are waking from deep sleep
                  rather than light sleep, you may feel groggy and disoriented for 15 to 30 minutes after
                  the alarm goes off. This is why the recovery nap is best used when you have time to shake
                  off the initial fog before you need to perform at your best.
                </p>
                <p>
                  Recovery naps are most useful when you have accumulated significant sleep debt, such as after
                  a night of poor sleep, during illness recovery, or when training for endurance athletics.
                  The deep sleep you gain helps offset the physiological effects of sleep deprivation more
                  effectively than lighter nap stages can.
                </p>
              </div>

              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Full-Cycle Nap (90 Minutes)
                </h3>
                <p>
                  A 90-minute nap covers one complete sleep cycle: light sleep, deep sleep, and REM sleep. The
                  full cycle is significant because it ends in light sleep, the same stage where you started.
                  This means you wake up feeling alert rather than groggy, despite having been asleep for much
                  longer than a power nap.
                </p>
                <p>
                  The REM stage included in a full-cycle nap is where emotional processing and creative
                  problem-solving occur. Research from the University of California, San Diego found that REM
                  sleep enhanced creative integration, participants who napped with REM sleep were 40 percent
                  better at finding hidden connections in word-association tasks compared to those who napped
                  without reaching REM or who rested quietly while awake.
                </p>
                <p>
                  Full-cycle naps are best reserved for weekends, rest days, or when you are recovering from
                  extreme sleep deprivation. Because they discharge a meaningful amount of sleep pressure, taking
                  a 90-minute nap too close to bedtime can delay your sleep onset by 30 minutes or more and
                  reduce your total nighttime deep sleep.
                </p>
              </div>
            </div>
          </section>

          <section className="py-12 max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
              When to Nap (and When Not To)
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
              <p>
                The ideal nap window is between 1 PM and 3 PM. This window aligns with your circadian
                afternoon dip, when your core body temperature drops slightly and your alertness naturally
                decreases. Napping during this period means you fall asleep faster, your nap is more
                restorative, and the timing leaves enough evening hours to rebuild adequate sleep pressure
                before bedtime.
              </p>
              <p>
                Avoid napping after 3 PM unless you work a late shift or have an unusually late bedtime.
                Late naps reduce the adenosine buildup that makes you feel sleepy at night. Adenosine is a
                neurotransmitter that accumulates during waking hours and is one of the primary drivers of
                your desire to sleep. A late nap clears some of that adenosine, which can push your sleep
                onset later and reduce the amount of deep sleep you get in the first half of the night.
              </p>
              <p>
                Certain situations call for skipping the nap entirely. If you are struggling with insomnia
                or difficulty falling asleep at night, napping can make the problem worse by reducing your
                sleep drive. Cognitive behavioral therapy for insomnia (CBT-I), the gold-standard treatment
                for chronic insomnia, typically recommends avoiding naps altogether until healthy nighttime
                sleep patterns are restored.
              </p>
              <p>
                On the other hand, if you work rotating shifts, drive long distances, or operate heavy
                equipment, a strategic nap can be a safety measure. The National Sleep Foundation recommends
                a 20-minute nap before a night shift or long drive to reduce the risk of microsleeps,
                involuntary sleep episodes that last only a few seconds but can be fatal behind the wheel.
              </p>
            </div>
          </section>

          <section className="py-12 max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
              Napping Tips for Better Results
            </h2>
            <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
              <p>
                <strong className="text-on-surface">Set an alarm every time.</strong> The single most
                important nap habit is setting an alarm before you lie down. Without an alarm, a 20-minute
                power nap can easily become a 90-minute cycle or longer, which disrupts your nighttime sleep
                schedule and leaves you with sleep inertia. Our calculator shows you the exact alarm time so
                you do not have to do the math.
              </p>
              <p>
                <strong className="text-on-surface">Control your environment.</strong> A dark, cool,
                quiet space helps you fall asleep faster and sleep more deeply. If you cannot control the
                room, use an eye mask and earplugs. A slightly cool room (around 65 to 68 degrees Fahrenheit
                or 18 to 20 degrees Celsius) supports the natural temperature drop your body needs to
                initiate sleep.
              </p>
              <p>
                <strong className="text-on-surface">Try the coffee nap.</strong> Drink a cup of coffee
                immediately before a 20-minute power nap. Caffeine takes approximately 20 minutes to cross
                the blood-brain barrier and reach peak concentration, so you wake up just as the stimulant
                effect begins. A small study at Loughborough University found that participants who combined
                coffee with a short nap made fewer errors in a driving simulator than those who only napped
                or only drank coffee.
              </p>
              <p>
                <strong className="text-on-surface">Be consistent with timing.</strong> If you nap
                regularly, try to nap at the same time each day. Consistency trains your circadian system to
                anticipate the nap, which means you fall asleep faster and reach restorative sleep stages
                more quickly. An irregular nap schedule does not cause harm, but it takes longer to fall
                asleep and you may spend more of the nap in light stage N1 sleep rather than the more
                beneficial N2 stage.
              </p>
              <p>
                <strong className="text-on-surface">Do not nap to compensate for chronic sleep loss.</strong>{' '}
                If you are consistently sleeping fewer than seven hours at night, napping is a bandage, not a
                cure. Address the root cause of your sleep debt by adjusting your schedule, improving your
                sleep environment, or consulting a sleep specialist. Naps should supplement good sleep habits,
                not replace them.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <FAQ items={faqItems} />

          {/* Related tools */}
          <RelatedTools exclude="/calculators/nap-calculator" />

          {/* Medical disclaimer */}
          <MedicalDisclaimer />

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </div>
    </>
  );
}
