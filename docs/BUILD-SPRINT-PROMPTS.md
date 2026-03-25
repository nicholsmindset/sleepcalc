# SLEEP STACK — BUILD SPRINT PROMPTS
# Copy each prompt into Claude Code sequentially.
# No wearables. No auth. No user data storage.
# Pure tools, content, API integrations, and SEO pages.

================================================================
PROMPT 1 — PROGRAMMATIC SEO: TIME-BASED PAGES (Highest Priority)
================================================================

Read the existing codebase to understand the project structure, framework, and patterns used. Then build programmatic SEO pages for time-based sleep calculations.

Create a data file (or update existing) at src/content/data/sleep-times.json with entries for BOTH wake-up times and bedtimes:

WAKE-UP TIMES: Every 30 minutes from 4:00 AM to 10:00 AM (13 entries)
BEDTIMES: Every 30 minutes from 8:00 PM to 2:00 AM (13 entries)

Each entry needs:
- slug (e.g., "wake-up-at-5am", "go-to-bed-at-10pm")
- title (e.g., "What Time Should I Go to Sleep If I Wake Up at 5 AM?")
- h1
- metaDescription (unique, 140-155 chars, includes the time)
- time value
- preCalculatedResults: array of bedtime/wake options for 3, 4, 5, 6 cycles using 90-min cycles + 15-min fall-asleep buffer
- 3 unique FAQ items per page (different from other pages)

Create dynamic routes:
- src/app/(marketing)/sleep-time/[slug]/page.tsx — wake-up time pages
- src/app/(marketing)/bedtime/[slug]/page.tsx — bedtime pages

Each page must:
- Use generateStaticParams() to pre-build all pages at build time
- Use generateMetadata() for unique title/description per page
- Show a pre-filled version of the sleep calculator with the time already set
- Display a quick-reference results table showing all cycle options
- Have 800-1,200 words of UNIQUE contextual content (not just the time swapped into a template — write genuinely different content about who wakes at this time, what routines work, etc.)
- Include the 3 unique FAQ items with accordion
- Include prev/next navigation links ("← Wake Up at 4:30 AM" / "Wake Up at 5:30 AM →")
- Include breadcrumbs with schema
- Include WebApplication JSON-LD schema
- Include links to related calculators
- Include MedicalDisclaimer component
- Include an AdSlot component between results and content

Follow the exact same design system, component patterns, and styling used on the existing calculator pages. Total output: ~26 new static pages.


================================================================
PROMPT 2 — PROGRAMMATIC SEO: AGE-BASED PAGES
================================================================

Read the existing codebase. Build age-based programmatic SEO pages targeting "how much sleep does a [X] year old need" queries.

Create src/content/data/age-recommendations.json with entries for these age groups:
- Newborn (0-3 months): 14-17 hours
- Infant (4-11 months): 12-15 hours
- Toddler (1-2 years): 11-14 hours
- Preschool (3-5 years): 10-13 hours
- Individual years 6 through 17 (12 entries): 8-11 hours scaling down
- Young Adult (18-25): 7-9 hours
- Adult (26-35): 7-9 hours
- Adult (36-45): 7-9 hours
- Middle Age (46-55): 7-9 hours
- Older Adult (56-64): 7-9 hours
- Senior (65+): 7-8 hours

Each entry: slug, title, h1, metaDescription, ageRange, recommended {min, max, optimal}, unique content blocks (800-1,200 words per page), 3-5 unique FAQ items, sample sleep schedule for that age.

Create dynamic route: src/app/(marketing)/age/[slug]/page.tsx

Each page must:
- generateStaticParams() + generateMetadata()
- Show recommended sleep range prominently with a visual range bar
- For children (0-17): include sample daily schedule with nap times
- For adults: include the standard sleep calculator pre-filled
- 800-1,200 words of unique content about sleep at this life stage
- FAQ section with schema
- Links to adjacent age pages
- Breadcrumbs, schema, AdSlot, MedicalDisclaimer

Follow existing design system. Total: ~25 new pages.


================================================================
PROMPT 3 — PROGRAMMATIC SEO: PROFESSION-BASED PAGES
================================================================

Read the existing codebase. Build profession-based programmatic SEO pages targeting the most underserved keyword cluster in the sleep niche (KD 5-20).

Create src/content/data/professions.json with 20 entries:
nurse, doctor, truck driver, firefighter, police officer, pilot, military, factory worker, baker, barista, bartender, security guard, paramedic, warehouse worker, call center night shift, IT ops/sysadmin, new parent, college student, teacher, remote worker

