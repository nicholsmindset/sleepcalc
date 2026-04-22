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
  .filter((e) => e.type === "wake")
  .sort((a, b) => a.hour24 - b.hour24);

export const metadata: Metadata = {
  title: "Wake-Up Calculators — What Time Should I Go to Bed?",
  description:
    "If I need to wake up at 6 AM, what time should I go to sleep? Find your ideal bedtime for any wake-up time based on 90-minute sleep cycles.",
  alternates: { canonical: "/sleep-time" },
  openGraph: {
    title: "Wake-Up Calculators — What Time Should I Go to Bed?",
    description:
      "Calculate your ideal bedtime for any wake-up time using sleep cycle science.",
    url: "/sleep-time",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function SleepTimeLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `Wake Up at ${e.time}`,
      url: `${siteUrl}/sleep-time/${e.slug}`,
    })),
    "Wake-Up Calculators"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Wake-Up Calculators", href: "/sleep-time" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Wake-Up Calculators
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Pick your wake-up time to see your optimal bedtimes. Each result
        completes a full sleep cycle so you wake up feeling refreshed, not
        groggy. Aligned with the 90-minute REM/non-REM cycle architecture
        described in the clinical sleep medicine literature.
      </p>

      <section className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/sleep-time/${entry.slug}`}
              className="glass-card rounded-2xl p-4 text-center hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-mono font-bold text-lg text-on-surface group-hover:text-[#46eae5] transition-colors">
                {entry.time}
              </p>
              <p className="text-[11px] text-on-surface-variant mt-1 uppercase tracking-wider">
                Wake up
              </p>
            </Link>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </article>
  );
}
