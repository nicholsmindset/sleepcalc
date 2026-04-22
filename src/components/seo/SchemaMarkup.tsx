interface SchemaMarkupProps {
  type:
    | "WebSite"
    | "WebApplication"
    | "Article"
    | "FAQPage"
    | "BreadcrumbList"
    | "Organization"
    | "SoftwareApplication"
    | "ItemList"
    | "MedicalWebPage";
  data: Record<string, unknown>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <SchemaMarkup
      type="WebSite"
      data={{
        name: "Sleep Stack",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com",
        description:
          "Science-backed sleep calculator with real wearable device integration and AI-powered sleep coaching.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com"}/blog?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com";
  return (
    <SchemaMarkup
      type="Organization"
      data={{
        name: "Sleep Stack",
        url: siteUrl,
        logo: `${siteUrl}/icons/logo.png`,
        description:
          "Free sleep calculators and tools to optimize your bedtime, wake-up time, and sleep schedule.",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${siteUrl}/about`,
        },
        sameAs: [`${siteUrl}/about`],
      }}
    />
  );
}

export function WebApplicationSchema() {
  return (
    <SchemaMarkup
      type="WebApplication"
      data={{
        name: "Sleep Stack Calculator",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }}
    />
  );
}
