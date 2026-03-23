# CLAUDE.md — SleepCycleCalc.com (Next.js + Supabase + Vercel)

## Project Overview

A tool-first, programmatic SEO sleep calculator website with real wearable device integration and AI-powered sleep coaching. Built on Next.js 15 (App Router) with Supabase backend, deployed on Vercel. Designed to generate revenue through three streams: display ads (AdSense → premium network), affiliate commissions (mattress/sleep products), and a paid Pro subscription tier.

**Core thesis:** Every sleep calculator on the internet uses the same generic 90-minute cycle math. We're the first to connect real device data (Oura, Fitbit, WHOOP, Apple Health) and calculate users' ACTUAL personal sleep cycles — then add AI coaching on top. Free users generate ad/affiliate revenue. Engaged users convert to Pro ($5.99/mo) for the full dashboard experience.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server Components default, static generation for SEO pages |
| Language | **TypeScript** strict mode | End-to-end type safety |
| Styling | **Tailwind CSS 4** | Utility-first, dark mode, tree-shakeable |
| UI Components | **shadcn/ui** | Accessible, composable, Tailwind-native |
| Charts | **Recharts** | Lightweight, React-native charting |
| Auth | **Supabase Auth** | Magic links, OAuth (Oura/Fitbit/WHOOP), RLS |
| Database | **Supabase Postgres** | User data, sleep sessions, AI insights |
| Storage | **Supabase Storage** | Apple Health export uploads (optional) |
| Edge Functions | **Supabase Edge Functions** | Wearable API sync, AI coaching |
| Payments | **Stripe** | Pro tier subscriptions |
| Hosting | **Vercel** | Edge network, ISR, serverless functions |
| Analytics | **Vercel Analytics** + **Plausible** | Performance + privacy-friendly |
| Email | **Resend** | Transactional + weekly digest emails |
| AI (Free) | **OpenRouter** (free models) | AI Sleep Coach, weekly insights |
| AI (Edge) | **Vercel AI SDK** | Streaming AI responses in dashboard |
| Ads | AdSense (Phase 1) → Mediavine/Raptive (Phase 2) | Display advertising |

---

## Monetization Model

### Three Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                    REVENUE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STREAM 1: Display Ads (All free users + non-logged-in)     │
│  ├── AdSense Phase 1 → Mediavine/Raptive Phase 2           │
│  ├── Calculator pages, blog posts, programmatic pages       │
│  ├── Target: $8-25 RPM depending on network                │
│  └── NO ads on Pro user dashboard pages                     │
│                                                             │
│  STREAM 2: Affiliate Revenue (All users)                    │
│  ├── Mattress reviews/recommendations ($50-128/sale)        │
│  ├── Sleep product recommendations (CPAP, supplements)      │
│  ├── Pro users get PERSONALIZED recommendations             │
│  │   based on their actual sleep data (higher conversion)   │
│  └── Target: $30-75 avg commission per conversion           │
│                                                             │
│  STREAM 3: Pro Subscriptions ($5.99/mo or $49.99/yr)        │
│  ├── Wearable device connections (unlimited)                │
│  ├── Full sleep history (90 days vs 7 days free)            │
│  ├── AI Sleep Coach (unlimited vs 3/week free)              │
│  ├── Personal sleep cycle calibration                       │
│  ├── Weekly AI digest email                                 │
│  ├── PDF sleep reports                                      │
│  ├── Ad-free dashboard                                      │
│  └── Target: 2-5% conversion of registered users            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tier Breakdown

| Feature | Anonymous | Free Account | Pro ($5.99/mo) |
|---|---|---|---|
| All calculators | ✅ | ✅ | ✅ |
| Blog content | ✅ | ✅ | ✅ |
| Programmatic pages | ✅ | ✅ | ✅ |
| Display ads shown | ✅ | ✅ | ❌ (ad-free dashboard) |
| Connect 1 device | ❌ | ✅ | ✅ |
| Connect unlimited devices | ❌ | ❌ | ✅ |
| Sleep history | ❌ | 7 days | 90 days |
| Basic dashboard | ❌ | ✅ | ✅ |
| AI Sleep Coach | ❌ | 3x/week | Unlimited |
| Personal cycle calibration | ❌ | ❌ | ✅ |
| Weekly AI digest email | ❌ | ❌ | ✅ |
| Exportable PDF reports | ❌ | ❌ | ✅ |
| Personalized product recs | ❌ | ❌ | ✅ |
| Apple Health import | ❌ | 1 import | Unlimited |
| Priority support | ❌ | ❌ | ✅ |

