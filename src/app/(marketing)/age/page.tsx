import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import ageData from "@/content/data/age-recs.json";

interface AgeEntry {
  slug: string;
  ageGroup: string;
  ageRange: string;
  type?: string;
  metaDescription?: string;
  recommendedHours: { min: number; max: number; ideal: number };
}

const entries = (ageData as AgeEntry[]).filter((e) => e.type !== "individual-year");
const individualYears = (ageData as AgeEntry[]).filter((e) => e.type === "individual-year");

export const metadata: Metadata = {
  title: "Sleep by Age — Recommended Hours of Sleep for Every Age Group",
  description:
    "How much sleep do you really need at every age? Evidence-based sleep recommendations for newborns, infants, toddlers, children, teens, adults, and seniors.",
  alternates: { canonical: "/age" },
  openGraph: {
    title: "Sleep by Age — Recommended Hours of Sleep for Every Age Group",
    description:
      "How much sleep you need at every age, from newborn to senior. Based on National Sleep Foundation guidelines.",
    url: "/age",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function AgeLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    [
      ...entries.map((e) => ({
        name: `${e.ageGroup} (${e.ageRange})`,
        url: `${siteUrl}/age/${e.slug}`,
      })),
      ...individualYears.map((e) => ({
        name: `${e.ageGroup} (${e.ageRange})`,
        url: `${siteUrl}/age/${e.slug}`,
      })),
    ],
    "Sleep by Age"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep by Age", href: "/age" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Sleep by Age
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Your sleep need changes dramatically over a lifetime. A newborn sleeps
        up to 17 hours a day; a healthy senior may thrive on 7. Pick your age
        group below for evidence-based sleep hours, nap recommendations, and
        science-backed tips to help you wake up rested.
      </p>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
          By Age Group
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/age/${entry.slug}`}
              className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-headline font-bold text-on-surface mb-1 group-hover:text-[#c6bfff] transition-colors">
                {entry.ageGroup}
              </p>
              <p className="text-xs text-on-surface-variant mb-2">{entry.ageRange}</p>
              <p className="text-sm text-on-surface-variant">
                {entry.recommendedHours.min}&ndash;{entry.recommendedHours.max} hours / night
              </p>
            </Link>
          ))}
        </div>
      </section>

      {individualYears.length > 0 && (
        <section className="mb-12">
          <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
            By Individual Year
          </h2>
          <div className="flex flex-wrap gap-3">
            {individualYears.map((entry) => (
              <Link
                key={entry.slug}
                href={`/age/${entry.slug}`}
                className="glass-card rounded-full px-5 py-2.5 text-sm text-on-surface hover:bg-surface-container-high/50 transition-all hover:scale-105"
              >
                {entry.ageGroup}
              </Link>
            ))}
          </div>
        </section>
      )}

      <MedicalDisclaimer />
    </article>
  );
}
