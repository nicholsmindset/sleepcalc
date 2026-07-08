/**
 * SEO helper functions for meta tags, canonical URLs, and OG images.
 *
 * Generates consistent metadata across all pages following the project's
 * SEO strategy. Title format is "{Page} | Sleep Stack". Canonical URLs
 * use the NEXT_PUBLIC_SITE_URL environment variable to ensure consistency
 * across environments.
 *
 * All functions are pure — no side effects, no React imports.
 */

/** Site name used in title tags and schema markup */
export const SITE_NAME = 'Sleep Stack';

/**
 * Path to the canonical publisher logo used in JSON-LD structured data.
 *
 * Points at a real, shipped square PNG (512×512, satisfies Google's ≥112px
 * logo requirement). Kept as a single constant so every schema generator and
 * component references the same asset and cannot drift onto a missing file.
 */
export const LOGO_PATH = '/icons/icon-512.png';

/** Fallback base URL if the environment variable is not set */
const DEFAULT_SITE_URL = 'https://sleepstackapp.com';

/**
 * Get the configured site URL from environment or fallback.
 * Strips trailing slashes for consistent URL construction.
 */
function getSiteUrl(): string {
  const url =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL) ||
    DEFAULT_SITE_URL;
  return url.replace(/\/+$/, '');
}

/**
 * Generate a page title in the format "{page} | Sleep Stack".
 *
 * If the page name is empty or matches the site name, returns just the
 * site name with a tagline for the homepage.
 *
 * @param page - The page-specific title segment
 * @returns Full title string for the <title> tag
 *
 * @example
 * generateTitle("Sleep Calculator")
 * // "Sleep Calculator | Sleep Stack"
 *
 * generateTitle("")
 * // "Sleep Stack - Smart Sleep Cycle Calculator"
 */
export function generateTitle(page: string): string {
  const trimmed = page.trim();
  if (!trimmed || trimmed.toLowerCase() === SITE_NAME.toLowerCase()) {
    return `${SITE_NAME} — Free Sleep Calculators & Tools`;
  }
  return `${trimmed} | ${SITE_NAME}`;
}

/**
 * Generate a meta description for a page.
 *
 * Constructs an SEO-optimized description by combining the page topic
 * with optional context. Descriptions are capped at 160 characters to
 * avoid truncation in search engine results.
 *
 * @param page - The page topic or tool name
 * @param context - Additional context to append (optional)
 * @returns Meta description string, max 160 characters
 *
 * @example
 * generateDescription("Sleep Calculator")
 * // "Calculate your optimal bedtime and wake-up time with Sleep Stack's Sleep Calculator. Science-backed sleep cycles for better rest."
 *
 * generateDescription("Sleep Calculator", "Based on 90-minute cycles")
 * // "Calculate your optimal bedtime and wake-up time with Sleep Stack's Sleep Calculator. Based on 90-minute cycles."
 */
export function generateDescription(page: string, context?: string): string {
  const trimmed = page.trim();

  if (!trimmed) {
    return `${SITE_NAME} offers free sleep calculators to find your ideal bedtime and wake-up time based on sleep cycles. Science-backed tools for better rest.`;
  }

  const base = `Calculate your optimal bedtime and wake-up time with ${SITE_NAME}'s ${trimmed}.`;
  const suffix = context?.trim()
    ? ` ${context.trim()}`
    : ' Science-backed sleep cycles for better rest.';

  const full = `${base}${suffix}`;

  // Cap at 160 characters for SEO
  if (full.length <= 160) return full;
  return full.slice(0, 157) + '...';
}

/**
 * Generate a canonical URL for a given path.
 *
 * Ensures consistent URL formatting: always uses the configured site URL,
 * normalizes leading slashes, and strips trailing slashes (except root).
 *
 * @param path - The URL path (e.g., "/calculators/sleep-debt")
 * @returns Full canonical URL
 *
 * @example
 * generateCanonical("/calculators/sleep-debt")
 * // "https://sleepstackapp.com/calculators/sleep-debt"
 *
 * generateCanonical("/")
 * // "https://sleepstackapp.com"
 */
export function generateCanonical(path: string): string {
  const siteUrl = getSiteUrl();
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!cleanPath) return siteUrl;
  return `${siteUrl}/${cleanPath}`;
}

/**
 * Build a Twitter/X card metadata block for a page.
 *
 * The root layout sets a bare `summary_large_image` card with no title/image;
 * this fills in the page-level title, description, and (large) image so shared
 * links render a rich card instead of falling back to bare OpenGraph tags.
 *
 * @param title - Page title (also used to render the OG image)
 * @param description - Page description
 * @returns A `twitter` object suitable for spreading into a `Metadata` export
 */
export function buildTwitterCard(
  title: string,
  description: string
): {
  card: 'summary_large_image';
  title: string;
  description: string;
  images: string[];
} {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: [generateOgImageUrl(title)],
  };
}

/**
 * Generate an OG image URL for social media sharing.
 *
 * Uses a dynamic OG image generation endpoint that renders the title
 * onto a branded template. The title is URL-encoded for safe transmission.
 *
 * @param title - The text to display on the OG image
 * @returns Full URL to the OG image
 *
 * @example
 * generateOgImageUrl("Sleep Calculator")
 * // "https://sleepstackapp.com/api/og?title=Sleep%20Calculator"
 */
export function generateOgImageUrl(title: string): string {
  const siteUrl = getSiteUrl();
  const encodedTitle = encodeURIComponent(title.trim() || SITE_NAME);
  return `${siteUrl}/api/og?title=${encodedTitle}`;
}
