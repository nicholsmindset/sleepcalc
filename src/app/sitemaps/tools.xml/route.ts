import { BASE_URL, buildUrlset, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';
export const revalidate = 86400;

const TOOL_PATHS = [
  '/tools/circadian-guide',
  '/tools/jet-lag-calculator',
  '/tools/sleep-score',
  '/tools/moon-sleep',
  '/tools/dst-calculator',
  '/tools/sleep-journal',
  '/tools/sleep-foods',
  '/tools/white-noise',
];

export function GET() {
  const now = new Date().toISOString();

  const xml = buildUrlset(
    TOOL_PATHS.map((path) => ({
      loc: `${BASE_URL}${path}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    }))
  );

  return xmlResponse(xml);
}
