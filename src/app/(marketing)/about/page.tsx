import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Moon, BarChart3, Brain, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "About Drift Sleep — Science-Backed Sleep Tools",
  description:
    "Drift Sleep builds free, science-backed sleep calculators and tools. Connect your wearable device for personalized sleep insights powered by AI coaching.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Drift Sleep — Science-Backed Sleep Tools",
    description:
      "Free, science-backed sleep calculators with wearable device integration and AI coaching.",
    url: "/about",
    siteName: "Drift Sleep",
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
    icon: Smartphone,
    title: "Real Device Data",
    description:
      "We are the first sleep calculator to integrate real wearable data from Oura, Fitbit, WHOOP, and Apple Health. Your actual sleep cycles replace generic 90-minute estimates.",
  },
  {
    icon: Brain,
    title: "AI-Powered Coaching",
    description:
      "Our AI Sleep Coach analyzes your real sleep patterns and provides personalized, actionable advice to help you improve your sleep quality over time.",
  },
  {
    icon: BarChart3,
    title: "Privacy Focused",
    description:
      "Your sleep data belongs to you. We use Supabase with Row Level Security so only you can access your data. We never sell personal information to third parties.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold font-headline text-on-surface mt-8 mb-4">
        About Drift Sleep
      </h1>
      <p className="text-lg text-on-surface-variant leading-relaxed mb-12">
        Every sleep calculator on the internet uses the same generic 90-minute
        cycle math. We built Drift Sleep to change that. By connecting your real
        wearable device data and applying AI analysis, we calculate your actual
        personal sleep cycles — then coach you to sleep better.
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
        Drift Sleep offers a suite of free calculators including bedtime and wake
        time calculators, a sleep debt tracker, nap optimizer, caffeine cutoff
        timer, shift worker scheduler, baby sleep guide, and a chronotype quiz.
        All tools are free and require no account to use.
      </p>
      <p className="text-on-surface-variant leading-relaxed mb-4">
        For users who want deeper insights, our Pro tier ($5.99/mo) unlocks
        unlimited wearable device connections, 90 days of sleep history,
        unlimited AI coaching, personal sleep cycle calibration, and weekly
        AI digest emails.
      </p>

      <h2 className="text-xl font-bold font-headline text-on-surface mt-12 mb-4">
        Contact
      </h2>
      <p className="text-on-surface-variant leading-relaxed">
        Questions, feedback, or partnership inquiries? Reach us at{" "}
        <a
          href="mailto:hello@sleepcyclecalc.com"
          className="text-primary hover:text-primary-light underline underline-offset-2"
        >
          hello@sleepcyclecalc.com
        </a>
        .
      </p>
    </div>
  );
}