Each entry: slug, title, h1, metaDescription, shiftType (day/evening/night/rotating), typicalSchedule, challenges (3-4 unique challenges for this profession), sleepStrategy (tailored advice), unique content (800-1,200 words), 3-5 unique FAQ items.

Create dynamic route: src/app/(marketing)/profession/[slug]/page.tsx

Each page must:
- generateStaticParams() + generateMetadata()
- Show the Shift Worker Calculator pre-configured for this profession's typical schedule
- Profession-specific challenges section
- Optimal sleep strategy tailored to their shift pattern
- Nap recommendations if night shift
- Caffeine management tips for this profession
- FAQ with schema
- Links to related professions and main shift worker calculator
- Breadcrumbs, schema, AdSlot, MedicalDisclaimer

Follow existing design system. Total: ~20 new pages.


================================================================
PROMPT 4 — TONIGHT'S SLEEP FORECAST (Free APIs, No Auth)
================================================================

Read the existing codebase. Build a "Tonight's Sleep Forecast" widget that shows personalized sleep environment data based on the user's location. This requires NO user account — it uses browser geolocation + free APIs.

APIs to integrate (all free, no API keys needed):
1. Open-Meteo Weather: https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&hourly=temperature_2m,relative_humidity_2m&timezone=auto&forecast_hours=24
2. SunriseSunset.io: https://api.sunrisesunset.io/json?lat={lat}&lng={lng}&date=today
3. Moon Phase: Calculate locally using the lunar age algorithm (days since known new moon, mod 29.53) — no API call needed, pure JS math

Create src/components/forecast/SleepForecast.tsx as a client component:

Step 1: Request browser geolocation (navigator.geolocation.getCurrentPosition)
- Show a "Check Tonight's Sleep Conditions" button
- On click, request location permission
- Show loading state while fetching

Step 2: Fetch data from all 3 sources in parallel (Promise.all)

Step 3: Calculate a "Sleep Environment Score" (0-100):
- Temperature score: 100 if 16-19°C, deduct points as it moves away (optimal bedroom temp)
- Humidity score: 100 if 40-60%, deduct outside range
- Combine into weighted average: temp 50%, humidity 30%, air quality placeholder 20%

Step 4: Display results in a beautiful card:
- Large score ring (reuse the circular score pattern from existing components)
- "Tonight's Forecast: 78/100"
- Temperature: "22°C — Slightly warm (ideal: 16-19°C). Consider lowering AC."
- Humidity: "65% — Slightly high (ideal: 40-60%)"
- Sunset: "7:23 PM — Start dimming lights by 6:23 PM"
- Moon: "Waxing Gibbous (73% illuminated)" with emoji
- Personalized tip based on conditions

Step 5: Add a "Refresh" button and show the user's city name (reverse geocode from coordinates using the timezone returned by Open-Meteo)

Place this component:
- On the homepage below the calculator results
- On the /calculators hub page
- Create a dedicated page at src/app/(marketing)/tonight/page.tsx with full content about how environment affects sleep (1,500 words), SEO optimized for "sleep forecast," "best temperature for sleep," "how weather affects sleep"

Include proper error handling for: geolocation denied, API failures, offline state.
Cache results in sessionStorage for 1 hour so we don't re-fetch on every page load.
The component should work with zero user accounts.


================================================================
PROMPT 5 — CIRCADIAN LIGHT GUIDE (Sunrise-Sunset API)
================================================================

Read the existing codebase. Build a "Circadian Light Schedule" tool — a personalized daily light exposure schedule based on the user's location and sunrise/sunset data.

API: SunriseSunset.io (already used in Prompt 4)
https://api.sunrisesunset.io/json?lat={lat}&lng={lng}&date=today

Create src/app/(marketing)/tools/circadian-guide/page.tsx:

The tool generates a personalized daily light schedule:
1. Request location (reuse geolocation logic from SleepForecast)
2. Fetch today's sunrise/sunset/dawn/dusk data
3. Generate a schedule:
   - "Morning Sunlight Window: [sunrise] to [sunrise + 30min]" — "Get 10-30 min of direct sunlight to suppress melatonin and set your circadian clock"
   - "Peak Alertness: [sunrise + 4h] to [sunrise + 8h]" — "Your cortisol peaks now. Best time for demanding work."
   - "Afternoon Dip: [solar_noon + 1h] to [solar_noon + 3h]" — "Energy naturally drops. If you nap, do it now (before 3 PM)."
   - "Start Dimming Lights: [sunset - 1h]" — "Lower overhead lights, switch to warm/dim lamps"
   - "Blue Light Cutoff: [sunset + 30min]" — "Put on blue light glasses or enable night mode"
   - "Melatonin Window: [sunset + 2h] to [sunset + 3h]" — "Your body starts producing melatonin. Ideal bedtime window."
   - "Optimal Bedtime: [calculated from the sleep calculator based on desired wake time]"