---

## Project Structure

```
/
├── public/
│   ├── fonts/                    # Self-hosted fonts (WOFF2)
│   ├── og/                       # OG images
│   ├── icons/                    # Device logos, app icons
│   ├── ads.txt                   # AdSense verification
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── (marketing)/          # Route group: public SEO pages (with ads)
│   │   │   ├── layout.tsx        # Marketing layout with ads, header, footer
│   │   │   ├── page.tsx          # Homepage — primary sleep calculator
│   │   │   ├── calculators/
│   │   │   │   ├── page.tsx      # All calculators hub
│   │   │   │   ├── sleep-debt/page.tsx
│   │   │   │   ├── nap-calculator/page.tsx
│   │   │   │   ├── caffeine-cutoff/page.tsx
│   │   │   │   ├── shift-worker/page.tsx
│   │   │   │   ├── baby-sleep/page.tsx
│   │   │   │   └── chronotype-quiz/page.tsx
│   │   │   ├── sleep-time/
│   │   │   │   └── [slug]/page.tsx    # Programmatic: "wake up at X"
│   │   │   ├── bedtime/
│   │   │   │   └── [slug]/page.tsx    # Programmatic: "go to bed at X"
│   │   │   ├── age/
│   │   │   │   └── [slug]/page.tsx    # Programmatic: age-based
│   │   │   ├── profession/
│   │   │   │   └── [slug]/page.tsx    # Programmatic: profession-based
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog listing
│   │   │   │   └── [slug]/page.tsx    # Blog posts (MDX)
│   │   │   ├── statistics/page.tsx    # Sleep Statistics 2026 (link magnet)
│   │   │   ├── about/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── medical-disclaimer/page.tsx
│   │   ├── (dashboard)/           # Route group: authenticated dashboard (no ads for Pro)
│   │   │   ├── layout.tsx         # Dashboard layout with sidebar nav
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx       # Main sleep dashboard
│   │   │   │   ├── history/page.tsx    # Sleep history timeline
│   │   │   │   ├── trends/page.tsx     # Trend analysis
│   │   │   │   ├── coach/page.tsx      # AI Sleep Coach
│   │   │   │   ├── devices/page.tsx    # Connected devices management
│   │   │   │   ├── import/page.tsx     # Apple Health import
│   │   │   │   └── settings/page.tsx   # User settings, subscription
│   │   ├── (auth)/                # Route group: auth pages
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── auth/callback/route.ts  # Supabase OAuth callback
│   │   ├── api/
│   │   │   ├── sync/
│   │   │   │   └── [provider]/route.ts # Wearable data sync
│   │   │   ├── ai/
│   │   │   │   ├── coach/route.ts      # AI coaching endpoint
│   │   │   │   └── insights/route.ts   # AI insights generation
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/route.ts     # Stripe webhook handler
│   │   │   └── upload/
│   │   │       └── apple-health/route.ts
│   │   ├── layout.tsx             # Root layout
│   │   ├── not-found.tsx
│   │   └── sitemap.ts            # Dynamic sitemap generation
│   ├── components/
│   │   ├── calculators/           # Interactive calculator components
│   │   │   ├── BedtimeCalculator.tsx
│   │   │   ├── WakeUpCalculator.tsx
│   │   │   ├── SleepDebtCalculator.tsx
│   │   │   ├── NapCalculator.tsx
│   │   │   ├── CaffeineCalculator.tsx
│   │   │   ├── ShiftWorkerCalculator.tsx
│   │   │   ├── BabySleepCalculator.tsx
│   │   │   ├── ChronotypeQuiz.tsx
│   │   │   └── shared/
│   │   │       ├── TimePicker.tsx
│   │   │       ├── TimeWheel.tsx
│   │   │       ├── SleepCycleChart.tsx
│   │   │       └── ResultCard.tsx
│   │   ├── dashboard/             # Dashboard-specific components
│   │   │   ├── LastNight.tsx
│   │   │   ├── VsCalculator.tsx
│   │   │   ├── TrendCharts.tsx
│   │   │   ├── AICoach.tsx
│   │   │   ├── PersonalCycles.tsx
│   │   │   ├── ConnectedDevices.tsx
│   │   │   ├── Hypnogram.tsx
│   │   │   └── SleepScoreRing.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── AdSlot.tsx
│   │   ├── marketing/
│   │   │   ├── PricingTable.tsx
│   │   │   ├── DeviceLogos.tsx
│   │   │   ├── FeatureComparison.tsx
│   │   │   └── CTABanner.tsx
│   │   ├── seo/
│   │   │   ├── SchemaMarkup.tsx
│   │   │   └── MetaTags.tsx
│   │   ├── content/
│   │   │   ├── FAQ.tsx
│   │   │   ├── RelatedTools.tsx
│   │   │   ├── MedicalDisclaimer.tsx
│   │   │   ├── AuthorBox.tsx
│   │   │   └── AffiliateCard.tsx
│   │   └── ui/                    # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── slider.tsx
│   │       ├── badge.tsx
│   │       ├── progress.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   ├── server.ts          # Server-side Supabase client
│   │   │   ├── middleware.ts      # Auth middleware helper
│   │   │   └── types.ts          # Generated DB types
│   │   ├── stripe/
│   │   │   ├── client.ts          # Stripe client
│   │   │   ├── config.ts          # Price IDs, product config
│   │   │   └── webhooks.ts        # Webhook handler logic
│   │   ├── integrations/
│   │   │   ├── oura.ts            # Oura API v2 client + normalizer
│   │   │   ├── fitbit.ts          # Fitbit Web API client + normalizer
│   │   │   ├── whoop.ts           # WHOOP API v2 client + normalizer
│   │   │   ├── apple-health.ts    # Apple Health XML parser
│   │   │   └── normalize.ts       # Shared normalization types/utils
│   │   ├── ai/
│   │   │   ├── openrouter.ts      # OpenRouter API client
│   │   │   ├── prompts.ts         # AI prompt templates
│   │   │   └── coach.ts           # Sleep coaching logic
│   │   └── email/
│   │       ├── resend.ts          # Resend client
│   │       └── templates/         # Email HTML templates
│   ├── utils/
│   │   ├── sleep-cycle.ts         # Core sleep cycle calculation engine
│   │   ├── sleep-debt.ts          # Sleep debt calculator
│   │   ├── nap-optimizer.ts       # Nap timing logic
│   │   ├── caffeine-half-life.ts  # Caffeine metabolism
│   │   ├── chronotype.ts          # Chronotype quiz scoring
│   │   ├── age-recommendations.ts # Age-based sleep data (NSF)
│   │   ├── personal-cycles.ts     # Personal cycle calibration from real data
│   │   ├── format-time.ts         # Time formatting utilities
│   │   ├── seo.ts                 # SEO helper functions
│   │   └── schema.ts             # JSON-LD schema generators
│   ├── content/
│   │   ├── blog/                  # MDX blog posts
│   │   ├── data/
│   │   │   ├── sleep-times.json   # Programmatic: time-based data
│   │   │   ├── age-recs.json      # Programmatic: age-based data
│   │   │   └── professions.json   # Programmatic: profession-based data
│   │   └── calculators/           # Calculator page content
│   ├── hooks/
│   │   ├── use-user.ts            # Current user + subscription status
│   │   ├── use-sleep-data.ts      # Fetch/cache sleep data
│   │   ├── use-subscription.ts    # Pro tier check
│   │   └── use-device-sync.ts     # Wearable sync status
│   ├── types/
│   │   ├── sleep.ts               # NormalizedSleepSession, UserSleepProfile
│   │   ├── devices.ts             # DeviceConnection types
│   │   └── subscription.ts        # Tier/subscription types
│   └── styles/
│       └── globals.css            # Tailwind directives + custom props
├── supabase/
│   ├── migrations/                # SQL migrations
│   │   ├── 001_users.sql
│   │   ├── 002_device_connections.sql
│   │   ├── 003_sleep_sessions.sql
│   │   ├── 004_ai_insights.sql
│   │   ├── 005_subscriptions.sql
│   │   └── 006_rls_policies.sql
│   ├── functions/                 # Supabase Edge Functions
│   │   ├── sync-oura/index.ts
│   │   ├── sync-fitbit/index.ts
│   │   ├── sync-whoop/index.ts
│   │   └── weekly-digest/index.ts
│   └── seed.sql                   # Dev seed data
├── scripts/
│   ├── generate-programmatic.ts   # Generate programmatic page data
│   ├── generate-og-images.ts      # OG image generation
│   └── generate-types.ts          # Supabase type generation
├── middleware.ts                   # Next.js middleware (auth check, redirects)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                     # Local env vars (never committed)
├── CLAUDE.md                      # This file
├── PROMPTS.md                     # Build prompts
├── PROMPTS-INTEGRATIONS.md        # Wearable + AI prompts
└── INTEGRATIONS.md                # API research reference
```

