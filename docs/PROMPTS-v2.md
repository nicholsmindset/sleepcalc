# PROMPTS-v2.md — Sleep Calculator Build Prompts (Next.js + Supabase + Vercel)

> **How to use:** Copy each prompt into Claude Code in sequence.
> Wait for completion before the next. ⚡ = can run in parallel. 🔑 = critical path.
> All prompts reference CLAUDE.md (v2) — ensure it's in the project root.

---

## PHASE 0: PROJECT SCAFFOLD

### Prompt 0.1 — 🔑 Initialize Next.js + Supabase Project

```
Read CLAUDE.md for the full project spec. Initialize the project:

1. Create a new Next.js 15 project with App Router:
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

2. Install all dependencies from CLAUDE.md Key Dependencies section. Also install:
   - @supabase/supabase-js @supabase/ssr (Supabase client)
   - stripe @stripe/stripe-js (payments)
   - recharts (charts)
   - next-mdx-remote gray-matter (blog MDX)
   - lucide-react (icons)
   - clsx tailwind-merge class-variance-authority (utility)
   - date-fns zod resend jszip sharp ai

3. Initialize shadcn/ui:
   npx shadcn@latest init
   - Style: New York
   - Base color: Slate
   - CSS variables: yes
   Then add components: button card dialog tabs slider badge progress accordion separator avatar dropdown-menu tooltip sheet input label textarea select switch

4. Set up Tailwind config with the CLAUDE.md design system colors as CSS variables in globals.css

5. Create the full directory structure from CLAUDE.md. Empty files/placeholder exports are fine.

6. Create .env.local with placeholder values for all env vars listed in CLAUDE.md

7. Create src/lib/supabase/client.ts and src/lib/supabase/server.ts:
   - client.ts: createBrowserClient for client components
   - server.ts: createServerClient using cookies() for server components/route handlers

8. Create middleware.ts at project root:
   - Refresh Supabase session on every request
   - Protect /dashboard/* routes (redirect to /login if not authenticated)
   - Allow all (marketing) routes for unauthenticated users

9. Create a basic root layout (src/app/layout.tsx):
   - HTML with dark mode, proper fonts (Plus Jakarta Sans, Inter, JetBrains Mono from next/font/google)
   - Supabase provider wrapper
   - Metadata defaults

10. Verify: npm run dev works, npm run build succeeds with zero errors.

Do NOT create any page content yet — just scaffolding and configuration.
```

### Prompt 0.2 — 🔑 Supabase Database Setup

```
Read CLAUDE.md database schema section. Set up the Supabase database:

1. Create all SQL migration files in supabase/migrations/:
   - 001_profiles.sql: profiles table with trigger to auto-create on auth.users insert
   - 002_device_connections.sql: device_connections table
   - 003_sleep_sessions.sql: sleep_sessions table with indexes
   - 004_ai_insights.sql: ai_insights table
   - 005_subscriptions.sql: subscriptions table
   - 006_rls_policies.sql: All Row Level Security policies from CLAUDE.md

2. Create the auto-profile trigger:
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$ BEGIN
     INSERT INTO public.profiles (id, email)
     VALUES (NEW.id, NEW.email);
     RETURN NEW;
   END; $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

3. Create supabase/seed.sql with test data:
   - A test user profile
   - Sample sleep sessions for 14 days (realistic data with varying scores)
   - A test device connection (mock Oura)
   - Sample AI insights

4. Create scripts/generate-types.ts that runs:
   npx supabase gen types typescript --project-id=YOUR_PROJECT_ID > src/lib/supabase/types.ts

5. Create src/lib/supabase/types.ts with TypeScript interfaces matching the DB schema (manual for now, auto-generated later when connected to real Supabase project)

6. Add npm scripts: db:migrate, db:types, db:seed, db:reset
```

### Prompt 0.3 — 🔑 Marketing Layout + Design System

