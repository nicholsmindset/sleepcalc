/**
 * JSON-LD structured data generators for SEO.
 *
 * Produces valid Schema.org JSON-LD objects for embedding in page <head> tags.
 * Each generator returns a plain object with @context and @type fields that
 * can be serialized directly into a <script type="application/ld+json"> tag.
 *
 * All functions are pure — no side effects, no React imports.
 */

import { SITE_NAME } from './seo';

/** Fallback base URL if the environment variable is not set */
const DEFAULT_SITE_URL = 'https://sleepstackapp.com';

/** Get the configured site URL */
function getSiteUrl(): string {
  const url =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) ||
    DEFAULT_SITE_URL;
  return url.replace(/\/+$/, '');
}

/**
 * Generate a WebSite schema for the site root.
 *
 * Includes the site name, URL, and a SearchAction for sitelinks search box
 * eligibility in Google SERPs.
 *
 * @returns JSON-LD WebSite object
 */
export function generateWebSiteSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description:
      'Free sleep calculators and science-backed tools to optimize your bedtime, wake-up time, and sleep schedule.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate a WebApplication schema for the sleep calculator tool.
 *
 * Describes the calculator as a web application with its category,
 * operating system support, and feature set.
 *
 * @returns JSON-LD WebApplication object
 */
export function generateWebApplicationSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${SITE_NAME} Calculator`,
    url: siteUrl,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    description:
      'Calculate your optimal bedtime and wake-up time based on sleep cycles. Free science-backed calculators for better rest.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free sleep calculators — no signup required.',
    },
    featureList: [
      'Sleep cycle calculator',
      'Bedtime calculator',
      'Wake-up time calculator',
      'Sleep debt calculator',
      'Nap optimizer',
      'Caffeine cutoff calculator',
      'Chronotype quiz',
      'Shift worker sleep calculator',
      'Baby sleep schedule calculator',
    ],
  };
}

/**
 * Generate an Article schema for blog posts and editorial content.
 *
 * @param article - Article metadata
 * @returns JSON-LD Article object
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  /**
   * Author name. Set to 'Sleep Stack Editorial Team' (or omit) to attribute
   * to the Organization persona; any other string is attributed to a Person.
   */
  author?: string;
  url?: string;
  image?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  const authorName = article.author ?? 'Sleep Stack Editorial Team';
  const isEditorialTeam = authorName === 'Sleep Stack Editorial Team';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: isEditorialTeam
      ? EDITORIAL_AUTHOR
      : { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icons/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url ?? siteUrl,
    },
    ...(article.url ? { url: article.url } : {}),
    ...(article.image ? { image: article.image } : {}),
  };
}

/**
 * Generate a FAQPage schema for FAQ sections.
 *
 * FAQ schema enables rich results in Google search with expandable
 * question/answer pairs directly in the SERP.
 *
 * @param items - Array of question/answer pairs
 * @returns JSON-LD FAQPage object
 */
export function generateFAQSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate a BreadcrumbList schema for navigation breadcrumbs.
 *
 * Breadcrumb schema helps search engines understand site hierarchy
 * and enables breadcrumb display in SERPs.
 *
 * @param items - Ordered array of breadcrumb items (first = root)
 * @returns JSON-LD BreadcrumbList object
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate an Organization schema for the site publisher.
 *
 * Establishes the site as an organization entity with contact info,
 * social profiles, and branding. Used for knowledge panel eligibility.
 *
 * @returns JSON-LD Organization object
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icons/logo.png`,
    description:
      'Free sleep calculators and tools to optimize your bedtime, wake-up time, and sleep schedule. Science-backed and easy to use.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${siteUrl}/about`,
    },
    sameAs: [`${siteUrl}/about`],
  };
}

/**
 * Default editorial attribution for programmatic pages.
 *
 * Branded persona pending assignment of a named credentialed reviewer.
 */
export const EDITORIAL_AUTHOR = {
  '@type': 'Organization',
  name: 'Sleep Stack Editorial Team',
  url: 'https://sleepstackapp.com/about',
} as const;

/**
 * Default review attribution — same entity for Tier 1 rollout.
 */
export const EDITORIAL_REVIEWER = EDITORIAL_AUTHOR;

/**
 * Site-wide fallback for datePublished when a JSON entry omits the field.
 *
 * Matches the sitemap lastmod baseline so Google observes a consistent
 * publish/review timeline across programmatic pages.
 */
export const DEFAULT_PUBLISHED_DATE = '2026-03-25';

/**
 * Site-wide fallback for dateModified when a JSON entry omits the field.
 */
export const DEFAULT_MODIFIED_DATE = '2026-04-22';

/**
 * Generate a MedicalWebPage schema for YMYL health-topic pages (baby sleep, age-based sleep).
 *
 * Unlike generic Article schema, MedicalWebPage signals to Google that the
 * content is health-related and expects a reviewer attestation. This helps
 * E-E-A-T scoring on pages Google classifies as "Your Money or Your Life."
 */
export function generateMedicalWebPageSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: opts.title,
    name: opts.title,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: 'en-US',
    isFamilyFriendly: true,
    medicalAudience: [
      { '@type': 'MedicalAudience', audienceType: 'Patient' },
      { '@type': 'MedicalAudience', audienceType: 'Caregiver' },
    ],
    author: EDITORIAL_AUTHOR,
    reviewedBy: EDITORIAL_REVIEWER,
    lastReviewed: opts.dateModified,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icons/logo.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    ...(opts.image ? { image: opts.image } : {}),
  };
}

/**
 * Generate an ItemList schema for hub / cluster landing pages.
 *
 * Google uses ItemList for carousel rich results on category-style pages.
 *
 * @param items - Ordered items, each with a URL and display name
 */
export function generateItemListSchema(
  items: { name: string; url: string }[],
  listName?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(listName ? { name: listName } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * Generate a HowTo schema for tool/calculator pages.
 *
 * Returns the inner schema body (no @context/@type) so it can be passed to
 * the SchemaMarkup component, which wraps with type="HowTo".
 */
export function generateHowToSchema(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
  image?: string;
}): Record<string, unknown> {
  return {
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * Generate a SoftwareApplication schema for app store and rich result eligibility.
 *
 * Describes the web application with pricing tiers, ratings placeholders,
 * and platform support. Suitable for the homepage and pricing pages.
 *
 * @returns JSON-LD SoftwareApplication object
 */
export function generateSoftwareAppSchema(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    url: siteUrl,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    description:
      'Calculate your optimal sleep schedule based on sleep cycles. Free bedtime calculator, sleep debt tracker, nap optimizer, caffeine cutoff calculator, and more.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'All sleep calculators are completely free to use.',
    },
    screenshot: `${siteUrl}/og/homepage.png`,
  };
}