---

## Design System

### Color Palette (Dark-first, sleep-themed)

```css
:root {
  --surface:       #0a0a1a;    /* Near-black page background */
  --card:          #12122a;    /* Card backgrounds */
  --card-hover:    #1a1a3a;    /* Card hover state */
  --border:        #1e1e4a;    /* Subtle borders */
  --border-bright: #2d2d6e;    /* Active borders */

  --primary:       #6c5ce7;    /* Indigo — CTAs, active states */
  --primary-light: #a29bfe;    /* Light indigo — hover */
  --primary-dark:  #4834d4;    /* Dark indigo — pressed */

  --accent:        #00cec9;    /* Teal — results, success, scores */
  --accent-light:  #55efc4;    /* Light teal — positive trends */
  --warning:       #fdcb6e;    /* Amber — warnings, caffeine */
  --danger:        #ff6b6b;    /* Red — sleep debt, poor scores */

  --text:          #f1f1f7;    /* Primary text */
  --text-muted:    #8b8ba7;    /* Secondary text */
  --text-dim:      #4a4a6a;    /* Tertiary/disabled text */

  /* Pro tier accent */
  --pro:           #f9ca24;    /* Gold — Pro badges, upgrade CTAs */
  --pro-gradient:  linear-gradient(135deg, #f9ca24, #f0932b);
}
```