```
Read CLAUDE.md design system section. Build the marketing layout and shared components:

1. Create src/app/(marketing)/layout.tsx:
   - Server Component
   - Includes Header, Footer, Breadcrumbs slot
   - Passes children
   - This layout wraps ALL public/SEO pages

2. Create src/components/layout/Header.tsx:
   - Server Component with a client island for mobile menu
   - Logo: "SleepCycleCalc" in Plus Jakarta Sans
   - Nav links: Home, Calculators (dropdown), Blog, Statistics
   - Right side: "Dashboard" link (if logged in) or "Sign Up Free" CTA
   - "Pro" badge next to Dashboard if subscribed
   - Sticky header with dark glass-blur backdrop
   - Mobile: hamburger menu using shadcn Sheet component

3. Create src/components/layout/Footer.tsx:
   - Site links, calculator links, legal links
   - "Built for better sleep" tagline
   - © 2026 SleepCycleCalc

4. Create src/components/layout/Breadcrumbs.tsx:
   - Props: items [{label, href}]
   - BreadcrumbList JSON-LD schema included

5. Create src/components/layout/AdSlot.tsx:
   - Client Component
   - Checks subscription tier — returns null for Pro users
   - Reserved dimensions per format (leaderboard: 728×90, rectangle: 300×250, mobile: 320×100)
   - IntersectionObserver lazy loading
   - "Advertisement" label above

6. Create src/components/seo/SchemaMarkup.tsx:
   - Server Component
   - Props: type + data object
   - Renders <script type="application/ld+json"> for WebApplication, Article, FAQPage, BreadcrumbList, WebSite, Organization

7. Create src/components/content/FAQ.tsx:
   - Uses shadcn Accordion
   - Auto-generates FAQPage schema
   - Props: items [{question, answer}]

8. Create src/components/content/MedicalDisclaimer.tsx
9. Create src/components/content/RelatedTools.tsx
10. Create src/components/content/AuthorBox.tsx

Style everything with the dark theme from CLAUDE.md. Verify by creating a test page at src/app/(marketing)/page.tsx.
```

---

## PHASE 1: CALCULATOR ENGINE + SHARED COMPONENTS

### Prompt 1.1 — 🔑 Sleep Calculation Utilities

```
Read CLAUDE.md for calculator logic. Create all pure utility functions in src/utils/:

1. sleep-cycle.ts — calculateBedtime(), calculateWakeUp(), getSleepPhases()
2. sleep-debt.ts — calculateSleepDebt(), generateRecoveryPlan()
3. nap-optimizer.ts — calculateNap() with power/recovery/full-cycle types
4. caffeine-half-life.ts — calculateCutoff() with drink presets and decay curve
5. chronotype.ts — quiz scoring, chronotype classification
6. age-recommendations.ts — NSF guidelines lookup by age
7. personal-cycles.ts — analyzePersonalCycles() for real device data (Pro feature)
8. format-time.ts — formatTime12h, formatTime24h, formatDuration, parseTimeString
9. seo.ts — generateTitle, generateDescription, generateCanonical
10. schema.ts — JSON-LD generators for all schema types

All functions: pure TypeScript, no React imports, full JSDoc comments, exported types.
Follow the exact specifications from CLAUDE.md Core Calculator Logic section.
```

### Prompt 1.2 — 🔑 Shared Calculator UI Components

```
Read CLAUDE.md for design system. Create reusable calculator UI components (all 'use client'):

1. src/components/calculators/shared/TimePicker.tsx
   - Beautiful time input with hour/minute selectors and AM/PM toggle
   - Large touch targets, JetBrains Mono for display
   - Mobile: scroll wheels, Desktop: click-to-select

2. src/components/calculators/shared/SleepCycleChart.tsx
   - Recharts-based hypnogram visualization
   - X-axis: time, Y-axis: sleep depth (Awake→Light→Deep→REM)
   - Smooth area chart with gradient fills using design system colors
   - Responsive, min-width 300px

3. src/components/calculators/shared/ResultCard.tsx
   - Single sleep recommendation display
   - Props: time, cycles, totalSleep, quality ('optimal'|'good'|'minimum')
   - Color-coded borders: teal=optimal, primary=good, warning=minimum
   - "Recommended" badge on best option
   - Glass-morphism card on dark background

4. src/components/calculators/shared/TimeWheel.tsx
   - SVG circular 24h clock visualization
   - Highlighted arc for sleep period
   - Markers for bedtime and wake time
   - Animated transitions

All components must use Tailwind + design system colors. Use shadcn primitives where applicable.
```

---

## PHASE 2: CALCULATOR PAGES

### Prompt 2.1 — 🔑 Homepage (Primary Sleep Calculator)

