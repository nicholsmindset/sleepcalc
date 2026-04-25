import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import scheduleData from "@/content/data/baby-sleep-schedules.json";

interface SleepRange {
  min: number;
  max: number;
}

interface BabyScheduleEntry {
  slug: string;
  ageLabel: string;
  ageMonths: number;
  metaDescription: string;
  totalSleep: SleepRange;
  nightSleep: SleepRange;
  napCount: SleepRange;
}

const entries = (scheduleData as BabyScheduleEntry[])
  .slice()
  .sort((a, b) => a.ageMonths - b.ageMonths);

export const metadata: Metadata = {
  title: "Baby Sleep Schedules — Age-by-Age Routines from Newborn to Toddler",
  description:
    "Evidence-based baby sleep schedules for every age. Wake windows, nap counts, and sample routines from newborn through preschool, based on AAP and pediatric sleep research.",
  alternates: { canonical: "/baby-sleep-schedule" },
  openGraph: {
    title: "Baby Sleep Schedules — Age-by-Age Routines from Newborn to Toddler",
    description:
      "Sample schedules, wake windows, and nap counts for every age from newborn to preschooler. Based on AAP guidance.",
    url: "/baby-sleep-schedule",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function BabySleepScheduleLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `${e.ageLabel} Sleep Schedule`,
      url: `${siteUrl}/baby-sleep-schedule/${e.slug}`,
    })),
    "Baby Sleep Schedules"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Baby Sleep Schedules", href: "/baby-sleep-schedule" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Baby Sleep Schedules
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Babies and toddlers need predictable, age-appropriate sleep — but the
        right schedule changes dramatically every few months. Pick the age below
        for total sleep needs, nap counts, wake windows, and a sample routine
        based on pediatric sleep research and AAP guidance.
      </p>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
          Schedules by Age
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/baby-sleep-schedule/${entry.slug}`}
              className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-headline font-bold text-on-surface mb-1 group-hover:text-[#c6bfff] transition-colors">
                {entry.ageLabel}
              </p>
              <p className="text-sm text-on-surface-variant mb-1">
                {entry.totalSleep.min}&ndash;{entry.totalSleep.max} hours total
                / day
              </p>
              <p className="text-xs text-on-surface-variant">
                {entry.napCount.min === entry.napCount.max
                  ? `${entry.napCount.min} nap${entry.napCount.min === 1 ? "" : "s"}`
                  : `${entry.napCount.min}–${entry.napCount.max} naps`}
                {" · "}
                {entry.nightSleep.min}&ndash;{entry.nightSleep.max}h overnight
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="glass-card rounded-2xl p-6 mb-10 border border-primary/20 text-center">
        <p className="text-on-surface font-semibold mb-2">
          Need a personalized schedule?
        </p>
        <p className="text-on-surface-variant text-sm mb-4">
          Our Baby Sleep Calculator turns your child&apos;s age into a tailored
          wake-window and nap plan for the day.
        </p>
        <Link
          href="/calculators/baby-sleep"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-light transition-colors"
        >
          Open Baby Sleep Calculator
        </Link>
      </div>

      <MedicalDisclaimer />
    </article>
  );
}
