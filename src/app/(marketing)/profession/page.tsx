import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import professionData from "@/content/data/professions.json";

interface ProfessionEntry {
  slug: string;
  profession: string;
  typicalSchedule: string;
}

const entries = professionData as ProfessionEntry[];

export const metadata: Metadata = {
  title: "Sleep by Profession — Schedules for Shift Workers, Nurses, Pilots & More",
  description:
    "How to sleep better when your job fights your body clock. Evidence-based sleep schedules for nurses, truck drivers, pilots, doctors, firefighters, and other demanding professions.",
  alternates: { canonical: "/profession" },
  openGraph: {
    title: "Sleep by Profession — Schedules for Shift Workers, Nurses, Pilots & More",
    description:
      "Evidence-based sleep strategies for demanding professions and non-standard schedules.",
    url: "/profession",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function ProfessionLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `${e.profession} Sleep Schedule`,
      url: `${siteUrl}/profession/${e.slug}`,
    })),
    "Sleep by Profession"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep by Profession", href: "/profession" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Sleep by Profession
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-3xl">
        Roughly one in five American workers is on a non-standard schedule &mdash;
        a schedule that routinely puts their sleep need in conflict with their
        circadian rhythm. The sleep strategies that work for a 9-to-5 knowledge
        worker rarely survive contact with a night shift, a transcontinental
        flight, or a 24-hour hospital call. Find your profession below for
        evidence-based sleep tactics tailored to the job.
      </p>

      <section className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/profession/${entry.slug}`}
              className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-headline font-bold text-on-surface mb-1 group-hover:text-[#c6bfff] transition-colors">
                {entry.profession}
              </p>
              <p className="text-xs text-on-surface-variant">
                {entry.typicalSchedule}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </article>
  );
}
