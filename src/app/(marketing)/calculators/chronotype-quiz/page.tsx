import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { AdSlot } from "@/components/layout/AdSlot";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import ChronotypeQuiz from "@/components/calculators/ChronotypeQuiz";

export const metadata: Metadata = {
  title: "Chronotype Quiz — Are You a Lion, Bear, Wolf, or Dolphin?",
  description:
    "Take this 10-question chronotype quiz to discover your sleep personality. Find your ideal bedtime, peak productivity hours, and learn whether you're a morning Lion, solar Bear, night-owl Wolf, or light-sleeping Dolphin.",
  alternates: {
    canonical: "/calculators/chronotype-quiz",
  },
  openGraph: {
    title: "Chronotype Quiz — Are You a Lion, Bear, Wolf, or Dolphin?",
    description:
      "Discover your sleep personality with this 10-question chronotype quiz. Find your ideal bedtime and peak productivity hours.",
    url: "/calculators/chronotype-quiz",
    siteName: "Drift Sleep",
  },
};

const faqItems = [
  {
    question: "What is a chronotype?",
    answer:
      "A chronotype is your body's natural preference for when to sleep and when to be active. It's determined largely by genetics and reflects your circadian rhythm — the internal 24-hour clock that regulates alertness, hormone release, body temperature, and sleep drive. Unlike a simple morning-person-or-night-owl binary, the four-chronotype model (Lion, Bear, Wolf, Dolphin) captures a broader range of sleep-wake patterns including irregular sleepers.",
  },
  {
    question: "How accurate is this chronotype quiz?",
    answer:
      "This quiz is based on the principles of the Horne-Ostberg Morningness-Eveningness Questionnaire, one of the most widely used and validated circadian assessment tools in sleep research. It provides a reliable general classification. However, the most accurate way to determine your chronotype is through analysis of your actual sleep data over several weeks — which is why connecting a wearable device gives more precise results than any questionnaire.",
  },
  {
    question: "Can my chronotype change over time?",
    answer:
      "Your baseline chronotype is largely genetic and stable throughout adulthood. However, circadian timing does shift predictably across the lifespan: children tend to be early types, teenagers shift dramatically toward evening preferences (peaking around age 19-20), and adults gradually return toward earlier timing with age. Lifestyle factors like shift work, travel, and light exposure can temporarily override your natural chronotype but don't change the underlying biology.",
  },
  {
    question: "What if my work schedule doesn't match my chronotype?",
    answer:
      "This is called social jet lag — a chronic misalignment between your biological clock and your social obligations. It affects an estimated 70% of the population to some degree. Strategies to minimize the impact include strategic light exposure (bright light in the morning for Wolves trying to shift earlier), consistent meal timing, avoiding caffeine after your midday productivity dip, and protecting your sleep window on weekends to avoid widening the gap.",
  },
  {
    question: "What is the rarest chronotype?",
    answer:
      "The Dolphin chronotype is the rarest, comprising roughly 10% of the population. Dolphins are characterized by light, irregular sleep and a tendency toward insomnia. The most common chronotype is the Bear at approximately 55%, followed by Lions and Wolves at about 15% each. These percentages are estimates based on population-level circadian research and self-reported sleep patterns.",
  },
  {
    question: "How does knowing my chronotype help me sleep better?",
    answer:
      "Knowing your chronotype allows you to align your schedule with your biology rather than fighting against it. This means scheduling your bedtime during your natural sleep-pressure peak, placing demanding cognitive work during your peak alertness window, timing exercise for maximum benefit without disrupting sleep, and understanding why certain times of day feel easier or harder. People who align their schedules with their chronotype report better sleep quality, higher productivity, and improved mood.",
  },
];

