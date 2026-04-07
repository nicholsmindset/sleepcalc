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
      "The calculator uses sleep cycle science to find optimal bedtimes and wake times. Each sleep cycle lasts about 90 minutes, and waking at the end of a complete cycle helps you feel alert. We count backwards from your wake time (or forwards from your bedtime) in 90-minute intervals, adding time for falling asleep.",
  },
  {
    question: "How many hours of sleep do I need?",
    answer:
      "Most adults need 7 to 9 hours of sleep per night, which translates to 5 or 6 complete sleep cycles. Teenagers need 8 to 10 hours, while older adults may function well on 7 to 8 hours. The ideal amount varies by individual — your sleep tracker data can reveal what works best for you.",
  },
  {
    question: "What is a sleep cycle?",
    answer:
      "A sleep cycle is a repeating pattern of sleep stages lasting roughly 90 minutes. Each cycle moves through light sleep (N1, N2), deep sleep (N3), and REM sleep. Early cycles contain more deep sleep for physical restoration, while later cycles are richer in REM sleep for memory and emotional processing.",
  },
  {
    question: "Why do I wake up tired even after 8 hours?",
    answer:
      "Waking during deep sleep or mid-cycle causes sleep inertia — that groggy, disoriented feeling. Even 8 hours of sleep can leave you tired if your alarm pulls you out of a deep sleep phase. Timing your wake-up to align with the end of a cycle makes a significant difference in morning alertness.",
  },
  {
    question: "What time should I go to bed if I wake up at 6 AM?",
    answer:
      "For a 6:00 AM wake-up, the best bedtimes are 8:45 PM (6 cycles, 9 hours), 10:15 PM (5 cycles, 7.5 hours), or 11:45 PM (4 cycles, 6 hours). These times include 15 minutes to fall asleep. The 5-cycle option at 10:15 PM is recommended for most adults.",
  },
  {
    question: "Does the calculator account for time to fall asleep?",
    answer:
      "Yes. The calculator includes a configurable sleep latency — the time it takes you to actually fall asleep after getting into bed. The default is 15 minutes, but you can adjust it from 5 to 30 minutes using the slider to match your experience.",
  },
  {
    question: "How accurate is the 90-minute cycle estimate?",
    answer:
      "The 90-minute average is well-supported by sleep research and works well for most people. Individual cycle lengths typically range from 80 to 110 minutes. If you find that the recommended wake times don't feel right for you, try adjusting by 10 to 15 minutes in either direction to find your personal sweet spot.",
  },
  {
    question: "What happens if I wake up in the middle of a sleep cycle?",
    answer:
      "Waking mid-cycle, especially during deep sleep, triggers sleep inertia that can last 15 to 30 minutes. You may feel confused, sluggish, and less alert. By timing your alarm to the end of a light sleep or REM phase, you wake more naturally and feel refreshed immediately.",
  },
  {
    question: "Is this a REM sleep calculator?",
    answer:
      "Yes — our sleep calculator factors in REM sleep timing. REM phases get longer as the night progresses, with most REM sleep occurring in your final two cycles. By aligning your wake time to the end of a full cycle, you naturally wake after a REM phase when your brain is closest to wakefulness, leading to a more alert morning.",
  },
  {
    question: "How does the 90-minute sleep cycle work?",
    answer:
      "The average sleep cycle lasts about 90 minutes and progresses through four stages: light sleep (N1 and N2), deep sleep (N3), and REM sleep. Our calculator uses this 90-minute rhythm to find bedtimes and wake times that align with complete cycles. Some people have cycles as short as 80 minutes or as long as 120 minutes — if the standard times don't feel right, try adjusting your wake-up time in small increments.",
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
            Calculate your ideal bedtime using sleep cycle science. Wake up
            refreshed by timing your sleep to complete{" "}
            <span className="text-[#46eae5] font-semibold">
              full 90-minute cycles
            </span>
            .
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
              Waking up at the end of a complete cycle — rather than in the
              middle of deep sleep — is the key to feeling alert and refreshed.
              Our calculator times your bedtime so you complete full cycles
              before your alarm goes off.
            </p>
            <p>
              Most adults complete 4 to 6 sleep cycles per night. The early
              cycles are rich in deep sleep (critical for physical recovery),
              while later cycles contain more REM sleep (essential for memory
              consolidation and emotional regulation).
            </p>
            <p>
              The standard 90-minute cycle is an average. Your personal cycle
              length may be anywhere from 80 to 110 minutes, which is why
              aligning your wake time to the end of a cycle makes such a
              noticeable difference in how you feel each morning.
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