### Typography

```
Headings:   'Plus Jakarta Sans', weight 700/800
Body:       'Inter', weight 400/500/600
Monospace:  'JetBrains Mono', weight 400 (time displays, scores)
```

### Key Design Principles

1. **Dark mode default** — calming for a sleep site, reduces eye strain at night
2. **Calculator above the fold** — zero scroll to interact on desktop
3. **Sub-100ms result rendering** — calculations run client-side, instant feedback
4. **Glass-morphism cards** — frosted glass effect on dark backgrounds
5. **Gradient accents** — primary-to-accent gradients on CTAs and score rings
6. **Mobile-first** — 65%+ traffic is mobile, thumb-friendly targets (48px min)
7. **Pro visual distinction** — gold accents, "PRO" badges, premium feel for paid features
8. **Ad-aware layout** — reserved slots with exact dimensions, lazy-loaded

---

## Database Schema (Supabase Postgres)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  age_years INTEGER,
  subscription_tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device connections (OAuth tokens for wearables)
CREATE TABLE public.device_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('oura', 'fitbit', 'whoop', 'withings', 'garmin')),
  access_token TEXT NOT NULL,       -- Encrypted at application level
  refresh_token TEXT,                -- Encrypted at application level
  scopes TEXT[],
  provider_user_id TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, provider)
);

