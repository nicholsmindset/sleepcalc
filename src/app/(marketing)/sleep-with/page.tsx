import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MedicalDisclaimer } from "@/components/content/MedicalDisclaimer";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { generateItemListSchema } from "@/utils/schema";
import conditionData from "@/content/data/conditions.json";

interface ConditionEntry {
  slug: string;
  conditionName: string;
  metaDescription: string;
}

const entries = (conditionData as ConditionEntry[])
  .slice()
  .sort((a, b) => a.conditionName.localeCompare(b.conditionName));

export const metadata: Metadata = {
  title: "Sleep With a Health Condition — Sleep Guides for 15+ Conditions",
  description:
    "How chronic conditions affect sleep, plus evidence-based hygiene tips. Guides for insomnia, sleep apnea, anxiety, ADHD, chronic pain, pregnancy, menopause, and more.",
  alternates: { canonical: "/sleep-with" },
  openGraph: {
    title: "Sleep With a Health Condition — Sleep Guides for 15+ Conditions",
    description:
      "Evidence-based sleep guides for the conditions that disrupt rest most: insomnia, sleep apnea, anxiety, ADHD, pregnancy, chronic pain, and more.",
    url: "/sleep-with",
    siteName: "Sleep Stack",
    type: "website",
  },
};

export default function SleepWithLandingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";

  const itemList = generateItemListSchema(
    entries.map((e) => ({
      name: `Sleeping With ${e.conditionName}`,
      url: `${siteUrl}/sleep-with/${e.slug}`,
    })),
    "Sleep & Health Conditions"
  );

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-4">
      <SchemaMarkup type="ItemList" data={itemList} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sleep Conditions", href: "/sleep-with" },
        ]}
      />

      <h1 className="font-headline text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#c6bfff] to-[#46eae5] bg-clip-text text-transparent">
        Sleep With a Health Condition
      </h1>
      <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
        Chronic conditions don&apos;t just disturb sleep — they reshape it.
        These guides explain how each condition affects your sleep architecture,
        the evidence-based hygiene adjustments that help, and when to involve a
        clinician.
      </p>

      <div className="flex gap-3 items-start glass-card rounded-2xl p-5 mb-10 border border-[#f9ca24]/20 max-w-3xl">
        <Heart className="w-5 h-5 text-[#f9ca24] shrink-0 mt-0.5" />
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <span className="text-[#f9ca24] font-semibold">Medical note: </span>
          These guides are educational and do not replace medical advice. If a
          condition is significantly affecting your sleep, consult your doctor
          or a board-certified sleep specialist.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="font-headline text-2xl font-bold mb-6 text-on-surface">
          Conditions A&ndash;Z
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/sleep-with/${entry.slug}`}
              className="glass-card rounded-2xl p-5 hover:bg-surface-container-high/50 transition-all group"
            >
              <p className="font-headline font-bold text-on-surface mb-2 group-hover:text-[#c6bfff] transition-colors">
                Sleeping With {entry.conditionName}
              </p>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                {entry.metaDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <MedicalDisclaimer />
    </article>
  );
}
