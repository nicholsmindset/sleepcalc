import type { Metadata } from "next";
import Link from "next/link";
import {
  Moon,
  Sun,
  Brain,
  Coffee,
  Baby,
  Clock,
  Plane,
  Calendar,
  BookOpen,
  Zap,
  Star,
  CloudSun,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  WebSiteSchema,
  WebApplicationSchema,
  OrganizationSchema,
} from "@/components/seo/SchemaMarkup";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { RelatedTools } from "@/components/content/RelatedTools";
import { FAQ } from "@/components/content/FAQ";
import BedtimeCalculator from "@/components/calculators/BedtimeCalculator";
import { SleepChallenge } from "@/components/marketing/SleepChallenge";

export const metadata: Metadata = {
  title: "Sleep Calculator — Find Your Ideal Bedtime & Wake Up Time",
  description:
    "Calculate the best time to go to sleep and wake up based on sleep cycles. Find your ideal bedtime and wake-up time with our free sleep cycle calculator.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sleep Calculator — Find Your Ideal Bedtime & Wake Up Time",
    description:
      "Calculate the best time to go to sleep and wake up based on sleep cycles. Find your ideal bedtime and wake-up time with our free sleep cycle calculator.",
    url: "/",
    siteName: "Sleep Stack",
    type: "website",
  },
};

const faqItems = [
  {
    question: "How does the sleep calculator work?",
    answer:
      "The calculator uses a 90-minute average to estimate bedtime and wake-up options, including your chosen time to fall asleep. Actual sleep cycles vary, so these are planning estimates rather than predicted wake-up stages. Prioritize enough total sleep.",
  },
  {
    question: "How many hours of sleep do I need?",
    answer:
      "Adults generally need at least 7 hours of sleep on a regular basis; many aim for 7 to 9 hours. Children and teenagers need more. A cycle estimate should not be used to justify regularly sleeping less than you need.",
  },
  {
    question: "What is a sleep cycle?",
    answer:
      "A sleep cycle is a repeating pattern of sleep stages lasting roughly 90 minutes. Each cycle moves through light sleep (N1, N2), deep sleep (N3), and REM sleep. Early cycles contain more deep sleep for physical restoration, while later cycles are richer in REM sleep for memory and emotional processing.",
  },
  {
    question: "Why do I wake up tired even after 8 hours?",
    answer:
      "Sleep inertia can make you feel groggy after waking, but tiredness can also reflect insufficient sleep, an irregular schedule, or a health condition. A fixed 90-minute timer cannot tell which sleep stage you will wake from.",
  },
  {
    question: "What time should I go to bed if I wake up at 6 AM?",
    answer:
      "For a 6:00 AM wake-up, 8:45 PM allows about 9 hours of sleep and 10:15 PM allows about 7.5 hours, assuming 15 minutes to fall asleep. The calculator also shows shorter estimates, but regularly getting only 6 hours falls below the usual adult recommendation.",
  },
  {
    question: "Does the calculator account for time to fall asleep?",
    answer:
      "Yes. The calculator includes a configurable sleep latency — the time it takes you to actually fall asleep after getting into bed. The default is 15 minutes, but you can adjust it from 5 to 30 minutes using the slider to match your experience.",
  },
  {
    question: "How accurate is the 90-minute cycle estimate?",
    answer:
      "Ninety minutes is a rough planning average, not a measurement of your own cycles. Cycle lengths and sleep onset vary within and between nights. Use the suggested times to plan enough sleep, not to predict the exact moment you will leave REM or deep sleep.",
  },
  {
    question: "What happens if I wake up in the middle of a sleep cycle?",
    answer:
      "Waking from deeper sleep can contribute to temporary grogginess. This calculator cannot measure your sleep stages or guarantee a lighter-stage wake-up, so focus first on getting enough sleep and keeping a consistent schedule.",
  },
  {
    question: "Is this a REM sleep calculator?",
    answer:
      "No. The tool uses average cycle timing; it does not detect or predict your REM sleep. REM periods often lengthen later in the night, but their timing varies by person and night.",
  },
  {
    question: "How does the 90-minute sleep cycle work?",
    answer:
      "Sleep moves through non-REM and REM stages several times each night, but cycles are not identical 90-minute blocks. The calculator uses 90 minutes to offer simple schedule estimates and cannot verify whether an alarm will land at a stage boundary.",
  },
  {
    question: "Can I calculate sleep needs by age?",
    answer:
      "Yes. Sleep needs change significantly across the lifespan. Newborns need 14 to 17 hours, toddlers need 11 to 14 hours, school-age children need 9 to 11 hours, teenagers need 8 to 10 hours, and adults need 7 to 9 hours. Our sleep-by-age guides provide detailed recommendations for every age group from infancy to senior years.",
  },
];