4. Display as a beautiful vertical timeline with time markers, icons, and color gradients (warm yellows for morning → deep purples for night)

5. Show a 24-hour circular visualization (like a clock face) with daylight/darkness arcs highlighted

Content: 1,500-2,000 words on the science of circadian rhythms, light exposure, and sleep quality. Include FAQ section (5 questions). Target keywords: "circadian rhythm schedule," "when to get morning sunlight," "light exposure and sleep."

Include: breadcrumbs, schema (WebApplication), AdSlot, MedicalDisclaimer, links to related tools.


================================================================
PROMPT 6 — JET LAG RECOVERY PLANNER (Timezone + Sunrise APIs)
================================================================

Read the existing codebase. Build a Jet Lag Recovery Planner tool.

APIs needed:
1. SunriseSunset.io (for sunrise/sunset at both origin and destination)
2. Browser's built-in Intl.DateTimeFormat for timezone detection
3. A hardcoded city-to-coordinates lookup (create a JSON file with 100 major cities: name, lat, lng, timezone, country)

Create src/content/data/cities.json with ~100 major world cities (all continents). Include: name, country, latitude, longitude, timezone (IANA format), utcOffset.

Create src/app/(marketing)/tools/jet-lag-calculator/page.tsx:

The tool:
1. Two city selectors: "Flying from" and "Flying to" (searchable dropdowns from cities.json)
2. "Departure date" date picker
3. Calculate:
   - Timezone difference in hours
   - Direction of travel (east = harder, west = easier)
   - Estimated recovery days (rule of thumb: ~1 day per hour of timezone shift eastward, ~0.67 days westward)
   - Sunrise/sunset at BOTH locations via SunriseSunset.io
4. Generate a day-by-day recovery plan:
   - Day 0 (travel day): "Sleep on the plane at [destination bedtime]. Avoid caffeine after [cutoff]."
   - Day 1: "Wake at [time]. Get sunlight between [sunrise] and [sunrise+30min] at destination. Shift bedtime [direction] by 1-2 hours."
   - Day 2-N: Progressive schedule adjustment
   - Each day: wake time, sunlight window, caffeine cutoff, recommended bedtime
5. Display as a visual day-by-day timeline card layout
6. Show both cities' sunrise/sunset side by side for comparison

Content: 2,000 words on jet lag science, circadian disruption, eastward vs westward travel, tips. FAQ (6 questions). Target keywords: "jet lag calculator," "jet lag recovery plan," "how long does jet lag last."

Internal links to: Circadian Light Guide, Caffeine Calculator, main Sleep Calculator.
Include: breadcrumbs, schema, AdSlot, MedicalDisclaimer.


================================================================
PROMPT 7 — SMART CAFFEINE UPGRADE (USDA FoodData Central API)
================================================================

Read the existing codebase and the current Caffeine Calculator page. Upgrade it with real food/drink data from the USDA FoodData Central API.

API: https://api.nal.usda.gov/fdc/v1/foods/search
- Get a free API key at: https://api.data.gov/signup/
- Search endpoint: POST https://api.nal.usda.gov/fdc/v1/foods/search?api_key=YOUR_KEY
- Body: {"query": "coffee", "dataType": ["Branded", "Survey (FNDDS)"], "pageSize": 10}
- Caffeine is nutrient ID 262 in the response nutrients array

Add to the existing Caffeine Calculator page:

1. Add a search input field ABOVE the preset drink buttons: "Search any food or drink..."
2. When user types 3+ characters, debounce (300ms) and call USDA API
3. Show search results as a dropdown: product name, brand, caffeine per serving
4. User clicks a result → it adds to their drink log with the exact caffeine amount from USDA data
5. Keep the existing preset buttons (espresso, coffee, etc.) as quick-add shortcuts
6. The decay curve chart and cutoff calculation remain the same — they just use the real caffeine values now

