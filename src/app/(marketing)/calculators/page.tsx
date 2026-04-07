import type { Metadata } from "next";
import Link from "next/link";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import {
  Moon,
  Calculator,
  Clock,
  Coffee,
  HardHat,
  Baby,
  Brain,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sleep Calculators — Free Tools for Better Sleep",
  description:
    "Free, science-backed sleep calculators: bedtime calculator, sleep debt tracker, nap optimizer, caffeine cutoff timer, shift worker scheduler, baby sleep guide, and chronotype quiz. All based on sleep cycle science.",
  alternates: {
    canonical: "/calculators",
  },
  openGraph: {
    title: "Sleep Calculators — Free Tools for Better Sleep",
    description:
      "Free, science-backed sleep calculators: bedtime, sleep debt, nap optimizer, caffeine cutoff, shift worker, baby sleep, and chronotype quiz.",
    url: "/calculators",
    siteName: "Sleep Stack",
  },
};

const calculators = [
  {
    name: "Sleep Calculator",
    href: "/",
    description: "Calculate your ideal bedtime based on sleep cycles",
    icon: Moon,
    color: "#6c5ce7",
  },
  {
    name: "Sleep Debt Calculator",
    href: "/calculators/sleep-debt",
    description: "Track and recover from accumulated sleep deficit",
    icon: Calculator,
    color: "#ff6b6b",
  },
  {
    name: "Nap Calculator",
    href: "/calculators/nap-calculator",
    description: "Find the perfect nap time and duration",
    icon: Clock,
    color: "#46eae5",
  },
  {
    name: "Caffeine Cutoff Calculator",
    href: "/calculators/caffeine-cutoff",
    description: "Know when to stop drinking coffee for better sleep",
    icon: Coffee,
    color: "#fdcb6e",
  },
  {
    name: "Shift Worker Calculator",
    href: "/calculators/shift-worker",
    description: "Optimize sleep for any work schedule",
    icon: HardHat,
    color: "#a29bfe",
  },
  {
    name: "Baby Sleep Calculator",
    href: "/calculators/baby-sleep",
    description: "Age-based sleep recommendations for children",
    icon: Baby,
    color: "#55efc4",
  },
  {
    name: "Chronotype Quiz",
    href: "/calculators/chronotype-quiz",
    description: "Discover your sleep personality type",
    icon: Brain,
    color: "#fd79a8",
  },
];

export default function CalculatorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8">
      <SchemaMarkup
        type="ItemList"
        data={{
          name: "Sleep Stack Calculators",
          description:
            "Free, science-backed sleep calculators and tools for better sleep.",
          itemListElement: calculators.map((calc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: calc.name,
            url: `https://sleepstackapp.com${calc.href}`,
          })),
        }}
      />

      {/* Hero */}
      <section className="pt-4 pb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-on-surface">
          Sleep Calculators
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl">
          Free tools built on sleep cycle science, circadian biology, and the latest
          research from the National Sleep Foundation. Every calculator runs
          instantly in your browser &mdash; no signup required.
        </p>
      </section>

      {/* Calculator Grid */}
      <section className="pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="glass-card rounded-2xl p-6 hover:bg-surface-container-high/50 transition-all group block"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${calc.color}15` }}
              >
                <calc.icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: calc.color }}
                />
              </div>
              <h2 className="font-headline font-bold text-on-surface mb-1.5 group-hover:text-[#c6bfff] transition-colors">
                {calc.name}
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {calc.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Supporting Content */}
      <section className="py-12 max-w-3xl mx-auto">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-on-surface">
          Why Use a Sleep Calculator?
        </h2>
        <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
          <p>
            Most people set their alarm based on when they need to be somewhere &mdash;
            not on when their body is biologically ready to wake. The difference matters.
            Waking mid-cycle, particularly during deep (N3) sleep, triggers sleep inertia:
            a period of grogginess, impaired cognition, and reduced reaction time that can
            last 15-30 minutes or longer. By timing your sleep to complete full cycles,
            you wake at the end of a lighter stage and feel alert within minutes.
          </p>
          <p>
            A single sleep cycle lasts approximately 90 minutes, moving through light
            sleep, deep sleep, and REM sleep before starting over. Most adults cycle
            through this pattern 4-6 times per night. The early cycles are dominated by
            deep sleep (when the body releases growth hormone and repairs tissue), while
            later cycles contain proportionally more REM sleep (critical for memory
            consolidation, emotional processing, and creativity).
          </p>
          <p>
            Our calculators go beyond simple cycle math. The Sleep Debt Calculator helps
            you understand the cumulative effects of short-changing your sleep over days
            and weeks &mdash; a phenomenon with measurable impacts on immune function,
            metabolic health, and cognitive performance. The Nap Calculator uses
            established nap architecture research to recommend durations that refresh
            without causing post-nap grogginess.
          </p>
          <p>
            The Caffeine Cutoff Calculator accounts for caffeine&apos;s 5-7 hour
            half-life and its well-documented ability to delay sleep onset and reduce deep
            sleep even when you don&apos;t feel &ldquo;wired.&rdquo; The Shift Worker
            Calculator addresses the specific circadian challenges faced by the 20% of the
            workforce on non-standard schedules, where strategic light exposure and sleep
            timing can make the difference between chronic fatigue and functional alertness.
          </p>
          <p>
            For parents, the Baby Sleep Calculator translates National Sleep Foundation
            guidelines into practical schedules with age-appropriate nap timing and wake
            windows. And the Chronotype Quiz helps you understand whether your natural
            biology is better suited to early mornings, late nights, or somewhere in
            between &mdash; knowledge that can inform everything from your work schedule
            to your exercise routine.
          </p>
          <p>
            All of these tools are free and run entirely in your browser. For even more
            precise recommendations, you can create a free account and connect a wearable
            device (Oura, Fitbit, WHOOP, or Apple Health). Your real sleep stage data
            reveals your personal cycle length &mdash; which may differ from the 90-minute
            average by 10-20 minutes &mdash; and allows our AI coaching engine to generate
            insights tailored to your actual sleep patterns, not population averages.
          </p>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <MedicalDisclaimer />

      <div className="h-12" />
    </div>
  );
}
