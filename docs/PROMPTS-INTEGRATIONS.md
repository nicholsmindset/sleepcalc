# PROMPTS-INTEGRATIONS.md — Build Prompts for Wearable APIs + AI Features

> Run these AFTER Phase 2 of the main PROMPTS.md (core calculators must exist first)
> These integrate into the existing project structure from CLAUDE.md

---

## PHASE 8: USER ACCOUNTS & AUTH

### Prompt 8.1 — 🔑 User Account System with Magic Link Auth

```
Read CLAUDE.md and INTEGRATIONS.md. Set up the user account system:

1. Create a Cloudflare D1 database schema (src/db/schema.sql):
   - users table: id (uuid), email, created_at, last_login, preferences (JSON)
   - device_connections table: id, user_id (FK), provider ('oura'|'fitbit'|'whoop'|'withings'), access_token (encrypted), refresh_token (encrypted), scopes, connected_at, last_sync_at, expires_at
   - sleep_sessions table: id, user_id (FK), source, source_session_id, bedtime_start, bedtime_end, sleep_onset, wake_time, total_duration_min, sleep_latency_min, deep_min, light_min, rem_min, awake_min, efficiency, sleep_score, hrv, resting_hr, respiratory_rate, spo2, is_nap, raw_hypnogram (JSON), created_at
   - ai_insights table: id, user_id (FK), type ('coach'|'weekly'|'anomaly'), content, generated_at

2. Create Cloudflare Worker API routes (functions/api/):
   - POST /api/auth/magic-link — sends magic link email via Resend.com
   - GET /api/auth/verify?token=xxx — verifies magic link token, sets JWT cookie
   - GET /api/auth/me — returns current user from JWT
   - POST /api/auth/logout — clears JWT cookie

3. Create the auth flow UI components:
   - src/components/auth/LoginModal.tsx (Preact) — email input, "Send Magic Link" button
   - src/components/auth/AuthGuard.tsx (Preact) — wraps protected content, shows login if not authenticated
   - Auth state management using Preact signals or simple context

4. Create a JWT utility (src/utils/jwt.ts):
   - Sign/verify JWTs using Cloudflare Workers crypto
   - 30-day expiry, refresh on activity
   - Store user_id and email in JWT payload

5. Add "Connect Your Device" CTA to calculator result pages:
   - After showing calculated results: "Want to see how your ACTUAL sleep compares? Connect your sleep tracker →"
   - Links to /dashboard (requires auth)

Use Resend.com for transactional emails (free tier: 100 emails/day, 3,000/month).
Store magic link tokens in Cloudflare KV with 15-minute TTL.
```

---

## PHASE 9: WEARABLE API INTEGRATIONS

### Prompt 9.1 — 🔑 OAuth Flow Infrastructure

```
Read CLAUDE.md and INTEGRATIONS.md. Build the shared OAuth2 infrastructure:

1. Create src/utils/oauth.ts:
   - Generic OAuth2 flow handler that works for all providers
   - generateAuthUrl(provider, scopes, state): string
   - exchangeCode(provider, code): { accessToken, refreshToken, expiresAt }
   - refreshAccessToken(provider, refreshToken): { accessToken, expiresAt }
   - Provider configs stored in a providers map with: authUrl, tokenUrl, clientId, clientSecret, scopes, redirectUri

2. Create Cloudflare Worker: functions/api/auth/[provider]/connect.ts
   - Generates OAuth URL for the provider
   - Stores state token in KV
   - Redirects user to provider's auth page

3. Create Cloudflare Worker: functions/api/auth/[provider]/callback.ts
   - Receives OAuth callback
   - Exchanges code for tokens
   - Encrypts and stores tokens in D1 device_connections table
   - Triggers initial data sync
   - Redirects to /dashboard?connected=[provider]

4. Create Cloudflare Worker: functions/api/sync/sleep.ts
   - Fetches latest sleep data from connected device(s)
   - Normalizes to NormalizedSleepSession schema from INTEGRATIONS.md
   - Stores in D1 sleep_sessions table
   - Returns normalized data

5. Create encryption utilities (src/utils/crypto.ts):
   - encryptToken(token): string — AES-256-GCM encryption using Workers crypto
   - decryptToken(encrypted): string
   - Encryption key from environment variable

6. Create src/components/auth/DeviceConnector.tsx (Preact):
   - Grid of device cards: Oura, Fitbit, WHOOP
   - Each shows: device logo, "Connect" button (or "Connected ✓" with last sync time)
   - "Disconnect" option for connected devices

Environment variables needed (in wrangler.toml):
- OURA_CLIENT_ID, OURA_CLIENT_SECRET
- FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET
- WHOOP_CLIENT_ID, WHOOP_CLIENT_SECRET
- ENCRYPTION_KEY
- JWT_SECRET
- RESEND_API_KEY
```

