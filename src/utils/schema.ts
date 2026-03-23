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
const DEFAULT_SITE_URL = 'https://sleepcyclecalc.com';

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
      'Smart sleep cycle calculator with wearable device integration and AI-powered sleep coaching.',
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
      'Calculate your optimal bedtime and wake-up time based on sleep cycles. Connect wearable devices for personalized sleep analysis.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free sleep calculator with optional Pro tier for advanced features.',
    },
    featureList: [
      'Sleep cycle calculator',
      'Bedtime calculator',
      'Wake-up time calculator',
      'Sleep debt calculator',
      'Nap optimizer',
      'Caffeine cutoff calculator',
      'Chronotype quiz',
      'Wearable device integration',
      'AI sleep coaching',
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
  author: string;
  image?: string;
}): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author,
    },
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
      '@id': siteUrl,
    },
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
      'Smart sleep cycle calculator with real wearable device integration and AI-powered sleep coaching.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${siteUrl}/about`,
    },
    sameAs: [],
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
      'Calculate your optimal sleep schedule based on real sleep cycles. Connect Oura, Fitbit, WHOOP, and Apple Health for personalized insights. AI-powered sleep coaching included.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
        description:
          'All calculators, basic dashboard, 1 device connection, 7-day history, 3 AI coaching sessions per week.',
      },
      {
        '@type': 'Offer',
        name: 'Pro',
        price: '5.99',
        priceCurrency: 'USD',
        billingIncrement: 'P1M',
        description:
          'Unlimited devices, 90-day history, unlimited AI coaching, personal cycle calibration, weekly digest, PDF reports, ad-free dashboard.',
      },
    ],
    screenshot: `${siteUrl}/og/homepage.png`,
  };
}
