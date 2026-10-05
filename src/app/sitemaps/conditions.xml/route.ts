import { buildUrlset, xmlResponse } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';

export function GET() {
  // Condition guides are excluded from indexing pending clinical review.
  return xmlResponse(buildUrlset([]));
}