```
Read CLAUDE.md. Build the homepage at src/app/(marketing)/page.tsx:

1. Create src/components/calculators/BedtimeCalculator.tsx ('use client'):
   - Two tabs: "I need to wake up at..." and "I want to go to bed at..."
   - "Sleep Now" quick button (uses current time)
   - TimePicker input, adjustable fall-asleep slider (5-30 min)
   - 3 ResultCards for 4/5/6 cycle options
   - SleepCycleChart showing selected option
   - TimeWheel visualization
   - Below results: CTA "Connect your sleep tracker for personalized times →"

2. Build the page (Server Component with client calculator island):
   - Metadata: title "Sleep Calculator — Find Your Ideal Bedtime & Wake Up Time"
   - Optimized meta description for "sleep calculator" keyword
   - JSON-LD: WebSite + WebApplication
   - Layout:
     a. Hero: H1 + subtitle
     b. BedtimeCalculator (client component)
     c. AdSlot after results
     d. "How Sleep Cycles Work" section (800 words, Server Component)
     e. Tips section
     f. AdSlot
     g. FAQ (8 questions targeting featured snippets)
     h. RelatedTools
     i. MedicalDisclaimer

3. Use generateMetadata() for SEO. Content must be genuine health education, not keyword-stuffed.
```

### Prompt 2.2 — ⚡ Sleep Debt Calculator Page

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/sleep-debt/page.tsx.

Create SleepDebtCalculator.tsx ('use client'):
- 7-day sleep log (sliders per day, 0-14h in 0.5h increments)
- Age selector for recommended hours lookup
- Results: total debt (color-coded), daily deficit bar chart (Recharts), recovery plan
- Uses sleep-debt.ts utilities

Page: Server Component with calculator island, 1,500-2,000 words supporting content,
FAQ, breadcrumbs. Target: "sleep debt calculator"
```

### Prompt 2.3 — ⚡ Nap Calculator Page

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/nap-calculator/page.tsx.

Create NapCalculator.tsx ('use client'):
- Inputs: current time (auto-filled), bedtime tonight
- 3 nap type buttons: Power (20m), Recovery (60m), Full Cycle (90m)
- Results: start time, alarm time, sleep impact warning if after 3 PM
- Visual day timeline showing nap position

Page: 1,500 words, FAQ. Target: "nap calculator"
```

### Prompt 2.4 — ⚡ Caffeine Calculator Page

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/caffeine-cutoff/page.tsx.

Create CaffeineCalculator.tsx ('use client'):
- Input: planned bedtime
- Drink cards (espresso, coffee, cold brew, tea, energy drink) with caffeine amounts
- Drink log: add multiple drinks with consumption times
- Caffeine decay chart (Recharts line chart over time)
- Results: cutoff time, caffeine at bedtime, status per drink
- Uses caffeine-half-life.ts

Page: 1,500 words — unique tool, few competitors have this. Target: "caffeine and sleep calculator"
```

### Prompt 2.5 — ⚡ Shift Worker Calculator

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/shift-worker/page.tsx.

Create ShiftWorkerCalculator.tsx ('use client'):
- Inputs: shift start, shift end, shift type (day/evening/night/rotating), commute time
- Results: recommended sleep window, pre-shift nap, cycle alignment options
- Rotating shift: weekly schedule planner
- Split sleep strategy for night shift

Page: 2,000 words. MOST UNDERSERVED NICHE (KD 5-20). Target: "shift worker sleep calculator", "nurse sleep schedule"
```

### Prompt 2.6 — ⚡ Baby Sleep Calculator

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/baby-sleep/page.tsx.

Create BabySleepCalculator.tsx ('use client'):
- Input: child age (0 months - 5 years)
- Results: recommended total sleep, nighttime hours, nap count + duration, wake windows
- Visual daily schedule timeline
- Uses age-recommendations.ts

Page: 2,000 words. Target: "baby sleep calculator", "toddler sleep schedule"
```

### Prompt 2.7 — ⚡ Chronotype Quiz

```
Read CLAUDE.md. Build src/app/(marketing)/calculators/chronotype-quiz/page.tsx.

Create ChronotypeQuiz.tsx ('use client'):
- 10-question quiz (Horne-Östberg inspired)
- Progress bar, one question at a time
- Results: Lion/Bear/Wolf/Dolphin with personalized sleep schedule
- Shareable result card
- CTA: "Connect your device for a data-based chronotype analysis (more accurate than any quiz)"

