import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import SleepDebtCalculator from '@/components/calculators/SleepDebtCalculator';
import { FAQ } from '@/components/content/FAQ';
import { RelatedTools } from '@/components/content/RelatedTools';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import AffiliateCard from '@/components/content/AffiliateCard';

export const metadata: Metadata = {
  title: 'Sleep Debt Calculator — How Much Sleep Do You Owe?',
  description:
    'Calculate your accumulated sleep debt based on the past week. Get a personalized recovery plan to pay back your sleep deficit and improve your health.',
  alternates: {
    canonical: '/calculators/sleep-debt',
  },
  openGraph: {
    title: 'Sleep Debt Calculator — How Much Sleep Do You Owe?',
    description:
      'Calculate your accumulated sleep debt and get a personalized recovery plan to pay back your sleep deficit.',
    url: '/calculators/sleep-debt',
    siteName: 'Sleep Stack',
  },
};

const faqItems = [
  {
    question: 'How is sleep debt calculated?',
    answer:
      'Sleep debt is the difference between the amount of sleep you need and the amount you actually get. Our calculator compares each night of your past week against the National Sleep Foundation recommendation for your age group. The deficits add up cumulatively, though surplus sleep on good nights can partially offset prior shortfalls. The result is your net accumulated sleep debt in hours.',
  },
  {
    question: 'Can you catch up on lost sleep over the weekend?',
    answer:
      'You can partially recover from mild sleep debt by sleeping longer on weekends, but it is not a reliable long-term strategy. Research from the University of Colorado Boulder showed that weekend recovery sleep does not fully reverse the metabolic disruption caused by weekday sleep restriction. The most effective approach is consistent, adequate sleep every night. That said, for occasional short-term deficits, an extra hour or two on Saturday and Sunday can help.',
  },
  {
    question: 'How much sleep debt is dangerous?',
    answer:
      'Any amount of chronic sleep debt carries health risks, but the effects become more pronounced above 5 hours of accumulated deficit. At that level, studies show measurable declines in reaction time, working memory, and immune function. Beyond 10 hours of debt, the impairment is comparable to being legally intoxicated. If you consistently accumulate more than 10 hours of sleep debt per week, it is worth discussing with a healthcare provider.',
  },
  {
    question: 'Does sleep debt go away on its own?',
    answer:
      'Sleep debt does not simply vanish with time. Your body tracks the deficit and continues to show the effects until you have actively paid it back through additional sleep. However, the relationship is not perfectly linear. Very old sleep debt (accumulated over months) partially dissipates because your body adapts, albeit at a cost to long-term health. Recent debt from the past week or two is the most actionable to address.',
  },
  {
    question: 'Why do I still feel tired even though I slept 8 hours?',
    answer:
      'Total hours in bed do not always equal quality sleep. You may be spending time awake without realizing it, experiencing fragmented sleep from noise or temperature, or missing out on deep and REM stages. Sleep disorders like apnea can cause you to spend adequate time asleep while still waking unrefreshed. Other factors include alcohol consumption before bed, late caffeine intake, and irregular sleep schedules that confuse your circadian rhythm.',
  },
  {
    question: 'How long does it take to recover from sleep debt?',
    answer:
      'Recovery time depends on the size of your debt and how aggressively you address it. A mild deficit of 3-5 hours can be recovered in 2-4 days by adding an extra 1-2 hours per night. Moderate debt of 5-10 hours typically takes a full week. Severe, chronic sleep debt that has built up over months may require several weeks of consistent, slightly longer sleep. Attempting to recover too quickly by sleeping 12+ hours in a single night can actually disrupt your circadian rhythm and make things worse.',
  },
];