-- Sleep sessions (normalized from any device)
CREATE TABLE public.sleep_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  source_session_id TEXT,
  bedtime_start TIMESTAMPTZ NOT NULL,
  bedtime_end TIMESTAMPTZ NOT NULL,
  sleep_onset TIMESTAMPTZ,
  wake_time TIMESTAMPTZ,
  total_duration_min INTEGER,
  sleep_latency_min INTEGER,
  deep_min INTEGER,
  light_min INTEGER,
  rem_min INTEGER,
  awake_min INTEGER,
  efficiency NUMERIC(5,2),
  sleep_score INTEGER,
  cycles_completed NUMERIC(3,1),
  avg_heart_rate INTEGER,
  min_heart_rate INTEGER,
  resting_heart_rate INTEGER,
  hrv_rmssd NUMERIC(6,2),
  respiratory_rate NUMERIC(4,1),
  spo2 NUMERIC(5,2),
  skin_temp_delta NUMERIC(4,2),
  disturbance_count INTEGER,
  is_nap BOOLEAN DEFAULT FALSE,
  hypnogram JSONB,               -- Array of {timestamp, stage} for chart
  raw_data JSONB,                 -- Full provider response (for debugging)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, source, source_session_id)
);

-- AI-generated insights
CREATE TABLE public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('coach', 'weekly_digest', 'anomaly', 'score_explanation')),
  content TEXT NOT NULL,
  data_context JSONB,              -- Sleep data that generated this insight
  model_used TEXT,
  tokens_used INTEGER,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions (synced from Stripe webhooks)
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view own devices" ON public.device_connections
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own sleep" ON public.sleep_sessions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own insights" ON public.ai_insights
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_sleep_sessions_user_date ON public.sleep_sessions(user_id, bedtime_start DESC);
CREATE INDEX idx_sleep_sessions_source ON public.sleep_sessions(user_id, source);
CREATE INDEX idx_ai_insights_user_type ON public.ai_insights(user_id, type, generated_at DESC);
CREATE INDEX idx_device_connections_user ON public.device_connections(user_id, provider);
```

---

## Static Generation Strategy (SEO Performance)

### Page Types and Rendering

| Page Type | Rendering | Revalidate | Notes |
|---|---|---|---|
| Homepage | Static (SSG) | 24h ISR | Calculator is client component |
| Calculator pages | Static (SSG) | 7d ISR | Interactive parts are client |
| Programmatic pages | Static (generateStaticParams) | 30d ISR | 200+ pages, all pre-built |
| Blog posts | Static (MDX) | 7d ISR | Content rarely changes |
| Statistics page | Static | 30d ISR | Updated monthly |
| Dashboard pages | Dynamic (SSR) | No cache | Real-time user data |
| API routes | Dynamic | No cache | Data fetching/mutations |

### generateStaticParams for Programmatic Pages

```typescript
// src/app/(marketing)/sleep-time/[slug]/page.tsx
export async function generateStaticParams() {
  const times = await import('@/content/data/sleep-times.json');
  return times.map((t) => ({ slug: t.slug }));
}

// This pre-builds all 200+ pages at build time
// ISR revalidates stale pages on-demand
```

### Performance Budget

| Metric | Target | Strategy |
|---|---|---|
| LCP | < 1.5s | Static pages, preloaded fonts, optimized images |
| INP | < 150ms | Client components only where needed, no heavy hydration |
| CLS | < 0.05 | Reserved ad dimensions, explicit image sizes, font swap |
| TTFB | < 100ms | Vercel Edge Network, static generation |
| Total JS (calculator pages) | < 80KB | Dynamic imports, tree shaking |
| Lighthouse Performance | 90+ | Must pass before deploy |

---

## Environment Variables

```env
# .env.local (NEVER commit)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
STRIPE_PRO_YEARLY_PRICE_ID=price_xxx

# Wearable OAuth
OURA_CLIENT_ID=xxx
OURA_CLIENT_SECRET=xxx
FITBIT_CLIENT_ID=xxx
FITBIT_CLIENT_SECRET=xxx
WHOOP_CLIENT_ID=xxx
WHOOP_CLIENT_SECRET=xxx

# AI
OPENROUTER_API_KEY=xxx