Page: 1,800 words. Great for social sharing and backlinks.
```

### Prompt 2.8 — Calculators Hub

```
Build src/app/(marketing)/calculators/page.tsx — directory page linking all calculators.
Grid of cards (2 col mobile, 3 desktop) with icon, name, description, link.
800 words supporting content. Schema: ItemList.
```

---

## PHASE 3: PROGRAMMATIC SEO PAGES

### Prompt 3.1 — 🔑 Generate Programmatic Data + Templates

```
Read CLAUDE.md. Create the programmatic page data and dynamic routes:

1. Create scripts/generate-programmatic.ts:
   - Generates src/content/data/sleep-times.json (13 wake times 4AM-10AM + 13 bedtimes 8PM-2AM in 30-min increments)
   - Generates src/content/data/age-recs.json (~30 age entries from newborn to 65+)
   - Generates src/content/data/professions.json (20 professions)
   - Each entry: slug, title, h1, metaDescription, preCalculated results, unique content blocks (800-1,200 words), FAQ items

2. Create src/app/(marketing)/sleep-time/[slug]/page.tsx:
   - generateStaticParams() returns all slugs from sleep-times.json
   - generateMetadata() returns unique title/description per page
   - Page shows: pre-filled calculator, quick-reference results table, unique content, FAQ, related pages (prev/next), RelatedTools
   - Each page: unique 800-1,200 words of contextual content

3. Create src/app/(marketing)/bedtime/[slug]/page.tsx — same pattern for bedtime pages

4. Create src/app/(marketing)/age/[slug]/page.tsx — age-based pages

5. Create src/app/(marketing)/profession/[slug]/page.tsx — profession-based pages

Total: ~90 pre-built static pages. Every page has unique content, unique title/description, canonical URL, schema markup, and internal links to adjacent pages.
```

---

## PHASE 4: AUTH + USER ACCOUNTS

### Prompt 4.1 — 🔑 Supabase Auth Flow

```
Read CLAUDE.md. Implement authentication:

1. Create src/app/(auth)/login/page.tsx:
   - Clean dark-themed login page
   - Magic link email input (primary method)
   - "Or connect with your sleep device:" — Oura, Fitbit, WHOOP OAuth buttons
   - These use Supabase's built-in OAuth provider support
   - Social auth buttons styled with device logos

2. Create src/app/(auth)/signup/page.tsx:
   - Same as login but with "Create Account" header
   - Email input for magic link
   - "By signing up you agree to Terms and Privacy Policy"

3. Create src/app/(auth)/auth/callback/route.ts:
   - Handles Supabase auth callback (magic link + OAuth)
   - Exchanges code for session
   - Redirects to /dashboard

