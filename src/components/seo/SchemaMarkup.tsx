import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateSoftwareAppSchema,
} from "@/utils/schema";

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

/**
 * Render a JSON-LD object as a <script> tag.
 *
 * If `data` already carries `@context`/`@type` (as the generators in
 * `@/utils/schema` do), those win over the wrapper defaults, so a generator's
 * output can be passed straight through without duplication artifacts.
 */
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

/**
 * Standalone site-level schema components.
 *
 * These delegate to the canonical generators in `@/utils/schema` so there is a
 * single source of truth for the WebSite / Organization / WebApplication /
 * SoftwareApplication entities. Do NOT re-inline the schema here — divergent
 * copies (different descriptions, stale SearchAction targets) were the original
 * bug this indirection fixes.
 */
export function WebSiteSchema() {
  return (
    <SchemaMarkup type="WebSite" data={generateWebSiteSchema()} />
  );
}

export function OrganizationSchema() {
  return (
    <SchemaMarkup type="Organization" data={generateOrganizationSchema()} />
  );
}

export function WebApplicationSchema() {
  return (
    <SchemaMarkup type="WebApplication" data={generateWebApplicationSchema()} />
  );
}

export function SoftwareApplicationSchema() {
  return (
    <SchemaMarkup type="SoftwareApplication" data={generateSoftwareAppSchema()} />
  );
}