Implementation details:
- Create src/lib/usda.ts with searchFoods(query) function
- Filter results to only show items where caffeine (nutrient 262) is present and > 0
- Format results: name, brand, caffeine mg, serving size
- Add the USDA API key as NEXT_PUBLIC_USDA_API_KEY in .env.local (it's a public API, safe for client-side)
- Handle: loading state, no results, API errors, rate limiting
- Cache search results in memory (simple Map) to avoid repeat API calls for same query

Add a note below the search: "Caffeine data from USDA FoodData Central. 300,000+ foods and beverages."


================================================================
PROMPT 8 — MOON & SLEEP TRACKER PAGE
================================================================

Read the existing codebase. Build a Moon & Sleep information page with a live moon phase display.

Moon phase calculation — do this with PURE JavaScript math, no API needed:
- Known reference: New Moon on January 6, 2000 at 18:14 UTC
- Lunar cycle = 29.53058770576 days
- Calculate days since reference, mod by cycle length
- Map to phase name and illumination percentage

Create src/utils/moon.ts:
- getMoonPhase(date: Date): { phase: string, illumination: number, emoji: string, age: number, nextFull: Date, nextNew: Date }
- Phase names: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent
- Map to emojis: 🌑🌒🌓🌔🌕🌖🌗🌘

Create src/app/(marketing)/tools/moon-sleep/page.tsx:

1. Hero: Large animated moon visualization showing current phase
   - Use SVG or CSS to render a moon with the correct illumination
   - Show phase name, illumination %, days until next full moon
   - Auto-updates (recalculate on page load)

2. "Moon Calendar" section:
   - Show the current month with moon phase emoji for each day
   - Highlight full moon and new moon dates
   - Let user navigate to previous/next months

3. Content section (2,000 words):
   - "Does the Moon Affect Your Sleep?" — cover the 2013 University of Basel study (Current Biology) that found sleep duration decreased ~20 min and deep sleep decreased ~30% around full moons
   - Cover the 2021 University of Washington study showing people go to bed later and sleep less in the days leading up to a full moon
   - Present both the evidence FOR lunar effects and the skeptical counterpoints
   - Section on "Moon-Based Sleep Tips" (practical, not pseudoscience)
   - Section on "Full Moon Sleep Strategies"

4. FAQ section (6 questions):
   - Does the full moon affect sleep?
   - Why can't I sleep during a full moon?
   - How does moonlight affect melatonin?
   - Should I adjust my bedtime for moon phases?
   - Is lunar sleep science real or myth?
   - How can I track my sleep against moon phases?

5. CTA: "Track how the moon affects YOUR sleep — connect your Oura Ring or Fitbit (coming soon)"

Target keywords: "does the moon affect sleep," "full moon sleep problems," "lunar effect on sleep," "moon phase sleep."
Include: breadcrumbs, schema, AdSlot, MedicalDisclaimer, related tools links.


================================================================
PROMPT 9 — SLEEP-FRIENDLY FOODS TOOL (USDA API)
================================================================

Read the existing codebase. Build a "What to Eat for Better Sleep" interactive tool.

This uses the same USDA FoodData Central API from Prompt 7.

Create src/app/(marketing)/tools/sleep-foods/page.tsx:

1. Curated list of sleep-promoting nutrients and their food sources:
   - Tryptophan (precursor to serotonin and melatonin): turkey, chicken, eggs, cheese, nuts, seeds, tofu
   - Magnesium (muscle relaxation, GABA regulation): almonds, spinach, pumpkin seeds, dark chocolate, avocado
   - Melatonin-rich foods: tart cherries, pistachios, milk, goji berries, eggs
   - Vitamin B6 (converts tryptophan to melatonin): chickpeas, salmon, potatoes, bananas
   - Calcium (helps brain use tryptophan to make melatonin): yogurt, cheese, kale, sardines
   - Potassium (prevents nighttime muscle cramps): bananas, sweet potatoes, coconut water

2. Interactive tool:
   - 6 nutrient category tabs (Tryptophan, Magnesium, Melatonin, B6, Calcium, Potassium)
   - Each tab shows a ranked list of top 10 foods for that nutrient
   - Each food card shows: name, nutrient amount per serving, serving size, a food emoji
   - Data comes from a hardcoded curated dataset (don't call USDA API on page load — pre-research and hardcode the values for the specific foods listed above)

3. "Build Your Evening Snack" interactive section:
   - User selects 2-3 foods from the list
   - Show combined nutrient profile: "Your snack provides: 280mg Tryptophan, 120mg Magnesium, 0.4mg B6"
   - Rate the snack: "Sleep Score: 85/100 — Excellent evening snack for sleep!"
   - Suggest improvements: "Add a banana for potassium to make it even better"

4. "Foods That HURT Sleep" section:
   - High-sugar foods (spike blood sugar → cortisol)
   - Spicy foods (raise body temperature)
   - High-fat/fried foods (slow digestion)
   - Alcohol (disrupts REM sleep)
   - Hidden caffeine sources (chocolate, certain teas, medications)

5. Content: 2,000 words covering the science of nutrition and sleep. FAQ (6 questions).

Target keywords: "foods that help you sleep," "what to eat before bed," "sleep promoting foods," "best foods for sleep."
Include: breadcrumbs, schema, AdSlot, MedicalDisclaimer, affiliate-ready sections (link to supplement recommendations where relevant — e.g., "If you don't get enough magnesium from food, consider a magnesium supplement" with placeholder for affiliate link).


================================================================
PROMPT 10 — CITY-BASED PROGRAMMATIC PAGES (50+ pages)
================================================================

Read the existing codebase. Build city-based programmatic SEO pages.

Create src/content/data/cities-seo.json with 50+ major world cities across all timezones:
Include for each: slug, cityName, country, latitude, longitude, timezone (IANA), utcOffset, avgSunrise (annual average), avgSunset, avgTemp, knownFor (1-2 sentences about the city's sleep culture or lifestyle)

Cities to include: New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Francisco, Seattle, Denver, Boston, Miami, Atlanta, Portland, Las Vegas, Honolulu, Anchorage, London, Paris, Berlin, Tokyo, Seoul, Singapore, Sydney, Melbourne, Dubai, Mumbai, Delhi, Bangkok, Hong Kong, Shanghai, Beijing, Jakarta, Manila, São Paulo, Mexico City, Toronto, Vancouver, Amsterdam, Barcelona, Rome, Zurich, Stockholm, Cairo, Lagos, Nairobi, Auckland, Reykjavik

Create src/app/(marketing)/city/[slug]/page.tsx:

Each page includes:
- generateStaticParams() + generateMetadata()
- Title: "Best Sleep Schedule for [City] — Sleep Calculator for [Timezone]"
- The main sleep calculator pre-filled with timezone-appropriate defaults
- City-specific sunrise/sunset info (use annual averages from the data file, not live API — these are static pages)
- "Sleep in [City]" section: timezone info, typical sunset/sunrise ranges, daylight hours variation by season
- If the city is a common travel destination: jet lag section with "Coming from [popular origin cities]? Here's your recovery plan" linking to the jet lag calculator
- Tips specific to the climate (e.g., Singapore = "The humidity here averages 80%+ — keep your bedroom at 18-20°C with AC")
- FAQ (3-5 questions specific to the city/timezone)
- Links to nearby cities and the jet lag calculator
- Breadcrumbs, schema, AdSlot, MedicalDisclaimer

Content per page: 600-1,000 words unique content. Total: 50+ new static pages.


================================================================
PROMPT 11 — SLEEP SCORE SIMULATOR (No Device Needed)
================================================================

Read the existing codebase. Build a "Sleep Score Simulator" — a fun, interactive tool that estimates what a user's sleep score WOULD be without needing any wearable device.

Create src/app/(marketing)/tools/sleep-score/page.tsx:

The tool asks 8 questions (one at a time, progress bar, like the Chronotype Quiz UX):

Q1: "What time did you go to bed last night?" — Time picker
Q2: "What time did you wake up?" — Time picker
Q3: "How long did it take you to fall asleep?" — Slider: 0-60 min
Q4: "How many times did you wake up during the night?" — Buttons: 0, 1, 2, 3, 4+
Q5: "Did you feel rested when you woke up?" — Scale 1-5
Q6: "Did you remember any dreams?" (REM indicator) — Yes/No/Unsure
Q7: "Did you use screens within 1 hour of bed?" — Yes/No
Q8: "Did you consume caffeine after 2 PM?" — Yes/No

Scoring algorithm (create in src/utils/sleep-score.ts):
- Duration score (0-30 pts): Based on how close to 7-9 hours. 8h = 30pts, linear decay.
- Efficiency score (0-25 pts): (time asleep / time in bed) × 25. Deduct for fall-asleep time and wake-ups.
- Quality score (0-25 pts): Based on feeling rested (Q5) and dream recall (Q6 as REM proxy).
- Hygiene score (0-20 pts): Based on screens (Q7) and caffeine (Q8). No screens + no late caffeine = 20pts.
- Total: 0-100

Results page:
- Large animated score ring (0-100) with color: red <50, amber 50-70, green 70-85, teal 85+
- Breakdown showing each category score with progress bars
- Estimated sleep stages: "Based on your inputs, you likely got approximately: 45 min deep sleep, 90 min REM, 5h light sleep" (rough estimates based on total duration and wake-ups)
- 3 personalized tips based on their weakest scores
- CTA: "This is an estimate. Want your REAL sleep score? Wearable device integration coming soon."
- Share button: "Share your sleep score" (generates a shareable URL with score in og:image)

Content: 1,500 words on what sleep scores mean, how wearables calculate them, and what a good score is.
Target keywords: "sleep score," "what is a good sleep score," "sleep quality test," "rate my sleep."
Include: breadcrumbs, schema (WebApplication), AdSlot, MedicalDisclaimer.


================================================================
PROMPT 12 — CONDITION-BASED PROGRAMMATIC PAGES (15 pages)
================================================================

Read the existing codebase. Build condition-specific sleep calculator pages targeting high-CPC health keywords.

Create src/content/data/conditions.json with entries for:
insomnia, sleep apnea, pregnancy, ADHD, anxiety, depression, menopause, restless leg syndrome, chronic pain, fibromyalgia, shift work disorder, narcolepsy, PTSD, acid reflux/GERD, allergies and sleep

Each entry: slug, title, h1, metaDescription, conditionName, howItAffectsSleep (unique description), adjustedSleepRecommendations (may differ from standard), sleepHygieneTips (condition-specific), whenToSeeDoctor (specific red flags), unique FAQ items (5 per condition), unique content (1,200-1,800 words).

Create src/app/(marketing)/sleep-with/[slug]/page.tsx:

Each page must:
- generateStaticParams() + generateMetadata()
- Title: "Sleep Calculator for [Condition] — How [Condition] Affects Your Sleep"
- Show the standard sleep calculator (no modifications to the math)
- "How [Condition] Affects Sleep" section with unique medical content
- Adjusted tips specific to this condition
- "When to See a Doctor" section with red flag symptoms
- FAQ with schema (5 questions per condition)
- STRONG medical disclaimer (more prominent than regular pages)
- Links to related conditions and relevant calculators
- Breadcrumbs, schema, AdSlot, MedicalDisclaimer

Important: Content must be factual, cite medical sources, and NEVER provide medical advice. Always recommend consulting a healthcare provider. These pages attract high-CPC advertisers ($1-5 CPC) because of the health/pharma ad targeting.

Total: ~15 new pages.


================================================================
PROMPT 13 — DST (DAYLIGHT SAVING TIME) CALCULATOR + CONTENT
================================================================

Read the existing codebase. Build a Daylight Saving Time sleep adjustment tool and content page.

Create src/app/(marketing)/tools/dst-calculator/page.tsx:

The tool:
1. Auto-detect user's timezone to determine if/when DST applies
2. Show: "Next DST change: November 2, 2026 — Clocks fall back 1 hour"
3. Generate a 7-day adjustment plan:
   - Day -3: "Shift bedtime 15 minutes later/earlier"
   - Day -2: "Shift another 15 minutes"
   - Day -1: "Shift another 15 minutes"
   - Day 0 (DST day): "Shift final 15 minutes. Clocks change tonight."
   - Day +1: "Maintain new schedule. Get sunlight within 30 min of waking."
   - Day +2: "Your body should be adjusting. Avoid naps after 3 PM."
   - Day +3: "Most people are fully adjusted by now."
4. Show the plan as a visual timeline card layout
5. Different plans for spring forward (harder) vs fall back (easier)
6. Show sunrise/sunset times before and after DST change for their location (if geolocation available)

Hardcode the next DST dates:
- US Spring Forward: March 8, 2026 (already passed) / March 14, 2027
- US Fall Back: November 1, 2026
- EU Spring Forward: March 29, 2026
- EU Fall Back: October 25, 2026
- List of countries that don't observe DST (Singapore, Japan, etc.) — show "Your country doesn't observe DST!"

Content: 2,000 words on how DST affects sleep, health research on DST transition effects (the 24% increase in heart attacks the Monday after spring forward — from a 2014 Open Heart study), tips for adjusting. FAQ (6 questions).

Target keywords: "daylight saving time sleep," "how to adjust to DST," "DST sleep tips," "clock change sleep."
This page will get a MASSIVE traffic spike in late October and early March every year.
Include: breadcrumbs, schema, AdSlot, MedicalDisclaimer.


================================================================
PROMPT 14 — PWA (PROGRESSIVE WEB APP) SETUP
================================================================

Read the existing codebase. Make Sleep Stack installable as a Progressive Web App.

1. Create public/manifest.json:
{
  "name": "Sleep Stack",
  "short_name": "Sleep Stack",
  "description": "Sleep calculator and sleep tools",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a1a",
  "theme_color": "#6c5ce7",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}

2. Generate the icon files (use sharp or create placeholder SVGs):
   - 192x192 and 512x512 in regular and maskable versions
   - Use the site's purple/dark color scheme

3. Add the manifest link to the root layout <head>:
   <link rel="manifest" href="/manifest.json" />
   <meta name="theme-color" content="#6c5ce7" />
   <meta name="apple-mobile-web-app-capable" content="yes" />
   <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
   <link rel="apple-touch-icon" href="/icons/icon-192.png" />

4. Create a basic service worker at public/sw.js:
   - Cache the app shell (HTML, CSS, JS) for offline access
   - Cache the calculator pages so they work offline
   - Network-first strategy for API calls and dynamic content
   - Precache: /, /calculators, /calculators/*, fonts, critical CSS/JS

5. Register the service worker in the root layout:
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }

6. Add an "Install App" prompt component that shows on mobile after 30 seconds:
   - Detects the beforeinstallprompt event
   - Shows a subtle bottom banner: "Add Sleep Stack to your home screen for quick access"
   - Dismiss button + Install button
   - Only shows once per session (use sessionStorage)

This makes the site feel like a native app on mobile and increases return visits 3-4x.


================================================================
PROMPT 15 — MANUAL SLEEP JOURNAL (localStorage, No Auth)
================================================================

Read the existing codebase. Build a simple manual sleep journal that stores data in the browser's localStorage. No account needed.

Create src/app/(marketing)/tools/sleep-journal/page.tsx:

The tool:
1. "Log Last Night's Sleep" form:
   - Bedtime: time picker (default: last night 10:30 PM)
   - Wake time: time picker (default: today 6:30 AM)
   - Time to fall asleep: slider (5-60 min, default 15)
   - Wake-ups: 0, 1, 2, 3, 4+
   - Sleep quality: 1-5 stars
   - Notes: optional text field (e.g., "stressed about work," "exercised today")
   - "Save Entry" button

2. Auto-calculate from the log entry:
   - Total time in bed
   - Estimated sleep duration (in bed - fall asleep time - estimated wake-up time)
   - Sleep efficiency percentage
   - Number of complete sleep cycles
   - Simulated sleep score (reuse the scoring logic from Prompt 11)

3. "Your Sleep History" section:
   - Show the last 7-30 entries from localStorage as a timeline/list
   - Mini trend chart (Recharts) showing: duration, quality rating, and score over time
   - "Average this week: 7h 12m, Score: 74"
   - "Average this month: 6h 48m, Score: 68"

4. Storage:
   - Save entries to localStorage as JSON array
   - Key: "sleepstack_journal"
   - Each entry: { id, date, bedtime, wakeTime, fallAsleepMin, wakeUps, quality, notes, calculatedDuration, calculatedEfficiency, calculatedScore, createdAt }
   - Max 90 entries stored (delete oldest when exceeded)

5. Export button: "Download as CSV" — export all journal entries as a CSV file

6. Privacy note: "Your sleep data is stored only in your browser. We never see or upload it."

7. CTA at top: "For automatic tracking, wearable device integration coming soon."

Content: 500 words on why tracking sleep manually helps. FAQ (3 questions).
Include: breadcrumbs, schema, AdSlot.


================================================================
PROMPT 16 — EMAIL CAPTURE: 7-DAY SLEEP CHALLENGE
================================================================

Read the existing codebase. Build an email capture component for a "7-Day Sleep Challenge" lead magnet.

This does NOT need a full email backend — just the UI component and form that submits to a configurable endpoint. You can use a simple Supabase insert or a placeholder action.

Create src/components/marketing/SleepChallenge.tsx (client component):

1. Design: A glass-morphism card with:
   - Headline: "Free 7-Day Sleep Challenge"
   - Subhead: "Get a daily science-backed sleep tip delivered to your inbox. Improve your sleep score in one week."
   - Day badges showing Days 1-7 with icons (moon, sun, coffee, phone, etc.)
   - Email input field
   - "Start the Challenge — It's Free" button with primary gradient
   - Privacy note: "No spam. Unsubscribe anytime."

2. Form submission:
   - Validate email with zod
   - On submit, POST to /api/subscribe (create a simple API route)
   - The API route can: log the email to console for now, OR insert into a Supabase "subscribers" table if the table exists, OR POST to a Resend audience
   - Show success state: "Check your inbox! Day 1 starts now."
   - Store in localStorage that user has subscribed (don't show again)

3. Placement — add this component to:
   - Homepage: after the FAQ section, before the footer
   - Every calculator page: after the results section
   - Every blog post: at the end, before related posts
   - The /tonight page
   - As a slide-up from the bottom after 45 seconds on any page (dismissible, only shows once per session using sessionStorage)

4. Create src/app/api/subscribe/route.ts:
   - Accepts POST { email }
   - Validates email
   - For now: console.log the email and return success
   - Include a TODO comment for Resend/Supabase integration later

Make it beautiful — this is a conversion element. Use the design system colors, subtle animation on the button, and a satisfying success state.


================================================================
PROMPT 17 — SCHEMA MARKUP AUDIT + OG IMAGES
================================================================

Read the existing codebase. Audit and add/fix structured data (JSON-LD) and Open Graph meta tags across the entire site.

1. Create or update src/utils/schema.ts with generators for:
   - WebSite schema (homepage only)
   - WebApplication schema (every calculator page)
   - Article schema (every blog post)
   - FAQPage schema (every page with an FAQ section)
   - BreadcrumbList schema (every page with breadcrumbs)
   - ItemList schema (calculators hub page, listing all tools)

2. Audit every existing page and ensure it has:
   - Unique <title> (50-60 chars)
   - Unique meta description (140-155 chars)
   - Canonical URL
   - og:title, og:description, og:image, og:url, og:type
   - twitter:card, twitter:title, twitter:description, twitter:image
   - At least one JSON-LD schema block

3. For og:image — create a reusable OG image generation system:
   - Option A (recommended): Create a static OG image template as an SVG that gets rendered per-page
   - Option B: Use Next.js ImageResponse API (from next/og) to dynamically generate OG images
   - Each OG image should show: page title, "Sleep Stack" branding, dark theme with purple accent, 1200x630px

4. Create src/app/api/og/route.tsx using Next.js ImageResponse:
   - Accepts ?title=X&subtitle=Y as query params
   - Renders a 1200x630 image with:
     - Dark background (#0a0a1a)
     - "Sleep Stack" logo/text top-left
     - Title in large Plus Jakarta Sans
     - Subtitle below in smaller Inter
     - Subtle decorative elements (gradient accent, moon icon)
   - This becomes the og:image URL for all pages

5. Update generateMetadata() on every page to include the dynamic OG image URL

6. Verify: no page has duplicate titles, no page is missing schema, no page has a missing or broken OG image.


================================================================
PROMPT 18 — SITEMAP + ROBOTS + TECHNICAL SEO
================================================================

Read the existing codebase. Ensure all technical SEO elements are complete.

1. Update src/app/sitemap.ts (Next.js dynamic sitemap):
   - Include ALL pages: homepage, all calculator pages, all blog posts, statistics page, all tools pages (tonight, circadian-guide, jet-lag-calculator, moon-sleep, sleep-foods, sleep-score, sleep-journal, dst-calculator)
   - Include ALL programmatic pages: every sleep-time/[slug], bedtime/[slug], age/[slug], profession/[slug], city/[slug], sleep-with/[slug]
   - Set proper changefreq and priority:
     - Homepage: weekly, 1.0
     - Calculators: weekly, 0.9
     - Tools: weekly, 0.8
     - Blog: weekly, 0.7
     - Statistics: monthly, 0.8
     - Programmatic pages: monthly, 0.6
   - Ensure the total URL count is correct (should be 300+ pages)

2. Create or update public/robots.txt:
   User-agent: *
   Allow: /
   Disallow: /api/
   Sitemap: https://sleepstackapp.com/sitemap.xml

3. Create or update public/ads.txt:
   - Add placeholder: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   - Update with real AdSense publisher ID once approved

4. Verify internal linking:
   - Every programmatic page links to 2-3 related pages + parent calculator
   - Every blog post links to at least 2 calculator pages
   - Every tool page links to related tools and calculators
   - No orphan pages (every page reachable from navigation or internal links)
   - Footer includes links to all major sections

5. Add <link rel="canonical" href="..." /> to every page if not already present via generateMetadata()

6. Check that all images have alt text, all links have descriptive text (not "click here"), and heading hierarchy is correct (single H1 per page, logical H2/H3 structure).

Run: npm run build — verify zero errors and all pages generate successfully.
Count the total pages in the build output to confirm 300+ pages are being generated.