### Prompt 9.2 — Oura Ring Integration

```
Read INTEGRATIONS.md. Build the Oura Ring API v2 integration:

1. Create src/integrations/oura.ts:
   - Oura API v2 base URL: https://api.ouraring.com/v2
   - Endpoints to implement:
     - GET /usercollection/daily_sleep?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
     - GET /usercollection/sleep?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD (detailed sleep data with stages)
     - GET /usercollection/personal_info (to verify connection)
   - normalizeOuraSleep(ouraData): NormalizedSleepSession[] — map Oura's response to our schema:
     - Oura's sleep.contributors.deep_sleep → stages.deep
     - Oura's sleep.contributors.rem_sleep → stages.rem
     - Oura's sleep.contributors.efficiency → sleepEfficiency
     - Oura's sleep.total_sleep_duration → totalSleepDuration (convert seconds to minutes)
     - Map Oura's hypnogram data to our hypnogram format
     - Extract HRV, heart rate, respiratory rate from Oura's readiness data

2. Oura OAuth2 config:
   - Auth URL: https://cloud.ouraring.com/oauth/authorize
   - Token URL: https://api.ouraring.com/oauth/token
   - Scopes: daily, sleep, personal
   - Redirect URI: https://sleepcyclecalc.com/api/auth/oura/callback

3. Create functions/api/sync/oura.ts:
   - Called after OAuth callback and on subsequent syncs
   - Fetches last 30 days of data on initial sync
   - Fetches last 7 days on subsequent syncs
   - Handles token refresh if expired
   - Rate limit awareness: 5,000 requests/day

Test with mock data if no Oura account available. Include error handling for users without active Oura Membership (API returns 403 for Gen3/Ring4 without membership).
```

### Prompt 9.3 — Fitbit Integration

```
Read INTEGRATIONS.md. Build the Fitbit/Google Web API integration:

1. Create src/integrations/fitbit.ts:
   - Fitbit API base URL: https://api.fitbit.com
   - Endpoints:
     - GET /1.2/user/-/sleep/date/{start}/{end}.json (sleep logs with stages)
     - GET /1/user/-/profile.json (verify connection)
   - normalizeFitbitSleep(fitbitData): NormalizedSleepSession[]
     - Fitbit provides "stages" type (30-sec granularity with deep/light/REM/wake) or "classic" type (60-sec with asleep/restless/awake)
     - Handle both formats
     - Map Fitbit's sleep.levels.data array to our hypnogram format
     - Extract: duration, efficiency, minutesAsleep, minutesAwake, timeInBed
     - Map stages summary: deep, light, rem, wake minutes

2. Fitbit OAuth2 config:
   - Auth URL: https://www.fitbit.com/oauth2/authorize
   - Token URL: https://api.fitbit.com/oauth2/token
   - Scopes: sleep, profile
   - Use Authorization Code Grant with PKCE
   - Access token expires in 8 hours, refresh token valid long-term

3. Create functions/api/sync/fitbit.ts:
   - Rate limit: 150 requests/hour per user
   - Batch date range requests efficiently
   - Handle both stages and classic sleep data formats
   - Token refresh logic (8-hour expiry is short!)

Fitbit has the best-documented API. Use their Web API Explorer for testing: https://dev.fitbit.com/build/reference/web-api/explore/
```

### Prompt 9.4 — WHOOP Integration

