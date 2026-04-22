import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import sleepTimesData from "@/content/data/sleep-times.json";

interface SleepTimeEntry {
  slug: string;
  type: "wake" | "bedtime";
  time: string;
  hour24: number;
  h1: string;
}

const entries = (sleepTimesData as SleepTimeEntry[])
  .filter((e) => e.type === "bedtime")
  .sort((a, b) => a.hour24 - b.hour24);

export const metadata: Metadata = {
  title: "Bedtime Calculators — Find Your Optimal Time to Go to Bed",
  description:
    "If I go to bed at 10 PM, what time should I wake up? Find the perfect wake time for any bedtime based on 90-minute sleep cycles.",
  alternates: { canonical: "/bedtime" },
  openGraph: {
    title: "Bedtime Calculators — Find Your Optimal Time to Go to Bed",
    description:
      "Calculate your best wake-up time for any bedtime using sleep cycle science.",
    url: "/bedtime",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function BedtimeLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `Bedtime at ${e.time}`,
      url: `${siteUrl}/bedtime/${e.slug}`,
    })),
    "Bedtime Calculators"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bedtime Calculators", href: "/bedtime" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Bedtime Calculators
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Pick your bedtime to see the optimal wake-up times for a full night&apos;s
        sleep. Our calculations are based on 90-minute sleep cycles, so you wake
        up between cycles instead of during deep sleep &mdash; meaning no
        grogginess and no sleep inertia.
      </p>

      <section className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/bedtime/${entry.slug}`}
              className="glass-card rounded-2xl p-4 text-center hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-mono font-bold text-lg text-on-surface group-hover:text-[#46eae5] transition-colors">
                {entry.time}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1 uppercase tracking-wider">
                Go to bed
              </p>
            </Link>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </article>
  );
}
