import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy — Sleep Stack",
  description:
    "How Sleep Stack researches, writes, reviews, and updates its sleep content — including our sourcing standards, attribution, and corrections process.",
  alternates: {
    canonical: "/editorial-policy",
  },
  openGraph: {
    title: "Editorial Policy — Sleep Stack",
    description:
      "How Sleep Stack researches, writes, reviews, and updates its sleep content.",
    url: "/editorial-policy",
    siteName: "Sleep Stack",
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 pt-4 pb-10 md:pb-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Editorial Policy", href: "/editorial-policy" },
        ]}
      />

      <div className="flex items-center gap-3 mt-8 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-on-surface">
          Editorial Policy
        </h1>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-on-surface leading-relaxed font-medium">
            Sleep Stack publishes sleep calculators, guides, and articles to help
            people understand and improve their sleep. This page explains who
            creates that content, how we research it, and how we keep it
            accurate.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            Who Writes Our Content
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Our content is researched, written, and maintained by the Sleep
            Stack editorial team — writers and researchers who specialize in
            making sleep science clear and practical. We attribute content to
            the editorial team as an organization rather than to individual
            authors.
          </p>
          <p className="text-on-surface-variant leading-relaxed mt-3">
            We want to be direct about what that means: the Sleep Stack
            editorial team is not a panel of licensed physicians, and we do not
            present our writers as medical professionals or claim clinical
            credentials. Our role is to summarize established sleep research
            accurately and accessibly — not to provide medical care.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            How We Research
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            Sleep recommendations on this site are grounded in published
            guidance from recognized public-health and sleep-medicine
            authorities, including:
          </p>
          <ul className="space-y-2 ml-2">
            <li className="text-on-surface-variant">
              <a
                href="https://www.cdc.gov/sleep/about/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Centers for Disease Control and Prevention (CDC) — About Sleep
              </a>
            </li>
            <li className="text-on-surface-variant">
              <a
                href="https://www.nhlbi.nih.gov/health/sleep-deprivation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                National Heart, Lung, and Blood Institute (NIH) — Sleep
                Deprivation and Deficiency
              </a>
            </li>
            <li className="text-on-surface-variant">
              <a
                href="https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                National Institute of Neurological Disorders and Stroke (NIH) —
                Brain Basics: Understanding Sleep
              </a>
            </li>
            <li className="text-on-surface-variant">
              <a
                href="https://sleepeducation.org/healthy-sleep/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                American Academy of Sleep Medicine — Healthy Sleep
              </a>
            </li>
          </ul>
          <p className="text-on-surface-variant leading-relaxed mt-3">
            Where a page makes a specific health claim, we cite the authorities
            it draws on in a Sources &amp; References section. Sleep-cycle math
            in our calculators is based on widely accepted averages and is
            clearly framed as a general estimate, not a personalized clinical
            measurement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            How We Review and Update
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Articles and guides are checked by the editorial team for accuracy
            against current sources before publication. Each page shows its
            publication date, and an updated date when it has been revised. We
            review content periodically and when sleep guidance from the
            authorities above meaningfully changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            What Our Content Is Not
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Sleep Stack content is educational and is not medical advice,
            diagnosis, or treatment. It cannot account for your individual
            health history, medications, or conditions. Always consult a
            qualified healthcare provider with questions about a sleep disorder
            or medical condition. See our{" "}
            <Link href="/medical-disclaimer" className="text-primary hover:underline">
              Medical Disclaimer
            </Link>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            Affiliate Disclosure
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Some pages contain affiliate links to sleep products. If you buy
            through one of these links, Sleep Stack may earn a commission at no
            additional cost to you. Affiliate relationships never influence our
            sleep guidance or the recommendations in our calculators and
            articles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            Corrections
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            If you spot an inaccuracy, we want to fix it. Reach the editorial
            team through our{" "}
            <Link href="/about" className="text-primary hover:underline">
              About page
            </Link>
            , and we will review and correct verified errors promptly.
          </p>
        </section>
      </div>
    </div>
  );
}
