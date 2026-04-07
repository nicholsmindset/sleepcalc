import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service — Sleep Stack",
  description:
    "Sleep Stack terms of service. Rules and guidelines for using our sleep calculators, dashboard, and Pro subscription.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Sleep Stack",
    description: "Terms and conditions for using Sleep Stack services.",
    url: "/terms",
    siteName: "Sleep Stack",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-8 pt-4 pb-10 md:pb-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms" },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-bold font-headline text-on-surface mt-8 mb-2">
        Terms of Service
      </h1>
      <p className="text-sm text-on-surface-variant mb-10">
        Last updated: March 23, 2026
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            By accessing or using Sleep Stack (sleepstackapp.com), you agree to
            these Terms of Service. If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            2. Service Description
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Sleep Stack provides free sleep calculators, a personal sleep
            dashboard with wearable device integration, AI-powered sleep
            coaching, and blog content. Some features require a free account.
            Premium features are available through a Pro subscription.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            3. Accounts
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            You are responsible for maintaining the security of your account.
            You must provide accurate information when creating an account. You
            may not share your account credentials or use another person&apos;s
            account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            4. Pro Subscription
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-3">
            Pro subscriptions are billed monthly ($5.99/mo) or annually
            ($49.99/yr) via Stripe. Subscriptions renew automatically unless
            canceled before the end of the billing period.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            You may cancel your subscription at any time from your dashboard
            settings. Cancellation takes effect at the end of the current billing
            period. We do not offer refunds for partial billing periods.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            5. Medical Disclaimer
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Sleep Stack is not a medical device and does not provide medical
            advice. Our calculators, AI coaching, and content are for
            informational and educational purposes only. Always consult a
            qualified healthcare provider for medical conditions or sleep
            disorders. See our full{" "}
            <a
              href="/medical-disclaimer"
              className="text-primary hover:text-primary-light underline underline-offset-2"
            >
              Medical Disclaimer
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            6. Intellectual Property
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            All content, design, code, and branding on Sleep Stack is owned by
            us or our licensors. You may not copy, modify, distribute, or
            reverse-engineer any part of the service without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            7. Limitation of Liability
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Sleep Stack is provided &ldquo;as is&rdquo; without warranties of
            any kind. We are not liable for any damages arising from your use of
            the service, including decisions made based on calculator results or
            AI coaching.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            8. Changes to Terms
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            We may update these terms from time to time. Continued use of the
            service after changes constitutes acceptance. Material changes will
            be communicated via email to registered users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-headline text-on-surface mb-3">
            9. Contact
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Questions about these terms? Email{" "}
            <a
              href="mailto:hello@sleepstackapp.com"
              className="text-primary hover:text-primary-light underline underline-offset-2"
            >
              hello@sleepstackapp.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