export default function SleepDebtPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: 'Sleep Stack Sleep Debt Calculator',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          description: metadata.description,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Calculators', href: '/calculators' },
          { label: 'Sleep Debt Calculator', href: '/calculators/sleep-debt' },
        ]}
      />

      {/* Page Header */}
      <header className="mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
          Sleep Debt Calculator
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
          Enter how many hours you slept each night over the past week. We will compare your actual
          sleep against the recommended amount for your age and show you exactly how much sleep you
          owe your body, plus a realistic plan to recover.
        </p>
      </header>

      {/* Calculator */}
      <SleepDebtCalculator />

      {/* Educational Content */}
      <section className="py-12 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          What Is Sleep Debt?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Sleep debt is the running total of sleep you have missed relative to what your body
            actually needs. If you need 8 hours per night and consistently get 6, you accumulate 2
            hours of debt each day. After a standard work week, that adds up to 10 hours, roughly
            the equivalent of missing an entire night of sleep.
          </p>
          <p>
            There are two types of sleep debt that behave differently. Acute sleep debt builds up
            over days or a couple of weeks and is directly recoverable through extra sleep. This is
            what most people experience after a busy week, a few late nights studying, or a stretch
            of poor sleep from travel. Your body keeps close track of this deficit and will actively
            push you toward recovery through increased sleepiness and longer sleep when given the
            opportunity.
          </p>
          <p>
            Chronic sleep debt is more insidious. When you consistently under-sleep for months or
            years, your body partially adapts to the deprivation. You stop feeling as sleepy, which
            tricks you into believing you have adjusted. But the underlying damage continues. Studies
            from the University of Pennsylvania found that people restricted to 6 hours of sleep per
            night for two weeks performed as poorly on cognitive tests as people who had been totally
            sleep-deprived for two days, yet they rated their own sleepiness as only slightly
            elevated. This gap between perceived and actual impairment is one of the most dangerous
            aspects of chronic sleep debt.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            How Sleep Debt Accumulates
          </h3>
          <p>
            Your body operates on a sleep-wake homeostatic system. Every hour you spend awake
            increases the pressure to sleep by building up a chemical called adenosine in your brain.
            When you sleep, adenosine is cleared. If you do not sleep long enough, some adenosine
            remains, and this residual pressure carries forward into the next day. Caffeine works by
            temporarily blocking adenosine receptors, which is why it masks tiredness without
            actually resolving the underlying debt.
          </p>
          <p>
            The deficit is not just about total hours either. Missing specific sleep stages matters
            too. If your deep sleep or REM sleep is cut short because you went to bed too late or
            woke up too early, the restorative benefits of those stages are lost regardless of
            whether you technically spent enough hours in bed. This is why sleep quality and
            consistency matter as much as raw duration.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Signs of Sleep Debt
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Sleep debt affects nearly every system in your body. The signs are often subtle at first,
            which makes it easy to attribute them to other causes like stress, aging, or simply being
            busy. Here are the most common indicators across three categories.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Cognitive Symptoms
          </h3>
          <p>
            The brain is the first organ to show the effects of insufficient sleep. You may notice
            difficulty concentrating on tasks that normally feel routine, increased forgetfulness, and
            slower reaction times. Decision-making becomes more impulsive because the prefrontal
            cortex, responsible for judgment and impulse control, is highly sensitive to sleep loss.
            Creative problem-solving declines, and you may find yourself reading the same paragraph
            multiple times without absorbing it.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Physical Symptoms
          </h3>
          <p>
            Your body responds to sleep debt with measurable physiological changes. Appetite
            increases, particularly for high-calorie, high-carbohydrate foods, because sleep
            deprivation raises ghrelin (the hunger hormone) and suppresses leptin (the satiety
            hormone). Your immune system weakens: a study published in the journal Sleep found that
            people sleeping fewer than 7 hours per night were nearly three times more likely to
            develop a cold when exposed to the virus. You may also experience muscle soreness,
            slower recovery from exercise, and elevated resting heart rate.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Emotional Symptoms
          </h3>
          <p>
            Emotional regulation is closely tied to sleep. With accumulated debt, irritability
            increases and your threshold for frustration drops. You may experience mood swings,
            heightened anxiety, or a general sense of feeling overwhelmed by tasks that would
            normally feel manageable. Research from the University of California, Berkeley showed
            that one night of sleep deprivation increased amygdala reactivity by 60%, meaning
            emotional responses become exaggerated and harder to control.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          How to Pay Back Sleep Debt
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            The good news is that acute sleep debt can be fully recovered. The key is a gradual
            approach that works with your circadian rhythm rather than against it. Here are the most
            effective strategies.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Gradual Recovery
          </h3>
          <p>
            The most sustainable method is to add 1 to 2 extra hours of sleep per night until your
            debt is cleared. Go to bed 30-60 minutes earlier than usual rather than sleeping in
            later, because moving your bedtime earlier preserves your wake time and keeps your
            circadian clock stable. For a 7-hour debt, this approach takes about a week. Avoid the
            temptation to sleep 12 hours in a single night, which can leave you feeling groggy due
            to sleep inertia and disrupt your rhythm for the following days.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Weekend Strategy
          </h3>
          <p>
            If adding sleep on weeknights is difficult due to work or family obligations, weekends
            offer a window for slightly longer recovery sleep. Aim for no more than 2 extra hours
            beyond your normal schedule. Sleeping until noon on Saturday might feel restorative in
            the moment, but it shifts your body clock and makes Sunday night sleep harder, creating a
            pattern sometimes called social jet lag. A better approach is to sleep in by one hour and
            also go to bed one hour earlier.
          </p>

          <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
            Strategic Napping
          </h3>
          <p>
            Naps can help bridge the gap while you are actively recovering from sleep debt. A 20-
            minute power nap between 1:00 and 3:00 PM can restore alertness without interfering with
            nighttime sleep. Longer naps of 60-90 minutes can include a full sleep cycle and help
            with memory consolidation, but should only be used if your nighttime sleep is not at risk
            of being delayed. Never nap after 4:00 PM, as it will almost certainly push your bedtime
            later and perpetuate the cycle.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-3xl mx-auto">
        <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-on-surface">
          Preventing Sleep Debt
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Prevention is far more effective than recovery. Once you have paid back your current
            debt, these habits will help you stay at zero.
          </p>
          <p>
            <strong className="text-on-surface">Set a non-negotiable bedtime.</strong> Choose a time
            that gives you your full recommended hours before your alarm goes off, and treat it like
            a meeting you cannot reschedule. Most people underestimate how long it takes to actually
            fall asleep. Build in a 15-20 minute buffer for sleep onset.
          </p>
          <p>
            <strong className="text-on-surface">Anchor your wake time.</strong> Waking up at the
            same time every day, including weekends, is the single most powerful tool for regulating
            your circadian rhythm. Your body clock depends on consistent light exposure in the
            morning to calibrate its 24-hour cycle. Varying your wake time by even 90 minutes can
            shift your entire rhythm.
          </p>
          <p>
            <strong className="text-on-surface">Control your light environment.</strong> Bright
            light in the morning tells your brain it is daytime. Dim light in the evening signals
            that sleep is approaching. Reduce overhead lights after sunset, switch devices to warm
            mode or use blue-light filters, and consider blackout curtains if your bedroom gets
            outside light. Morning sunlight exposure within the first hour of waking is particularly
            effective at setting your clock.
          </p>
          <p>
            <strong className="text-on-surface">Watch your caffeine window.</strong> Caffeine has a
            half-life of 5-7 hours, meaning half the caffeine from your 2:00 PM coffee is still
            active in your system at 9:00 PM. Most sleep researchers recommend a hard cutoff 8-10
            hours before bedtime. If you go to bed at 10:30 PM, your last cup should be no later
            than 12:30 PM.
          </p>
          <p>
            <strong className="text-on-surface">Create a wind-down routine.</strong> The transition
            from wakefulness to sleep is not a switch you can flip. Give your body 30-60 minutes of
            low-stimulation activity before bed. This could be reading, gentle stretching, a warm
            shower, or quiet conversation. The consistency of the routine matters more than the
            specific activities, as it trains your brain to associate these cues with the onset of
            sleep.
          </p>
          <p>
            <strong className="text-on-surface">Track your sleep honestly.</strong> Whether you use
            a wearable device, a sleep diary, or this calculator, the act of monitoring your sleep
            makes you more accountable. Most people overestimate their sleep by 30-60 minutes per
            night. Objective tracking closes that gap and helps you catch developing debt early
            before it compounds.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <FAQ items={faqItems} />
      </div>

      {/* Affiliate */}
      <div className="max-w-3xl mx-auto">
        <AffiliateCard context="supplement" />
      </div>

      {/* Related Tools */}
      <div className="max-w-3xl mx-auto">
        <RelatedTools exclude="/calculators/sleep-debt" />
      </div>

      {/* Medical Disclaimer */}
      <div className="max-w-3xl mx-auto">
        <MedicalDisclaimer />
      </div>
    </div>
    </>
  );
}