```
Read INTEGRATIONS.md. Build the WHOOP API v2 integration:

1. Create src/integrations/whoop.ts:
   - WHOOP API v2 base URL: https://api.prod.whoop.com/developer/v2
   - Endpoints:
     - GET /activity/sleep (paginated, sorted by start time desc)
     - GET /activity/sleep/{sleepId} (single sleep detail)
     - GET /recovery (recovery scores linked to sleep)
     - GET /user/profile/basic (verify connection)
   - normalizeWhoopSleep(whoopData): NormalizedSleepSession[]
     - WHOOP provides: score.stage_summary (total_in_bed_time_milli, total_awake_time_milli, total_no_data_time_milli, total_light_sleep_time_milli, total_slow_wave_sleep_time_milli, total_rem_sleep_time_milli)
     - Convert milliseconds to minutes
     - Map slow_wave_sleep → deep
     - Extract sleep_needed from score.sleep_needed
     - Link recovery score from /recovery endpoint

2. WHOOP OAuth2 config:
   - Auth URL: https://api.prod.whoop.com/oauth/oauth2/auth
   - Token URL: https://api.prod.whoop.com/oauth/oauth2/token
   - Scopes: read:sleep, read:recovery, read:profile
   - Standard OAuth2 Authorization Code flow

3. WHOOP-specific features:
   - Recovery score integration (unique to WHOOP)
   - Sleep need prediction (WHOOP calculates personalized sleep need)
   - Nap detection
```

### Prompt 9.5 — ⚡ Apple Health XML Upload Parser

```
Read INTEGRATIONS.md. Build the client-side Apple Health XML parser:

1. Create src/components/integrations/AppleHealthUpload.tsx (Preact):
   - File upload dropzone (accepts .zip files)
   - Progress indicator for parsing (can take 30+ seconds for large exports)
   - Privacy badge: "Your data never leaves your browser"
   - Instructions with screenshots: how to export from iPhone Health app

2. Create src/utils/appleHealthParser.ts:
   - Use JSZip to extract the XML from the uploaded ZIP
   - Use a SAX-style streaming parser (the XML can be 500MB+)
   - Filter for records where type = "HKCategoryTypeIdentifierSleepAnalysis"
   - Value mapping: 0=InBed, 1=AsleepUnspecified, 2=Awake, 3=Core(Light), 4=Deep, 5=REM
   - Group records by sleep session (consecutive records within same night)
   - Calculate: total duration, time in each stage, efficiency, latency
   - normalizeAppleHealthSleep(records): NormalizedSleepSession[]
   - Run parsing in a Web Worker to prevent UI freezing

3. Create src/workers/apple-health-worker.ts:
   - Web Worker that receives the ZIP file
   - Parses and normalizes data
   - Posts results back to main thread
   - Progress reporting via postMessage

4. After parsing, show results in the same dashboard format
   - Offer to "save" data to their account (stores normalized data in D1)
   - Or just display one-time analysis without account

This is a huge differentiator: no other sleep calculator site offers this.
Make the UX smooth with clear instructions and a beautiful progress animation.
```

---

## PHASE 10: SLEEP DASHBOARD

### Prompt 10.1 — 🔑 User Sleep Dashboard Page

```
Read CLAUDE.md and INTEGRATIONS.md. Build the user sleep dashboard at src/pages/dashboard.astro:

This is the sticky, returning-user feature. Create:

1. src/pages/dashboard.astro:
   - Protected page (requires auth)
   - Uses BaseLayout with dashboard-specific styles
   - Title: "My Sleep Dashboard"

2. src/components/dashboard/DashboardView.tsx (Preact, client:load):
   - Fetches user's sleep data from /api/user/dashboard
   - State: loading, error, data views

3. Dashboard sections (all Preact components):

   a. src/components/dashboard/LastNight.tsx:
      - Large sleep score badge (color-coded)
      - Real hypnogram chart from device data (reuse SleepCycleChart but with REAL data)
      - Duration, efficiency, latency stats
      - Sleep stage breakdown (deep, light, REM, awake) with bars
      - Biometrics: HR, HRV, respiratory rate, SpO2 (if available)

   b. src/components/dashboard/VsCalculator.tsx:
      - "Calculator Recommended: 7h 30m | You Slept: 7h 12m"
      - Visual comparison bar
      - Sleep debt accumulator
      - "Your actual cycle length: 94 min (based on 30 nights of data)"
      - Personalized wake time recommendations based on REAL cycle data

   c. src/components/dashboard/TrendCharts.tsx:
      - 7-day, 30-day, 90-day toggleable views
      - Line charts: duration, efficiency, deep sleep %, sleep score
      - Use Chart.js or lightweight charting

   d. src/components/dashboard/AICoach.tsx:
      - Calls /api/ai/coach endpoint
      - Displays personalized recommendations
      - "Refresh" button to get new insights
      - Typing animation for AI response
      - Disclaimer: "AI-generated. Not medical advice."

   e. src/components/dashboard/ConnectedDevices.tsx:
      - Shows connected devices with last sync time
      - "Sync Now" button
      - "Add Device" button → DeviceConnector

   f. src/components/dashboard/PersonalCycles.tsx:
      - THE KILLER FEATURE
      - Analyzes user's actual sleep stage data to calculate their PERSONAL average cycle length
      - Shows: "Your cycles average 94 minutes (population average: 90)"
      - Generates PERSONALIZED bedtime/wake recommendations using their real cycle length
      - This is what makes our calculator better than every competitor

4. Mobile responsive: single-column stack on mobile, 2-column grid on desktop
5. Ad slots: 1 in sidebar (desktop), 1 after trends section
```