export default function ChronotypeQuizPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: "Drift Sleep Chronotype Quiz",
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          description: metadata.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    <div className="max-w-3xl mx-auto px-6 md:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: "Chronotype Quiz", href: "/calculators/chronotype-quiz" },
        ]}
      />

      {/* Hero */}
      <section className="pt-4 pb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
          Chronotype Quiz
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
          Are you a Lion, Bear, Wolf, or Dolphin? Answer 10 questions to discover
          your sleep personality, ideal bedtime, and when you&apos;re naturally at
          your sharpest.
        </p>
      </section>

      {/* Quiz */}
      <ChronotypeQuiz />

      {/* Ad slot below quiz */}
      <AdSlot slot="chronotype-below-quiz" format="leaderboard" className="my-8" />

      {/* Educational Content */}
      <section className="py-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          What Is Your Chronotype?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Your chronotype is your genetically determined preference for when to sleep
            and when to be active. It goes far beyond being a &ldquo;morning person&rdquo;
            or a &ldquo;night owl&rdquo; &mdash; it influences your hormone cycles, body
            temperature patterns, cognitive performance rhythms, and even your personality
            traits and health risks.
          </p>
          <p>
            The concept is rooted in circadian biology: the 24-hour internal clock
            regulated by the suprachiasmatic nucleus (SCN) in the hypothalamus. Your SCN
            responds to light and other environmental cues, but its baseline timing is
            set by your genetics. Several clock genes, including PER2, PER3, and CRY1,
            have been identified as key determinants of chronotype. Variants in these
            genes produce measurably different circadian timing, explaining why some
            people are naturally alert at dawn while others don&apos;t hit their stride
            until evening.
          </p>
          <p>
            Dr. Michael Breus popularized the four-animal chronotype model, building on
            decades of circadian research. While the traditional Horne-Ostberg scale
            places people on a linear spectrum from extreme morning type to extreme
            evening type, the four-chronotype model adds a crucial dimension: sleep
            quality and regularity. This is what distinguishes the Dolphin chronotype
            from the other three.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          The Four Chronotypes
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            <strong className="text-on-surface">Lions (15% of population)</strong> are
            the true early birds. Their cortisol peaks shortly after waking, often before
            6 AM, giving them a burst of energy and focus that lasts through the morning.
            Lions tend to be ambitious, health-conscious, and practical. Their energy
            drops noticeably in the afternoon, and they feel genuinely sleepy by 9-10 PM.
            Lions are overrepresented among CEOs, military leaders, and fitness
            professionals &mdash; roles where early morning discipline is an advantage.
          </p>
          <p>
            <strong className="text-on-surface">Bears (55% of population)</strong> follow
            a solar schedule: they rise with (or shortly after) the sun and wind down as
            darkness falls. Bears are the most common chronotype and the one that
            conventional work schedules are designed around. Their peak productivity window
            is mid-morning through early afternoon. Bears tend to be social, adaptable,
            and steady workers. They sleep deeply and generally don&apos;t struggle with
            insomnia unless external factors disrupt their routine.
          </p>
          <p>
            <strong className="text-on-surface">Wolves (15% of population)</strong> are
            the night owls. Their melatonin onset occurs later than average, typically
            after 11 PM, and their cortisol peak is delayed until mid-morning. Wolves
            experience their best creative and cognitive performance in the late afternoon
            and evening. They tend to be creative, introverted, and independent. Wolves
            suffer most from social jet lag in a 9-to-5 world &mdash; their biology is
            literally mismatched with conventional schedules.
          </p>
          <p>
            <strong className="text-on-surface">Dolphins (10% of population)</strong> are
            the light, irregular sleepers. Named after the marine mammal that sleeps with
            half its brain active, Dolphins rarely achieve deep, uninterrupted sleep.
            They are often highly intelligent, detail-oriented, and anxious. Their
            alertness is unpredictable but tends to peak in late morning. Dolphins benefit
            more than any other chronotype from strict sleep hygiene practices, as their
            naturally fragile sleep is easily disrupted by environmental factors.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          How Chronotype Affects Your Life
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Chronotype influences far more than when you feel sleepy. Research has linked
            chronotype to cardiovascular health, metabolic risk, mental health outcomes,
            and even relationship compatibility. Evening chronotypes (Wolves) face higher
            risks of depression, obesity, and cardiovascular disease &mdash; not because
            of their biology per se, but because living on a morning-biased schedule
            creates chronic sleep deprivation and circadian misalignment.
          </p>
          <p>
            Your chronotype also determines your optimal timing for exercise, meals, and
            cognitive work. Lions perform best on morning exams and early workouts. Bears
            should schedule important meetings and creative work for 10 AM to 2 PM. Wolves
            should reserve their most challenging tasks for late afternoon and evening when
            their focus naturally sharpens. And Dolphins, with their variable energy,
            should tackle demanding work during their late-morning window before the
            afternoon dip hits.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          Can You Change Your Chronotype?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Your core chronotype is genetically determined and largely fixed in adulthood.
            You cannot turn a Wolf into a Lion through sheer willpower. However, you can
            shift your circadian timing by 1-2 hours through consistent environmental
            interventions: morning bright light exposure (especially within 30 minutes of
            waking), evening blue light reduction, fixed meal times, and strategic
            caffeine and melatonin use under medical guidance.
          </p>
          <p>
            The most productive approach is not to fight your chronotype but to work with
            it. If you&apos;re a Wolf in a 9-to-5 job, focus on protecting your sleep by
            dimming lights after 9 PM, avoiding screens for an hour before bed, and using
            morning light therapy to gently advance your rhythm. If you&apos;re a Lion
            whose social life suffers because you fade at 9 PM, a short afternoon nap can
            extend your evening alertness without disrupting your nighttime sleep.
          </p>
          <p>
            Understanding your chronotype isn&apos;t about labeling yourself &mdash;
            it&apos;s about making informed decisions that align your schedule with your
            biology. The result is better sleep, more productive work hours, improved mood,
            and a greater sense of control over your daily energy.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqItems} />

      {/* Related Tools */}
      <RelatedTools exclude="/calculators/chronotype-quiz" />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />

      <div className="h-12" />
    </div>
    </>
  );
}