export default function HomePage() {
  return (
    <>
      <WebSiteSchema />
      <WebApplicationSchema />
      <OrganizationSchema />

      {/* Star field */}
      <div className="star-field fixed inset-0 pointer-events-none" />

      {/* ── HERO ── full-bleed, text centered */}
      <section className="relative z-10 px-6 md:px-8 pt-4 pb-16 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Free · No signup required · Science-backed
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
            Sleep Smarter.<br />Wake Refreshed.
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan a bedtime that gives you enough time to sleep. The calculator uses{" "}
            <span className="text-[#46eae5] font-semibold">
              approximate 90-minute cycles
            </span>{" "}
            as a guide, not a prediction of your sleep stages.
          </p>
          <BedtimeCalculator />
        </div>
      </section>

      {/* ── STATS BAR ── full-bleed stripe */}
      <div className="relative z-10 border-y border-border bg-card/50 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "278+", label: "Sleep Pages" },
              { value: "8", label: "Free Tools" },
              { value: "6", label: "Calculators" },
              { value: "11", label: "Sleep Guides" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold font-headline text-primary">
                  {value}
                </div>
                <div className="text-xs text-on-surface-variant">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOLS GRID ── */}
      <section className="relative z-10 px-6 md:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
            Every Sleep Tool You Need
          </h2>
          <p className="text-on-surface-variant mb-8">
            Free, science-backed tools to optimise every aspect of your sleep.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                href: "/tonight",
                icon: CloudSun,
                name: "Tonight's Forecast",
                desc: "Live sleep environment score",
              },
              {
                href: "/tools/circadian-guide",
                icon: Sun,
                name: "Circadian Guide",
                desc: "Your personalised light schedule",
              },
              {
                href: "/tools/jet-lag-calculator",
                icon: Plane,
                name: "Jet Lag Calculator",
                desc: "Day-by-day recovery plan",
              },
              {
                href: "/tools/sleep-score",
                icon: Target,
                name: "Sleep Score",
                desc: "Rate and track sleep quality",
              },
              {
                href: "/tools/moon-sleep",
                icon: Moon,
                name: "Moon & Sleep",
                desc: "Lunar phase sleep insights",
              },
              {
                href: "/tools/dst-calculator",
                icon: Calendar,
                name: "DST Calculator",
                desc: "Daylight saving adjustment plan",
              },
              {
                href: "/tools/sleep-journal",
                icon: BookOpen,
                name: "Sleep Journal",
                desc: "Log and track sleep history",
              },
              {
                href: "/sleep-coach",
                icon: Brain,
                name: "AI Sleep Coach",
                desc: "Personalised AI sleep tips",
              },
            ].map(({ href, icon: Icon, name, desc }) => (
              <Link
                key={href}
                href={href}
                className="glass-card rounded-2xl p-4 flex flex-col gap-2 hover:border-primary/40 transition-colors group"
              >
                <Icon className="w-6 h-6 text-primary" />
                <div className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">
                  {name}
                </div>
                <div className="text-xs text-on-surface-variant">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATORS GRID ── */}
      <section className="relative z-10 px-6 md:px-8 py-12 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
            Precision Sleep Calculators
          </h2>
          <p className="text-on-surface-variant mb-8">
            Built on sleep science — tell us your schedule, we tell you your
            ideal sleep times.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                href: "/calculators/sleep-debt",
                icon: TrendingUp,
                name: "Sleep Debt",
                desc: "Calculate your sleep deficit",
              },
              {
                href: "/calculators/nap-calculator",
                icon: Moon,
                name: "Nap Calculator",
                desc: "Perfect nap timing and duration",
              },
              {
                href: "/calculators/caffeine-cutoff",
                icon: Coffee,
                name: "Caffeine Cutoff",
                desc: "Last safe coffee time",
              },
              {
                href: "/calculators/shift-worker",
                icon: Clock,
                name: "Shift Worker",
                desc: "Sleep for rotating schedules",
              },
              {
                href: "/calculators/baby-sleep",
                icon: Baby,
                name: "Baby Sleep",
                desc: "Schedules by age and stage",
              },
              {
                href: "/calculators/chronotype-quiz",
                icon: Star,
                name: "Chronotype Quiz",
                desc: "Are you a lion, bear, or wolf?",
              },
            ].map(({ href, icon: Icon, name, desc }) => (
              <Link
                key={href}
                href={href}
                className="glass-card rounded-2xl p-4 flex items-start gap-3 hover:border-primary/40 transition-colors group"
              >
                <Icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">
                    {name}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI COACH TEASER ── full-bleed gradient */}
      <section className="relative z-10 px-6 md:px-8 py-16 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 mb-4">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-3">
            Meet Your AI Sleep Coach
          </h2>
          <p className="text-on-surface-variant mb-6 text-lg">
            Answer 3 quick questions and get personalised, science-backed sleep
            recommendations. Free — no account needed.
          </p>
          <Link
            href="/sleep-coach"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors"
          >
            <Brain className="w-4 h-4" />
            Get My Free Sleep Tips
          </Link>
        </div>
      </section>

      {/* ── HOW SLEEP CYCLES WORK ── */}
      <section className="relative z-10 px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
            How Sleep Cycles Work
          </h2>
          <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
            <p>
              Every night, your body cycles through distinct stages of sleep in
              roughly 90-minute intervals. A complete cycle moves from light
              sleep (N1, N2) into deep sleep (N3) and then into REM (rapid eye
              movement) sleep, where most dreaming occurs.
            </p>
            <p>
              Sleep stages and cycle lengths vary throughout the night. This
              calculator estimates schedule options from a 90-minute average;
              it cannot tell when you will enter or leave a particular stage.
              Most adults should first allow at least seven hours of sleep.
            </p>
            <p>
              Most adults complete 4 to 6 sleep cycles per night. The early
              cycles are rich in deep sleep (critical for physical recovery),
              while later cycles contain more REM sleep (essential for memory
              consolidation and emotional regulation).
            </p>
            <p>
              The 90-minute cycle is an average. Use these times as a starting
              point for a consistent routine, then adjust based on how much
              sleep you get and how you feel during the day.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 px-6 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <FAQ items={faqItems} />
        </div>
      </section>

      {/* ── 7-Day Sleep Challenge ── */}
      <div className="relative z-10 px-6 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <SleepChallenge />
        </div>
      </div>

      {/* ── Related Tools ── */}
      <div className="relative z-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <RelatedTools exclude="/" />
        </div>
      </div>

      {/* ── Medical Disclaimer ── */}
      <div className="relative z-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <MedicalDisclaimer />
        </div>
      </div>

      <div className="h-12" />
    </>
  );
}