# Email
RESEND_API_KEY=xxx

# Encryption
ENCRYPTION_KEY=xxx    # For encrypting OAuth tokens in DB

# Site
NEXT_PUBLIC_SITE_URL=https://sleepcyclecalc.com
```

---

## Ad Integration Rules

### Free users: Ads on all marketing/content pages
### Pro users: Ad-free dashboard experience

```typescript
// src/components/layout/AdSlot.tsx
// Only renders if user is NOT Pro tier

'use client';

import { useSubscription } from '@/hooks/use-subscription';

export function AdSlot({ slot, format, className }) {
  const { isPro } = useSubscription();
  if (isPro) return null; // Pro users never see ads

  return (
    <div
      className={cn('ad-slot', className)}
      data-ad-slot={slot}
      style={{ minHeight: AD_DIMENSIONS[format].height }}
    >
      {/* Lazy-loaded via IntersectionObserver */}
    </div>
  );
}
```

### Ad Placement Rules
- **NEVER** place ads above or inside the calculator tool
- **NEVER** place ads in the dashboard for Pro users
- First ad slot: BELOW calculator results
- Maximum: 2 ads on mobile, 3 on desktop per page
- All ad slots have reserved CSS dimensions (prevent CLS)
- Lazy load all ads with IntersectionObserver

---

## Key Dependencies

```json
{
  "next": "^15.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "@supabase/supabase-js": "^2.x",
  "@supabase/ssr": "^0.5.x",
  "stripe": "^17.x",
  "@stripe/stripe-js": "^4.x",
  "tailwindcss": "^4.x",
  "@tailwindcss/typography": "^0.5.x",
  "recharts": "^2.x",
  "next-mdx-remote": "^5.x",
  "gray-matter": "^4.x",
  "@radix-ui/react-dialog": "^1.x",
  "@radix-ui/react-tabs": "^1.x",
  "@radix-ui/react-slider": "^1.x",
  "@radix-ui/react-accordion": "^1.x",
  "lucide-react": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "date-fns": "^4.x",
  "zod": "^3.x",
  "resend": "^4.x",
  "jszip": "^3.x",
  "ai": "^4.x",
  "class-variance-authority": "^0.7.x",
  "sharp": "^0.33.x"
}
```

---

## Development Commands

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm run generate     # Generate programmatic page data + Supabase types
npm run db:migrate   # Run Supabase migrations
npm run db:types     # Generate TypeScript types from Supabase schema
npm run db:seed      # Seed development data
npm run db:reset     # Reset database (dev only)
npm run stripe:listen # Listen for Stripe webhooks locally
```

---

## IMPORTANT RULES FOR CLAUDE CODE

1. **Use Next.js App Router** — no Pages Router, no `getServerSideProps`
2. **Server Components by default** — only add `'use client'` when the component needs interactivity (state, effects, event handlers)
3. **All calculator logic in `src/utils/`** — pure functions, framework-agnostic, testable
4. **Calculator UI components are Client Components** (`'use client'`) — they need state for user input
5. **Marketing/content pages are Server Components** — static, fast, SEO-optimized
6. **Dashboard pages use Server Components with Client Component islands** — fetch data server-side, render interactive charts client-side
7. **Supabase server client** for server components/route handlers, **browser client** for client components
8. **Always check subscription tier** before rendering Pro features — use the `useSubscription` hook or server-side check
9. **Tailwind only** — no CSS modules, no styled-components
10. **shadcn/ui** for all base UI components — don't build custom buttons, dialogs, etc.
11. **Zod for validation** — all API inputs, form data, and external API responses
12. **Every marketing page must have**: unique meta title/description, JSON-LD schema, OG image, canonical URL
13. **Ad slots MUST have reserved dimensions** in CSS — never cause CLS
14. **generateStaticParams** for all programmatic pages — they must be pre-built at build time
15. **Medical disclaimer** on every calculator and dashboard page
16. **OAuth tokens encrypted** before storing in Supabase — use application-level AES-256
17. **No secrets in client components** — all API keys, tokens, and sensitive logic in server-side code only
