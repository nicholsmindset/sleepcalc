import type { Metadata } from 'next';
import { generateOgImageUrl } from '@/utils/seo';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { MedicalDisclaimer } from '@/components/content/MedicalDisclaimer';
import { RelatedTools } from '@/components/content/RelatedTools';
import SleepFoodsTool from './components/SleepFoodsTool';

export const metadata: Metadata = {
  title: 'Sleep-Friendly Foods — Best Foods to Eat Before Bed for Better Sleep',
  description:
    'Discover the best foods to eat before bed to improve sleep quality. Browse foods by tryptophan, magnesium, melatonin, B6, calcium, and potassium — and build your perfect evening snack.',
  alternates: { canonical: '/tools/sleep-foods' },
  openGraph: {
    title: 'Sleep-Friendly Foods — Best Foods to Eat Before Bed for Better Sleep',
    description:
      'Browse the top sleep-promoting foods by nutrient, build your ideal evening snack, and learn which foods to avoid before bed for better sleep.',
    url: '/tools/sleep-foods',
    siteName: 'Sleep Stack',
    images: [{ url: generateOgImageUrl('Sleep-Friendly Foods — Best Foods for Better Sleep'), width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function SleepFoodsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools', href: '/calculators' },
          { label: 'Sleep-Friendly Foods', href: '/tools/sleep-foods' },
        ]}
      />

      <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Foods That Help You Sleep
      </h1>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-10 max-w-2xl">
        The best sleep-supporting foods ranked by key nutrients — tryptophan, magnesium, melatonin,
        vitamin B6, calcium, and potassium. Build the perfect evening snack below.
      </p>

      {/* Interactive tool (client component) */}
      <SleepFoodsTool />

      {/* Static content (server-rendered for SEO) */}
      <section className="space-y-10 max-w-3xl">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            How Food Affects Sleep Quality
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Sleep and nutrition are more tightly linked than most people realise. The brain requires
              specific raw materials to synthesise sleep-regulating neurotransmitters — and many of these
              come directly from the food you eat in the hours before bed. Understanding the sleep-nutrient
              pathway can be the difference between lying awake at midnight and drifting off in minutes.
            </p>
            <p>
              The most important sleep-nutrition pathway starts with{' '}
              <strong className="text-on-surface">tryptophan</strong> — an essential amino acid found in
              protein-rich foods. Once consumed, tryptophan crosses the blood-brain barrier and is
              converted to serotonin (the mood and calm neurotransmitter), which is then converted to
              melatonin (the primary sleep hormone) when light levels fall. Without adequate dietary
              tryptophan, this cascade is limited regardless of how dark and cool your bedroom is.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            The Tryptophan–Carbohydrate Trick
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Tryptophan competes with other large amino acids to cross the blood-brain barrier via the
              same transporter. When you eat protein alone, tryptophan faces heavy competition and little
              reaches the brain. But when you pair tryptophan-rich foods with a small amount of complex
              carbohydrates, insulin is released — and insulin drives the competing amino acids into
              muscle, clearing the pathway for tryptophan.
            </p>
            <p>
              This is why the classic{' '}
              <strong className="text-on-surface">warm milk + small banana</strong> combination has
              genuine scientific backing as a sleep aid: the milk provides tryptophan and calcium, the
              banana provides the carbohydrate trigger plus B6 (needed to convert tryptophan) and a
              small amount of melatonin. Pair turkey with a few crackers, or Greek yogurt with a handful
              of oats, for the same synergistic effect.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Magnesium: The Relaxation Mineral
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Magnesium deficiency is more common than most people think — surveys suggest up to 50% of
              people in developed countries don&apos;t get adequate dietary magnesium. This matters
              enormously for sleep because magnesium activates the parasympathetic nervous system
              (rest-and-digest) and binds to GABA receptors in the brain, producing the same calming
              effect as the nervous system&apos;s natural brake.
            </p>
            <p>
              Magnesium also suppresses the stress hormone cortisol during the overnight period. Low
              magnesium correlates with elevated nocturnal cortisol, which increases arousals and
              prevents entry into slow-wave (deep) sleep. Pumpkin seeds, chia seeds, and dark chocolate
              are among the highest food sources, making a small portion of any of these a genuinely
              therapeutic pre-sleep choice.
            </p>
            <p>
              If you choose to supplement, <strong className="text-on-surface">magnesium glycinate</strong>{' '}
              or <strong className="text-on-surface">magnesium threonate</strong> are the most
              bioavailable forms for sleep support (200–400 mg, 30 minutes before bed). Magnesium oxide —
              the cheapest form — has poor absorption and is best avoided.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Tart Cherry Juice: The Most Studied Sleep Food
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              Tart (Montmorency) cherries and their juice are the most rigorously studied sleep foods.
              They contain an exceptionally high concentration of naturally occurring melatonin — a 240 ml
              glass of tart cherry juice delivers approximately 17,500 nanograms of melatonin, compared
              to 3–5 ng in typical melatonin supplements.
            </p>
            <p>
              A 2011 randomised crossover trial published in the{' '}
              <em>European Journal of Nutrition</em> found that adults who drank two glasses of tart
              cherry juice daily for one week increased total sleep time by 25 minutes and sleep
              efficiency by 5–6% compared to placebo. A 2014 follow-up in older adults (who are more
              prone to insomnia) confirmed the findings.
            </p>
            <p>
              The mechanism involves both direct melatonin delivery and inhibition of an enzyme
              (indoleamine 2,3-dioxygenase) that breaks down tryptophan, increasing the pool available
              for melatonin synthesis. Pistachios, meanwhile, contain the highest melatonin content of
              any tested whole food — up to 233,000 ng per 28 g serving.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
            Timing Your Pre-Sleep Meal
          </h2>
          <div className="text-sm text-on-surface-variant leading-relaxed space-y-4">
            <p>
              When you eat is as important as what you eat. Large meals within 2–3 hours of bedtime
              elevate core body temperature (as the digestive system processes food) and can trigger acid
              reflux — both of which directly interfere with sleep onset. Ideally, your last main meal
              should be 3–4 hours before bedtime.
            </p>
            <p>
              A small sleep-supporting snack (200–300 calories) 30–60 minutes before bed is fine and
              may actually be beneficial if it contains the right nutrient combination. The key constraints
              are low fat (slow to digest), low fibre (reduces GI activity), and modest portion size.
              A banana with a small handful of walnuts, a small bowl of oats, or a cup of warm milk
              with a teaspoon of honey are ideal.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {[
                { time: '4–3 hrs before bed', label: 'Last main meal', tip: 'Avoid heavy fats and spices' },
                { time: '1 hr before bed', label: 'Optional small snack', tip: 'Tryptophan + small carb' },
                { time: '30 min before bed', label: 'Warm drink', tip: 'Chamomile, warm milk, or tart cherry juice' },
              ].map((item) => (
                <div key={item.time} className="glass-card rounded-2xl p-4 text-center">
                  <p className="font-mono text-xs text-[#c6bfff] mb-1">{item.time}</p>
                  <p className="text-sm font-semibold text-on-surface mb-1">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12">
        <RelatedTools exclude="/tools/sleep-foods" />
      </div>

      <MedicalDisclaimer />
    </article>
  );
}
