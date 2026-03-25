import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { FAQ } from "@/components/content/FAQ";
import { RelatedTools } from "@/components/content/RelatedTools";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import AffiliateCard from "@/components/content/AffiliateCard";
import BabySleepCalculator from "@/components/calculators/BabySleepCalculator";

export const metadata: Metadata = {
  title: "Baby Sleep Calculator — How Much Sleep Does Your Child Need?",
  description:
    "Find age-based sleep recommendations for your baby, toddler, or child. See recommended hours, nap schedules, and wake windows from newborn through school age, based on National Sleep Foundation guidelines.",
  alternates: {
    canonical: "/calculators/baby-sleep",
  },
  openGraph: {
    title: "Baby Sleep Calculator — How Much Sleep Does Your Child Need?",
    description:
      "Age-based sleep recommendations for babies, toddlers, and children. Recommended hours, nap schedules, and wake windows.",
    url: "/calculators/baby-sleep",
    siteName: "Sleep Stack",
  },
};

const faqItems = [
  {
    question: "How many hours of sleep does my baby need?",
    answer:
      "Sleep needs vary significantly by age. Newborns (0-3 months) need 14-17 hours spread across day and night. Infants (4-11 months) need 12-15 hours including 2-3 naps. Toddlers (1-2 years) need 11-14 hours with 1-2 naps. These ranges are based on the National Sleep Foundation's expert panel recommendations and represent the amount most children need for healthy development.",
  },
  {
    question: "When should my toddler stop napping?",
    answer:
      "Most children transition from two naps to one around 14-18 months. The single afternoon nap typically continues until age 3-5, when many children naturally stop napping. Signs your child is ready to drop a nap include consistently fighting naptime, taking a long time to fall asleep at night, or waking very early in the morning. The transition should be gradual — try quiet rest time instead of eliminating the break entirely.",
  },
  {
    question: "What is a wake window and why does it matter?",
    answer:
      "A wake window is the period of time your child can comfortably stay awake between sleep periods. For newborns, this is only 45-60 minutes. For infants, it extends to 1.5-3 hours. Exceeding your child's wake window leads to overtiredness, which paradoxically makes it harder for them to fall asleep and stay asleep. Watching for sleepy cues within the appropriate wake window leads to smoother, faster sleep onset.",
  },
  {
    question: "Is it normal for my newborn to sleep all day and be awake at night?",
    answer:
      "Yes, this is completely normal. Newborns don't have an established circadian rhythm — their internal clock doesn't distinguish day from night until around 3-4 months of age. Their sleep-wake cycles are primarily driven by hunger. You can help their circadian rhythm develop by exposing them to bright natural light during the day and keeping nighttime feedings dim and quiet.",
  },
  {
    question: "How do I know if my child is getting enough sleep?",
    answer:
      "Children getting adequate sleep generally fall asleep within 15-20 minutes of bedtime, wake independently near their usual time, are alert and in good spirits during waking hours, and don't show excessive daytime sleepiness. Warning signs of insufficient sleep include difficulty waking in the morning, irritability, hyperactivity, difficulty concentrating, and frequent illness. If you're concerned, track your child's sleep for two weeks and discuss the pattern with your pediatrician.",
  },
  {
    question: "Should I wake my baby from a long nap?",
    answer:
      "It depends on the age and time of day. For newborns, letting them sleep is generally fine unless your pediatrician advises otherwise for weight gain. For older babies and toddlers, it's reasonable to cap a single nap at 2-2.5 hours if it's pushing too late in the afternoon, as this can interfere with nighttime sleep. As a general rule, avoid naps within 4 hours of bedtime for toddlers and preschoolers.",
  },
];

