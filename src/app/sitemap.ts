import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import sleepTimes from '@/content/data/sleep-times.json';
import ageRecs from '@/content/data/age-recs.json';
import professions from '@/content/data/professions.json';
import babySleepSchedules from '@/content/data/baby-sleep-schedules.json';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://sleepstackapp.com';

const now = new Date().toISOString();

// ─── Segment IDs ────────────────────────────────────────────────────────────
// 0 → core static pages
// 1 → sleep-time (wake-up-at-X)
// 2 → bedtime (go-to-bed-at-X)
// 3 → age-based pages
// 4 → profession pages
// 5 → baby-sleep-schedule pages
// 6 → blog posts

export function generateSitemaps() {
  return [
    { id: 0 }, // core
    { id: 1 }, // sleep-time
    { id: 2 }, // bedtime
    { id: 3 }, // age
    { id: 4 }, // profession
    { id: 5 }, // baby-sleep-schedule
    { id: 6 }, // blog
  ];
}

export default function sitemap({
  id,
}: {
  id: number;
}): MetadataRoute.Sitemap {
  switch (id) {
    // ── 0: Core static pages ──────────────────────────────────────────────
    case 0:
      return [
        {
          url: BASE_URL,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 1.0,
        },
        {
          url: `${BASE_URL}/calculators`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.9,
        },
        {
          url: `${BASE_URL}/calculators/sleep-debt`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/calculators/nap-calculator`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/calculators/caffeine-cutoff`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/calculators/shift-worker`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/calculators/baby-sleep`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/calculators/chronotype-quiz`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/statistics`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.9,
        },
        {
          url: `${BASE_URL}/blog`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/about`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.4,
        },
        {
          url: `${BASE_URL}/privacy`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.2,
        },
        {
          url: `${BASE_URL}/terms`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.2,
        },
        {
          url: `${BASE_URL}/medical-disclaimer`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.2,
        },
      ];

    // ── 1: Sleep-time pages (wake-up-at-X) ────────────────────────────────
    case 1:
      return sleepTimes
        .filter((t: { type: string }) => t.type === 'wake')
        .map((t: { slug: string }) => ({
          url: `${BASE_URL}/sleep-time/${t.slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));

    // ── 2: Bedtime pages (go-to-bed-at-X) ────────────────────────────────
    case 2:
      return sleepTimes
        .filter((t: { type: string }) => t.type === 'bedtime')
        .map((t: { slug: string }) => ({
          url: `${BASE_URL}/bedtime/${t.slug}`,
          lastModified: now,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));

    // ── 3: Age-based pages ────────────────────────────────────────────────
    case 3:
      return ageRecs.map((a: { slug: string }) => ({
        url: `${BASE_URL}/age/${a.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // ── 4: Profession pages ───────────────────────────────────────────────
    case 4:
      return professions.map((p: { slug: string }) => ({
        url: `${BASE_URL}/profession/${p.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // ── 5: Baby sleep schedule pages ──────────────────────────────────────
    case 5:
      return babySleepSchedules.map((b: { slug: string }) => ({
        url: `${BASE_URL}/baby-sleep-schedule/${b.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // ── 6: Blog posts ─────────────────────────────────────────────────────
    case 6:
      return getAllPosts().map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));

    default:
      return [];
  }
}
