import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy — Sleep Stack",
  description:
    "Sleep Stack privacy policy. Learn how we collect, use, and protect your personal information and sleep data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Sleep Stack",
    description: "How Sleep Stack collects, uses, and protects your data.",
    url: "/privacy",
    siteName: "Sleep Stack",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy" },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold font-headline text-on-surface mt-8 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">
        Last updated: March 23, 2026
      </p>

      <div className="prose-custom space-y-8">
        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            1. Information We Collect
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            <strong className="text-on-surface">Account information:</strong>{" "}
            When you create an account, we collect your email address and display
            name. We use Supabase Auth for authentication via magic links or
            OAuth providers.
          </p>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            <strong className="text-on-surface">Sleep data:</strong> If you
            connect a wearable device (Oura, Fitbit, WHOOP) or upload Apple
            Health data, we store normalized sleep session data including sleep
            stages, duration, heart rate, HRV, and sleep scores.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface">Usage data:</strong> We collect
            anonymous analytics via Vercel Analytics and Plausible to understand
            how people use our calculators. We do not use cookies for tracking.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            2. How We Use Your Data
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            We use your sleep data solely to provide personalized sleep
            recommendations, AI coaching insights, trend analysis, and weekly
            digest emails. We never sell your personal data to third parties.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            AI coaching features send aggregated, anonymized sleep metrics to
            language model providers (via OpenRouter) to generate personalized
            advice. No personally identifiable information is included in AI
            prompts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            3. Data Security
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            All data is stored in Supabase Postgres with Row Level Security
            (RLS) enabled — only you can access your own data. OAuth tokens from
            wearable providers are encrypted with AES-256 at the application
            level before storage. All connections use HTTPS/TLS encryption.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            4. Third-Party Services
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            We use the following third-party services: Supabase (database and
            auth), Vercel (hosting), Stripe (payments), Resend (emails),
            OpenRouter (AI), Plausible (analytics), and Google AdSense
            (advertising for free users). Each service has its own privacy
            policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            5. Advertising
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Free users see display advertisements powered by Google AdSense.
            Pro subscribers enjoy an ad-free experience on dashboard pages.
            AdSense may use cookies to serve ads based on browsing history.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            6. Data Retention and Deletion
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            You can delete your account and all associated data at any time from
            your dashboard settings. When you delete your account, all sleep
            sessions, AI insights, device connections, and profile data are
            permanently removed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            7. Contact
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            For privacy questions or data requests, email{" "}
            <a
              href="mailto:privacy@sleepstackapp.com"
              className="text-primary hover:text-primary-light underline underline-offset-2"
            >
              privacy@sleepstackapp.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
