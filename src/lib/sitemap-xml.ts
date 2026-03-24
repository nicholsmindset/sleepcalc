/**
 * Shared utility for building sitemap XML strings.
 * Used by all named sitemap route handlers.
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://sleepstackapp.com';

export function buildUrlset(
  urls: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: number;
  }>
): string {
  const entries = urls
    .map(({ loc, lastmod, changefreq, priority }) => {
      const lines = [`  <url>`, `    <loc>${loc}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
      if (priority !== undefined) lines.push(`    <priority>${priority.toFixed(1)}</priority>`);
      lines.push(`  </url>`);
      return lines.join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

export function buildSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: string }>
): string {
  const now = new Date().toISOString();
  const entries = sitemaps
    .map(({ loc, lastmod }) =>
      `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod ?? now}</lastmod>\n  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
