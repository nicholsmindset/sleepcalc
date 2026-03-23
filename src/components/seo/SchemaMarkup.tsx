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
        name: "Drift Sleep",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://sleepcyclecalc.com",
        description:
          "Science-backed sleep calculator with real wearable device integration and AI-powered sleep coaching.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sleepcyclecalc.com"}/blog?q={search_term_string}`,
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
        name: "Drift Sleep",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://sleepcyclecalc.com",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sleepcyclecalc.com"}/icons/logo.png`,
      }}
    />
  );
}

export function WebApplicationSchema() {
  return (
    <SchemaMarkup
      type="WebApplication"
      data={{
        name: "Drift Sleep Calculator",
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