---

## PHASE 11: AI FEATURES

### Prompt 11.1 — 🔑 AI Sleep Coach Backend

```
Read INTEGRATIONS.md for AI architecture. Build the AI sleep coaching system:

1. Create functions/api/ai/coach.ts (Cloudflare Worker):
   - Requires authenticated user with at least 3 nights of sleep data
   - Fetches user's last 7 days of sleep data from D1
   - Calculates aggregates: avg duration, avg efficiency, avg stages, sleep debt, consistency
   - Constructs prompt with user's actual data
   - Calls OpenRouter API:
     - Model: "meta-llama/llama-3.3-70b-instruct:free" (free tier)
     - Fallback: "deepseek/deepseek-chat" (cheap paid)
     - System prompt: sleep science expert, concise (under 200 words), reference actual numbers, never give medical advice
   - Caches response in KV for 24 hours (don't regenerate for every page load)
   - Returns AI response as JSON

2. Create functions/api/ai/insights.ts:
   - Weekly insights generation (triggered by cron or on-demand)
   - Analyzes 7-day trends vs. previous 7 days
   - Generates: "Your deep sleep improved 15% this week. Your bedtime consistency is excellent."
   - Stores in ai_insights table

3. OpenRouter integration utility (src/utils/openrouter.ts):
   - callOpenRouter(model, messages, maxTokens): Promise<string>
   - Automatic fallback: free model → cheap paid → error
   - Rate limit handling
   - Response caching
   - Cost tracking (log tokens used)

4. Environment variables:
   - OPENROUTER_API_KEY (free account key)

Rate limit the AI coach to 3 requests per user per day on free tier.
Cache aggressively — same data = same coaching response for 24 hours.
```

### Prompt 11.2 — Cloudflare Workers AI Features

```
Read INTEGRATIONS.md. Implement edge AI features using Cloudflare Workers AI:

1. Create functions/api/ai/chronotype-detect.ts:
   - Analyzes user's sleep timing patterns over 30+ days
   - Uses @cf/meta/llama-3.1-8b-instruct to classify chronotype
   - Input: array of bedtimes and wake times
   - Output: Lion/Bear/Wolf/Dolphin classification with confidence score
   - Much more accurate than a quiz because it uses real behavioral data

2. Create functions/api/ai/anomaly-detect.ts:
   - Runs nightly (or on sync) to detect unusual patterns
   - Checks for: sudden sleep duration drops, efficiency crashes, unusual latency spikes
   - Uses simple statistical detection (2+ standard deviations from 30-day mean)
   - If anomaly detected, generate a brief AI explanation
   - Store as ai_insight with type='anomaly'

3. Create functions/api/ai/sleep-score-explain.ts:
   - Takes a single night's sleep data
   - Generates a plain-English explanation of the score
   - "Your score was 72/100. Deep sleep was above average (great!), but you woke up 4 times, which hurt your efficiency."
   - Uses Cloudflare Workers AI for inference at the edge (no external API call)

All Cloudflare Workers AI calls use env.AI.run() — runs at edge, included in Workers free/paid plan.
Free tier: 10,000 neurons/day (sufficient for ~500-1,000 inferences).
```

### Prompt 11.3 — ⚡ Weekly Digest Email