4. Update middleware.ts:
   - Refresh Supabase auth session on every request
   - Protect /dashboard/* — redirect to /login if no session
   - Pass subscription tier info via cookie or header for quick checks

5. Create src/hooks/use-user.ts:
   - Hook that returns current user, profile, loading state
   - Uses Supabase auth listener for real-time auth state

6. Create src/hooks/use-subscription.ts:
   - Returns { isPro, tier, subscription } based on profiles.subscription_tier
   - Used throughout to gate Pro features

7. Add auth UI to Header.tsx:
   - Not logged in: "Sign Up Free" button + "Log In" link
   - Logged in: Avatar dropdown with Dashboard, Settings, Sign Out
   - Pro users: gold "PRO" badge next to avatar

Configure Supabase Auth settings:
- Enable magic link (email OTP)
- Configure OAuth providers: we'll set up Oura/Fitbit/WHOOP as custom OAuth providers
- Redirect URLs: https://sleepcyclecalc.com/auth/callback
```

---

## PHASE 5: STRIPE + PRO TIER

### Prompt 5.1 — 🔑 Stripe Subscription Integration

```
Read CLAUDE.md monetization model. Implement Stripe subscriptions:

1. Create src/lib/stripe/config.ts:
   - Stripe product/price configuration
   - Pro Monthly: $5.99/mo
   - Pro Yearly: $49.99/yr (save 30%)
   - Feature list per tier

2. Create src/lib/stripe/client.ts:
   - Server-side Stripe client
   - createCheckoutSession(userId, priceId): returns checkout URL
   - createPortalSession(customerId): returns Stripe portal URL
   - Helper functions for subscription management

3. Create src/app/api/webhooks/stripe/route.ts:
   - Handles Stripe webhook events:
     - checkout.session.completed → create subscription record, update profile tier to 'pro'
     - customer.subscription.updated → update subscription status
     - customer.subscription.deleted → set tier back to 'free'
     - invoice.payment_failed → update status to 'past_due'
   - Verify webhook signature
   - Update Supabase using service role key

4. Create src/components/marketing/PricingTable.tsx:
   - Beautiful pricing comparison: Free vs Pro
   - Feature checkmarks per CLAUDE.md tier breakdown
   - Monthly/Yearly toggle
   - "Start Free" and "Go Pro" CTAs
   - Pro card has gold gradient border
   - "Most Popular" badge on yearly plan

5. Create src/app/(marketing)/pricing/page.tsx:
   - Full pricing page with PricingTable
   - FAQ about billing
   - "Start with Free — upgrade anytime"

6. Create src/app/(dashboard)/dashboard/settings/page.tsx:
   - Account settings
   - Current plan display
   - "Upgrade to Pro" or "Manage Subscription" (Stripe portal link)
   - Connected devices list
   - Data export option
   - Delete account option

7. Create a useSubscription gate pattern:
   - Component: <ProGate fallback={<UpgradePrompt />}>{children}</ProGate>
   - Shows upgrade prompt with feature preview for free users
   - Renders children for Pro users
```

---

## PHASE 6: WEARABLE INTEGRATIONS

### Prompt 6.1 — 🔑 OAuth + Sync Infrastructure

```
Read CLAUDE.md and INTEGRATIONS.md. Build wearable OAuth and data sync:

1. Create src/lib/integrations/normalize.ts:
   - NormalizedSleepSession TypeScript interface (from INTEGRATIONS.md schema)
   - DeviceConnection type
   - Shared normalization utilities

2. Create src/app/api/devices/[provider]/connect/route.ts:
   - Generates OAuth URL for Oura, Fitbit, or WHOOP
   - Stores state in Supabase (or cookie)
   - Redirects to provider's OAuth page
   - FREE TIER: allow 1 device. PRO: unlimited.

3. Create src/app/api/devices/[provider]/callback/route.ts:
   - Receives OAuth callback
   - Exchanges code for tokens
   - Encrypts tokens, stores in device_connections table
   - Triggers initial sync (last 7 days free, 30 days pro)
   - Redirects to /dashboard/devices?connected=[provider]

4. Create src/app/api/sync/[provider]/route.ts:
   - Fetches latest sleep data from connected device
   - Calls provider-specific normalizer
   - Upserts into sleep_sessions table
   - Returns sync status

5. Create src/lib/crypto.ts:
   - encryptToken(token): encrypted string
   - decryptToken(encrypted): original token
   - Use AES-256-GCM with ENCRYPTION_KEY env var
```

### Prompt 6.2 — ⚡ Oura Ring Integration

```
Read INTEGRATIONS.md Oura section. Create src/lib/integrations/oura.ts:
- Oura API v2 client (base: https://api.ouraring.com/v2)
- fetchOuraSleep(accessToken, startDate, endDate): raw Oura response
- normalizeOuraSleep(ouraData): NormalizedSleepSession[]
- Map: sleep score, stages (deep/light/REM/awake), HRV, HR, respiratory rate, efficiency
- Handle token refresh (Oura tokens expire)
- Rate limit: 5,000 req/day
```

### Prompt 6.3 — ⚡ Fitbit Integration

```
Read INTEGRATIONS.md Fitbit section. Create src/lib/integrations/fitbit.ts:
- Fitbit Web API client (base: https://api.fitbit.com)
- Handle both "stages" and "classic" sleep data formats
- 8-hour token expiry — implement automatic refresh
- Rate limit: 150 req/hour
- Map 30-second granularity stage data to our hypnogram format
```

### Prompt 6.4 — ⚡ WHOOP Integration

```
Read INTEGRATIONS.md WHOOP section. Create src/lib/integrations/whoop.ts:
- WHOOP API v2 client
- Map: sleep score, stages (light/SWS→deep/REM/awake), recovery score, sleep need
- Include recovery score (unique to WHOOP)
- Convert all durations from milliseconds to minutes
```

### Prompt 6.5 — ⚡ Apple Health XML Import

```
Read INTEGRATIONS.md Apple Health section. Build client-side parser:

1. Create src/lib/integrations/apple-health.ts:
   - parseAppleHealthExport(file: File): Promise<NormalizedSleepSession[]>
   - Uses JSZip to extract XML from ZIP
   - Streams XML parsing via Web Worker (files can be 500MB+)
   - Filters HKCategoryTypeIdentifierSleepAnalysis records
   - Maps value codes: 3=Core/Light, 4=Deep, 5=REM, 2=Awake
   - Groups consecutive records into sleep sessions

2. Create src/components/dashboard/AppleHealthImport.tsx ('use client'):
   - Dropzone for ZIP file upload
   - Progress bar during parsing
   - Privacy badge: "Processed in your browser — never uploaded"
   - Preview of parsed sessions before saving
   - "Save to Dashboard" button (stores in Supabase)
   - FREE: 1 import. PRO: unlimited.

3. Create a Web Worker (src/workers/apple-health.worker.ts) for non-blocking parsing
```

---

## PHASE 7: DASHBOARD + AI

### Prompt 7.1 — 🔑 Sleep Dashboard

```
Read CLAUDE.md and INTEGRATIONS.md. Build the main dashboard:

1. Create src/app/(dashboard)/layout.tsx:
   - Server Component
   - Auth check (redirect if not logged in)
   - DashboardSidebar + main content area
   - No ads for Pro users, AdSlot for free users

2. Create src/components/layout/DashboardSidebar.tsx:
   - Nav: Overview, History, Trends, AI Coach, Devices, Import, Settings
   - Current plan badge (Free/Pro)
   - "Upgrade to Pro" CTA for free users

3. Create src/app/(dashboard)/dashboard/page.tsx:
   - Fetch user's latest sleep data (Server Component)
   - Pass to client components for interactivity
   - Sections:
     a. LastNight.tsx — score ring, hypnogram, stage breakdown, biometrics
     b. VsCalculator.tsx — real sleep vs calculator recommendation, sleep debt
     c. TrendCharts.tsx — 7/30/90-day Recharts line charts (duration, efficiency, deep%)
     d. AICoach.tsx — personalized coaching (3/week free, unlimited Pro)
     e. PersonalCycles.tsx — 🔒 PRO ONLY — real cycle length analysis
     f. ConnectedDevices.tsx — quick sync status

4. Create src/components/dashboard/SleepScoreRing.tsx:
   - Circular progress ring showing sleep score (0-100)
   - Color gradient: red→yellow→green based on score
   - Animated fill on load

5. Create src/components/dashboard/Hypnogram.tsx:
   - Recharts area chart showing real sleep stage data
   - X: time, Y: stage depth
   - Color-coded: Light=primary-light, Deep=primary, REM=accent, Awake=warning
```

### Prompt 7.2 — 🔑 AI Sleep Coach

```
Read INTEGRATIONS.md AI section. Build the AI coaching system:

1. Create src/lib/ai/openrouter.ts:
   - OpenRouter API client
   - callOpenRouter(model, messages, maxTokens): Promise<string>
   - Model priority: free (llama-3.3-70b:free) → cheap (deepseek-chat) → fallback error
   - Rate limiting and cost tracking

2. Create src/lib/ai/prompts.ts:
   - SLEEP_COACH_SYSTEM: sleep science expert prompt
   - buildCoachPrompt(sleepData, userProfile): user message with actual data
   - SCORE_EXPLAINER: explain why a sleep score is what it is
   - WEEKLY_DIGEST: generate weekly summary

3. Create src/app/api/ai/coach/route.ts:
   - Requires auth
   - Rate limit: 3/week free, unlimited Pro
   - Fetches user's last 7 days of sleep data
   - Calculates aggregates
   - Calls OpenRouter with personalized prompt
   - Caches response for 24 hours (same data = same response)
   - Returns streaming response using Vercel AI SDK

4. Create src/components/dashboard/AICoach.tsx ('use client'):
   - "Get Sleep Advice" button
   - Streaming text display (typewriter effect) using useChat from Vercel AI SDK
   - Shows the AI-generated coaching text
   - "Refresh" button (respects rate limit)
   - Usage counter: "2 of 3 free coaching sessions this week"
   - ProGate: "Upgrade for unlimited coaching"
   - Disclaimer: "AI-generated insights. Not medical advice."
```

### Prompt 7.3 — Personal Sleep Cycle Calibration (Pro Feature)

```
Read INTEGRATIONS.md and CLAUDE.md. Build the killer Pro feature:

1. Update src/utils/personal-cycles.ts:
   - analyzePersonalCycles(sessions): PersonalCycleProfile
   - Requires 14+ nights with hypnogram data
   - Algorithm: identify cycle boundaries from stage transitions, calculate mean cycle duration
   - Returns: avgCycleDuration, cycleByPosition[], personalBedtimes, personalWakeTimes

2. Create src/components/dashboard/PersonalCycles.tsx ('use client'):
   - 🔒 Pro-gated with ProGate component
   - Shows: "Your cycles average 94 min (vs 90 min standard)"
   - Visual comparison chart: your cycles vs population average
   - Personalized bedtime/wake recommendations using YOUR cycle length
   - Confidence indicator based on data volume
   - "This is what makes our calculator more accurate than any other"

3. Update homepage BedtimeCalculator.tsx:
   - If user is logged in + Pro + has personal cycle data:
     - Toggle: "Standard (90 min)" vs "Personal (YOUR cycles)"
     - Personal mode uses their actual cycle length
     - Subtle "PRO" badge on the toggle
   - If logged in + Free: show locked personal toggle with upgrade CTA
```

---

## PHASE 8: CONTENT + BLOG + STATISTICS

### Prompt 8.1 — Blog Infrastructure

```
Set up MDX blog system:

1. Configure next-mdx-remote for MDX blog posts in src/content/blog/
2. Create src/app/(marketing)/blog/page.tsx — listing with category filter
3. Create src/app/(marketing)/blog/[slug]/page.tsx — dynamic blog post page
4. Create 3 initial posts (2,500 words each):
   a. how-to-fix-sleep-schedule.mdx — targets "how to fix sleep schedule"
   b. why-do-i-wake-up-tired.mdx — targets "why do I wake up tired"
   c. how-much-deep-sleep-do-you-need.mdx — targets "how much deep sleep"
Each post: FAQ section, embedded calculator CTA, author box, schema markup.
```

### Prompt 8.2 — Sleep Statistics Page (Link Magnet)

```
Build src/app/(marketing)/statistics/page.tsx:
- "100+ Sleep Statistics for 2026"
- Table of contents, 10 sections with Recharts visualizations
- 4,000-6,000 words, every stat with citation
- Embeddable charts (with attribution link)
- Schema: Article + Dataset
- This is the #1 backlink target. Make it the best sleep statistics page on the internet.
```

---

## PHASE 9: DEPLOYMENT + FINAL

### Prompt 9.1 — Dynamic Sitemap + Technical SEO

```
1. Create src/app/sitemap.ts:
   - Dynamic sitemap including all pages: marketing, calculators, programmatic, blog, dashboard
   - Proper changefreq and priority per page type
   - Include all 200+ programmatic pages

2. Create public/robots.txt
3. Create public/ads.txt (AdSense placeholder)
4. Verify: every page has unique title, description, canonical, OG image, schema
5. Run: npm run build — fix any errors
6. Lighthouse audit: target 90+ on all categories for marketing pages
```

### Prompt 9.2 — Vercel Deployment

```
1. Configure vercel.json if needed (cron jobs, headers, redirects)
2. Set all environment variables in Vercel dashboard
3. Configure: Vercel Analytics, Speed Insights
4. Deploy: vercel --prod
5. Post-deploy: verify sitemap, robots.txt, ads.txt accessible
6. Submit sitemap to Google Search Console and Bing Webmaster Tools
```

---

## LAUNCH CHECKLIST

- [ ] All calculators work on mobile + desktop
- [ ] Every page: unique title, description, canonical, OG, schema
- [ ] Sitemap includes all pages, accessible at /sitemap.xml
- [ ] Auth flow works: magic link + social (Oura/Fitbit/WHOOP)
- [ ] Free tier limits enforced (1 device, 7-day history, 3 AI/week)
- [ ] Pro tier unlocks all features
- [ ] Stripe checkout + webhook working
- [ ] Oura/Fitbit/WHOOP OAuth + sync working
- [ ] Apple Health import working (client-side parse)
- [ ] Dashboard renders real device data
- [ ] AI Coach returns personalized responses
- [ ] Ads display for free users, hidden for Pro
- [ ] Lighthouse: Performance 90+, SEO 95+, Accessibility 95+
- [ ] CLS < 0.1 with ads loaded
- [ ] Privacy policy, terms, medical disclaimer complete
- [ ] RLS policies tested (users can only see own data)
- [ ] Mobile navigation works
- [ ] 404 page looks good
- [ ] Google Search Console verified, sitemap submitted