export default function BabySleepPage() {
  return (
    <>
      <SchemaMarkup
        type="WebApplication"
        data={{
          name: "Sleep Stack Baby Sleep Calculator",
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
          { label: "Baby Sleep Calculator", href: "/calculators/baby-sleep" },
        ]}
      />

      {/* Hero */}
      <section className="pt-4 pb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
          Baby Sleep Calculator
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
          How much sleep does your child actually need? Select their age group below
          to see science-backed recommendations, nap schedules, and wake windows
          from the National Sleep Foundation.
        </p>
      </section>

      {/* Calculator */}
      <BabySleepCalculator />

      {/* Educational Content */}
      <section className="py-12 max-w-none">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          How Much Sleep Do Babies Need?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Sleep is arguably the most important factor in your child&apos;s development
            during the first several years of life. During sleep, the brain consolidates
            new learning, the body releases growth hormone, and the immune system
            strengthens its defenses. Getting the right amount of sleep &mdash; and at the
            right times &mdash; lays the foundation for cognitive, emotional, and physical
            health.
          </p>
          <p>
            The National Sleep Foundation convened a panel of 18 experts who reviewed over
            300 studies to establish the current sleep duration guidelines. Their
            recommendations account for the wide natural variation between children while
            identifying the ranges that support healthy development for the majority.
          </p>
          <p>
            Newborns (0-3 months) need the most sleep at 14-17 hours per day, but this
            sleep is polyphasic &mdash; distributed across multiple short bouts throughout
            the 24-hour cycle. There is no established circadian rhythm yet, so
            day-night confusion is common and entirely normal. Sleep architecture at this
            age is roughly 50% active (REM-like) sleep, which supports the rapid brain
            development occurring during these first months.
          </p>
          <p>
            As infants reach 4-11 months, total sleep needs decrease slightly to 12-15
            hours. The critical development at this stage is the consolidation of nighttime
            sleep. Most infants can sleep 6-8 hour stretches by 6 months, and circadian
            rhythm begins to establish around 3-4 months. Daytime sleep organizes into 2-3
            distinct naps rather than the scattered sleep-wake pattern of the newborn period.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          Sleep Schedules by Age
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            <strong className="text-on-surface">Toddlers (1-2 years)</strong> need 11-14
            hours of total sleep. The major transition during this period is the shift from
            two naps to one. Most toddlers consolidate to a single afternoon nap between
            14-18 months. Bedtime resistance and separation anxiety are common sleep
            challenges at this age, making a consistent, predictable bedtime routine
            especially important. A 20-30 minute wind-down sequence &mdash; bath, books,
            songs &mdash; signals to the developing brain that sleep is approaching.
          </p>
          <p>
            <strong className="text-on-surface">Preschoolers (3-5 years)</strong> need
            10-13 hours of sleep. Many children in this age group phase out their daytime
            nap entirely by age 5, though some benefit from a brief rest period even if
            they don&apos;t fall asleep. Night terrors and nightmares become more common,
            peaking around age 3-4. Screen time within two hours of bedtime has been shown
            to delay sleep onset and reduce sleep quality in this age group, so limiting
            evening screens is one of the most effective sleep hygiene measures parents can
            take.
          </p>
          <p>
            <strong className="text-on-surface">School-age children (6-13 years)</strong>
            {" "}need 9-11 hours. Despite no longer napping, total sleep requirements remain
            significant. Research consistently links adequate sleep in this age group to
            better academic performance, improved emotional regulation, healthier weight
            management, and stronger immune function. Electronics in the bedroom are the
            leading cause of insufficient sleep for school-age children, with studies
            showing that a television or tablet in the bedroom reduces average sleep
            duration by 30-45 minutes per night.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          Understanding Wake Windows
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Wake windows &mdash; the stretches of time your child can stay comfortably
            awake between sleep periods &mdash; are one of the most practical tools for
            building a sleep schedule. Putting a child down within their optimal wake
            window leads to faster sleep onset and longer, more restorative sleep. Pushing
            past the window creates a cortisol spike (the &ldquo;second wind&rdquo;) that
            makes falling asleep harder, not easier.
          </p>
          <p>
            Newborn wake windows are remarkably short: just 45-60 minutes. This means that
            after feeding, a diaper change, and brief interaction, a newborn is already
            approaching their sleep threshold. Sleepy cues at this age include yawning,
            turning away from stimulation, and fussing.
          </p>
          <p>
            By the infant stage, wake windows extend to 1.5-3 hours, gradually lengthening
            across the first year. A common pattern at 6 months is a 2-hour morning wake
            window, 2.5 hours before the afternoon nap, and 2.5-3 hours before bedtime.
            Toddler wake windows expand further to 4-6 hours, and preschoolers can
            typically handle 5-7 hours between their single remaining nap (or rest period)
            and bedtime.
          </p>
          <p>
            It&apos;s worth noting that these are averages. Your individual child may be
            on the shorter or longer end of these ranges. The best approach is to watch
            your child &mdash; not the clock &mdash; for sleepy cues, and adjust the
            schedule based on how quickly they fall asleep and how long they stay asleep.
            If they consistently take more than 20 minutes to fall asleep, the wake window
            may be too short. If they&apos;re overtired and resistant at bedtime, it may
            be too long.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          Tips for Better Baby Sleep
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            <strong className="text-on-surface">Establish a consistent routine.</strong>
            {" "}A predictable bedtime sequence is the single most evidence-supported
            intervention for improving pediatric sleep. The routine doesn&apos;t need to
            be elaborate &mdash; even 15-20 minutes of the same sequence each night
            (changing into pajamas, brushing teeth, reading a book) gives the brain a
            reliable signal that sleep is approaching. Consistency matters more than
            complexity.
          </p>
          <p>
            <strong className="text-on-surface">Optimize the sleep environment.</strong>
            {" "}A cool (65-70&deg;F / 18-21&deg;C), dark room promotes better sleep onset
            and duration. White noise machines can help mask household sounds that might
            wake light sleepers. For safety, the American Academy of Pediatrics recommends
            a firm, flat sleep surface with no loose bedding, pillows, or soft objects for
            infants under 12 months.
          </p>
          <p>
            <strong className="text-on-surface">Prioritize daytime sunlight.</strong>
            {" "}Morning light exposure is one of the strongest signals for circadian
            rhythm development. Taking your baby outside in natural light during the first
            half of the day helps calibrate their internal clock, promoting earlier sleep
            onset in the evening and more consolidated nighttime sleep. This is particularly
            important for newborns who have not yet developed a day-night rhythm.
          </p>
          <p>
            <strong className="text-on-surface">Watch for sleep regressions.</strong>
            {" "}Temporary disruptions in sleep are common at predictable developmental
            milestones &mdash; typically around 4 months, 8-10 months, 12 months, 18
            months, and 2 years. These regressions are usually linked to cognitive
            leaps, motor skill acquisition, or changes in sleep architecture. They are
            temporary, typically resolving within 2-4 weeks, and maintaining your regular
            routine through a regression is the most effective strategy.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqItems} />

      {/* Related Tools */}
      <RelatedTools exclude="/calculators/baby-sleep" />

      <AffiliateCard context="environment" />

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />

      <div className="h-12" />
    </div>
    </>
  );
}