```
Read INTEGRATIONS.md. Build the AI-powered weekly sleep digest email:

1. Create functions/api/email/weekly-digest.ts:
   - Triggered weekly via Cloudflare Cron Trigger (free)
   - For each user with connected device + email:
     - Fetch last 7 days of sleep data
     - Generate AI summary via OpenRouter (DeepSeek: ~$0.0003 per email)
     - Format as HTML email
     - Send via Resend.com API

2. Email template (src/templates/weekly-digest.html):
   - Clean, mobile-responsive HTML email
   - Sections:
     - "Your Week in Sleep" header with overall score
     - Key metrics: avg duration, avg score, sleep debt change
     - Mini trend chart (as embedded image or CSS bars)
     - AI insight paragraph (personalized)
     - "Your best night was [day] — here's why..."
     - CTA: "View Full Dashboard →" linking to /dashboard
     - CTA: "Improve Your Sleep →" linking to relevant calculator/blog post
   - Unsubscribe link

3. User preferences:
   - Enable/disable weekly digest
   - Preferred day/time for delivery
   - Store in user preferences JSON column

This email is the #1 retention driver. It brings users back weekly to the site (more ad impressions, more affiliate exposure) without them having to remember to visit.
```

---

## PHASE 12: PERSONAL SLEEP CYCLE CALIBRATION (The Killer Feature)

### Prompt 12.1 — 🔑 Personal Cycle Length Calculator

```
Read INTEGRATIONS.md. Build the personal sleep cycle calibration feature — this is the #1 differentiator:

1. Create src/utils/personalCycles.ts:
   - analyzePersonalCycles(sessions: NormalizedSleepSession[]): PersonalCycleProfile
   - Requires minimum 14 nights of data with hypnogram/stage transitions
   - Algorithm:
     a. For each night with stage data, identify cycle boundaries
        (a cycle = light → deep → REM → light/awake transition)
     b. Calculate duration of each individual cycle
     c. Note: first cycle is typically shorter, later cycles longer
     d. Calculate mean cycle duration, std deviation
     e. Calculate cycle-by-cycle averages (1st cycle avg, 2nd cycle avg, etc.)
   - PersonalCycleProfile type:
     - avgCycleDuration: number (minutes, typically 80-110)
     - cycleStdDev: number
     - cycleByPosition: number[] (avg duration by cycle position)
     - optimalCycles: number (based on their age + data)
     - personalBedtimes: Date[] (calculated using THEIR cycle length, not 90 min)
     - personalWakeTimes: Date[]
     - dataQuality: 'low' | 'medium' | 'high' (based on nights of data)
     - nightsAnalyzed: number

2. Update the homepage BedtimeCalculator:
   - If user is logged in AND has personal cycle data:
     - Show a toggle: "Standard (90 min cycles)" vs "Personal (YOUR cycles)"
     - Personal mode uses their actual cycle length
     - Display: "Based on your 30 nights of data, your cycles average 94 min"
     - Results will differ from the generic calculator = huge value add

3. Create src/components/dashboard/PersonalCycles.tsx:
   - Visualization showing their cycle pattern vs. population average
   - Cycle-by-cycle breakdown chart
   - "Your optimal sleep duration: 7h 50m (5 cycles × 94 min)"
   - Confidence indicator based on data volume
   - "Add more nights to improve accuracy" prompt if < 30 nights

4. Update programmatic pages to show a teaser:
   - On "wake up at 5am" page: "These times use standard 90-min cycles. Connect your sleep tracker to get times personalized to YOUR cycle length."

This is the feature that makes users say "I can't get this anywhere else" and keeps them coming back.
```

---

## UTILITY PROMPTS

### Prompt U.5 — Add a New Wearable Integration

```
Read INTEGRATIONS.md. I want to add [PROVIDER] integration.

Create:
1. src/integrations/[provider].ts with API client and normalizer
2. OAuth config in the provider configs
3. functions/api/auth/[provider]/connect.ts and callback.ts
4. functions/api/sync/[provider].ts
5. Add to DeviceConnector component
6. Test with mock data

Follow the same patterns as existing integrations (Oura, Fitbit, WHOOP).
Normalize all data to NormalizedSleepSession schema.
```

### Prompt U.6 — Add a New AI Feature

```
Read INTEGRATIONS.md. I want to add an AI feature: [DESCRIPTION]

Create:
1. Cloudflare Worker endpoint at functions/api/ai/[feature].ts
2. Use OpenRouter (free model first) or Cloudflare Workers AI (edge)
3. Cache results appropriately (KV with TTL)
4. Rate limit per user
5. Add to dashboard or relevant page
6. Include "AI-generated, not medical advice" disclaimer
```
