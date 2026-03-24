import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import sleepTimes from '@/content/data/sleep-times.json';
import ageRecs from '@/content/data/age-recs.json';
import professions from '@/content/data/professions.json';
import babySleepSchedules from '@/content/data/baby-sleep-schedules.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://sleepstackapp.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── Core marketing pages ────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/calculators`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/calculators/sleep-debt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/nap-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/caffeine-cutoff`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/shift-worker`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/baby-sleep`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators/chronotype-quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/statistics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/medical-disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // ── Programmatic: sleep-time pages (wake-up-at-X) ─────────────────
  const wakePages: MetadataRoute.Sitemap = sleepTimes
    .filter((t: { type: string }) => t.type === 'wake')
    .map((t: { slug: string }) => ({
      url: `${BASE_URL}/sleep-time/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // ── Programmatic: bedtime pages ───────────────────────────────────
  const bedtimePages: MetadataRoute.Sitemap = sleepTimes
    .filter((t: { type: string }) => t.type === 'bedtime')
    .map((t: { slug: string }) => ({
      url: `${BASE_URL}/bedtime/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // ── Programmatic: age-based pages ─────────────────────────────────
  const agePages: MetadataRoute.Sitemap = ageRecs.map((a: { slug: string }) => ({
    url: `${BASE_URL}/age/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Programmatic: profession-based pages ──────────────────────────
  const professionPages: MetadataRoute.Sitemap = professions.map((p: { slug: string }) => ({
    url: `${BASE_URL}/profession/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Programmatic: baby sleep schedule pages ──────────────────────
  const babySleepPages: MetadataRoute.Sitemap = babySleepSchedules.map((b: { slug: string }) => ({
    url: `${BASE_URL}/baby-sleep-schedule/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ── Blog posts ────────────────────────────────────────────────────
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...wakePages,
    ...bedtimePages,
    ...agePages,
    ...professionPages,
    ...babySleepPages,
    ...blogPosts,
  ];
}
