import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { Moon, BarChart3, Brain, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "About Sleep Stack — Free Science-Backed Sleep Tools",
  description:
    "Sleep Stack builds free, science-backed sleep calculators and tools. Bedtime calculators, sleep debt trackers, nap optimizers, and more — no signup required.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Sleep Stack — Free Science-Backed Sleep Tools",
    description:
      "Free, science-backed sleep calculators. No signup, no paywalls.",
    url: "/about",
    siteName: "Sleep Stack",
  },
};

const values = [
  {
    icon: Moon,
    title: "Sleep Science First",
    description:
      "Every calculator is built on peer-reviewed sleep research from the National Sleep Foundation, NIH, and leading sleep labs. No generic advice — only evidence-based recommendations.",
  },
  {
    icon: BookOpen,
    title: "Always Free",
    description:
      "All calculators are completely free to use with no account required. We believe science-backed sleep tools should be accessible to everyone.",
  },
  {
    icon: Brain,
    title: "Research-Backed",
    description:
      "Our sleep cycle calculations are based on published research. We cite our sources and explain the science behind every recommendation.",
  },
  {
    icon: BarChart3,
    title: "Privacy Focused",
    description:
      "Most tools work entirely in your browser — no data sent to servers. When you do create an account, your data is protected with Row Level Security. We never sell personal information.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <OrganizationSchema />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold font-headline text-on-surface mt-8 mb-4">
        About Sleep Stack
      </h1>
      <p className="text-lg text-on-surface-variant leading-relaxed mb-12">
        Most sleep calculators on the internet use the same generic 90-minute
        cycle math with no scientific backing. Sleep Stack was built to be
        different — a complete stack of free, science-based sleep tools in one
        place, from bedtime calculators to sleep debt trackers.
      </p>

      <h2 className="text-xl font-bold font-headline text-on-surface mb-6">
        What Makes Us Different
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 mb-16">
        {values.map((item) => (
          <div
            key={item.title}
            className="glass-card rounded-2xl p-6"
          >
            <item.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-base font-bold font-headline text-on-surface mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold font-headline text-on-surface mb-4">
        Our Tools
      </h2>
      <p className="text-on-surface-variant leading-relaxed mb-4">
        Sleep Stack offers a full suite of free calculators: bedtime and wake-up
        time calculators, sleep debt tracker, nap optimizer, caffeine cutoff
        timer, shift worker scheduler, baby sleep guide, and a chronotype quiz.
        All tools are free and require no account.
      </p>

      <h2 className="text-xl font-bold font-headline text-on-surface mt-12 mb-4">
        Contact
      </h2>
      <p className="text-on-surface-variant leading-relaxed">
        Questions, feedback, or partnership inquiries? Reach us at{" "}
        <a
          href="mailto:hello@sleepstackapp.com"
          className="text-primary hover:text-primary-light underline underline-offset-2"
        >
          hello@sleepstackapp.com
        </a>
        .
      </p>
    </div>
  );
}
