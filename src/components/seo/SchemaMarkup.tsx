interface SchemaMarkupProps {
  type:
    | "WebSite"
    | "WebApplication"
    | "Article"
    | "FAQPage"
    | "BreadcrumbList"
    | "Organization"
    | "SoftwareApplication"
    | "ItemList";
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
  return (
    <SchemaMarkup
      type="Organization"
      data={{
        name: "Sleep Stack",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sleepstackapp.com"}/icons/logo.png`,
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
