# DESIGN-SYSTEM.md — Extracted from Stitch Mockups

> **For Claude Code:** This file contains the exact design tokens, component patterns, and Tailwind classes extracted from 10 approved Stitch mockup pages. When building components, match these patterns EXACTLY. The screenshots in /stitch/ are the source of truth for visual appearance.
>
> **Creative direction:** "The Observational Sanctuary" — infinite as the night sky, precise as a lab instrument. No borders, only surface shifts. Glass surfaces, chromatic depth, editorial asymmetry.

---

## 1. TAILWIND CONFIG — Color Tokens

These are the EXACT color tokens from the Stitch HTML. Add them to `tailwind.config.ts`:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // === SURFACE HIERARCHY (dark to light) ===
        "surface-dim":              "#121222",  // Page background / base canvas
        "surface":                  "#121222",  // Alias for base
        "surface-container-lowest": "#0c0c1d",  // Deepest recessed areas
        "surface-container-low":    "#1a1a2b",  // Secondary sections, sidebar
        "surface-container":        "#1e1e2f",  // Default card backgrounds
        "surface-container-high":   "#29283a",  // Primary interactive cards
        "surface-container-highest":"#333345",  // Elevated elements, chart tracks
        "surface-bright":           "#38374a",  // Hover states on containers
        "surface-variant":          "#333345",  // Alternative surface

        // === PRIMARY (Indigo family) ===
        "primary":                  "#c6bfff",  // Primary text accent, links
        "primary-container":        "#6c5ce7",  // CTA backgrounds, badges, active tabs
        "primary-fixed":            "#e4dfff",  // Light primary for subtle fills
        "primary-fixed-dim":        "#c6bfff",  // Dim primary, focus rings
        "on-primary":               "#2900a0",  // Text on primary backgrounds
        "on-primary-container":     "#faf6ff",  // Text on primary-container (CTA text)
        "on-primary-fixed":         "#160066",  // Text on primary-fixed
        "inverse-primary":          "#5847d2",  // Inverse context primary

        // === SECONDARY (Teal family) ===
        "secondary":                "#46eae5",  // Active data, optimal indicators, success
        "secondary-container":      "#00cec9",  // Secondary CTA, gradient endpoint
        "secondary-fixed":          "#5af9f3",  // Bright teal for emphasis
        "secondary-fixed-dim":      "#2edcd7",  // Dim teal
        "on-secondary":             "#003735",  // Text on secondary
        "on-secondary-container":   "#005250",  // Text on secondary-container

        // === TERTIARY (Purple family) ===
        "tertiary":                 "#c5c0ff",  // Tertiary accent
        "tertiary-container":       "#6d66c4",  // Tertiary fills
        "on-tertiary":              "#2a1f7e",  // Text on tertiary

        // === TEXT / ON-SURFACE ===
        "on-surface":               "#e3e0f8",  // Primary text (NOT pure white)
        "on-surface-variant":       "#c8c4d7",  // Secondary/muted text
        "on-background":            "#e3e0f8",  // Body text on background
        "inverse-surface":          "#e3e0f8",  // Inverse surface
        "inverse-on-surface":       "#2f2f40",  // Text on inverse surface

        // === OUTLINE / BORDERS ===
        "outline":                  "#928ea0",  // Standard outline (rarely used)
        "outline-variant":          "#474554",  // Ghost borders at 15% opacity

        // === ERROR ===
        "error":                    "#ffb4ab",  // Error text
        "error-container":          "#93000a",  // Error background
        "on-error":                 "#690005",  // Text on error
        "on-error-container":       "#ffdad6",  // Text on error-container

        // === SURFACE TINT ===
        "surface-tint":             "#c6bfff",  // Tint overlay
      },
      fontFamily: {
        headline: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body:     ["var(--font-inter)", "Inter", "sans-serif"],
        label:    ["var(--font-inter)", "Inter", "sans-serif"],
        mono:     ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["1.75rem", { lineHeight: "1.3", fontWeight: "700" }],
        "title-lg":    ["1.375rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-md":     ["0.875rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm":    ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "700" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

---

## 2. GLOBAL CSS

```css
/* src/styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply dark;
  }

  body {
    background-color: #121222;
    background-image: radial-gradient(circle at 50% -20%, #29283a 0%, #121222 60%);
    @apply font-body text-on-surface antialiased;
  }
}

@layer components {
  /* === GLASS CARD (Primary card style across all pages) === */
  .glass-card {
    background: rgba(30, 30, 47, 0.7);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(71, 69, 84, 0.15);
  }

  /* === PRO GLOW (Gold/purple glow on Pro features) === */
  .pro-glow {
    box-shadow: 0 0 40px -10px rgba(108, 92, 231, 0.3);
  }

  /* === STAR FIELD (Background texture for depth) === */
  .star-field {
    background-image:
      radial-gradient(1px 1px at 20px 30px, #e3e0f8, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 40px 70px, #e3e0f8, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 50px 160px, #e3e0f8, rgba(0,0,0,0)),
      radial-gradient(1px 1px at 80px 120px, #e3e0f8, rgba(0,0,0,0));
    background-size: 200px 200px;
    opacity: 0.1;
  }

  /* === GRADIENT CTA BUTTON === */
  .btn-gradient {
    @apply px-6 py-2.5 rounded-full font-bold text-sm transition-all;
    @apply bg-gradient-to-r from-primary-container to-secondary-container;
    @apply text-on-primary-container;
    box-shadow: 0 0 15px rgba(108, 92, 231, 0.3);
  }
  .btn-gradient:hover {
    box-shadow: 0 0 30px rgba(108, 92, 231, 0.6);
    @apply scale-105;
  }
  .btn-gradient:active {
    @apply scale-95;
  }

  /* === AMBIENT SHADOW (floating elements) === */
  .shadow-ambient {
    box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.4);
  }

  /* === SCORE GRADIENT (SVG sleep score ring) === */
  .score-gradient-start { stop-color: #6c5ce7; }
  .score-gradient-end   { stop-color: #00cec9; }
}
```

---

## 3. COMPONENT PATTERNS (Exact Tailwind Classes from Stitch)

### 3.1 — Navigation Bar

```tsx
// Fixed top navbar — glass blur, no border
<nav className="fixed top-0 w-full z-50 bg-[#121222]/80 backdrop-blur-xl shadow-ambient">
  <div className="flex justify-between items-center px-8 py-4 max-w-none">

    {/* Logo */}
    <div className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
      {BRAND_NAME}
    </div>

    {/* Nav links */}
    <a className="font-headline font-medium text-sm tracking-tight text-on-surface/60 hover:text-on-surface transition-colors">
      {link}
    </a>
    {/* Active link */}
    <a className="font-headline font-semibold text-sm tracking-tight text-primary-container border-b-2 border-primary-container pb-1">
      {activeLink}
    </a>

    {/* PRO badge button */}
    <button className="px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-wider">
      PRO
    </button>

    {/* Primary CTA */}
    <button className="btn-gradient">Sign Up Free</button>
  </div>
</nav>
```

### 3.2 — Glass Card (Used EVERYWHERE)

```tsx
// Standard glass card — the #1 component pattern
<section className="glass-card rounded-3xl p-8 overflow-hidden relative">
  {/* Optional ambient glow behind card */}
  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] -z-10 rounded-full" />
  {children}
</section>

// Smaller glass card variant
<div className="glass-card rounded-2xl p-6">
  {children}
</div>
```

### 3.3 — Section Labels (Uppercase tracking)

```tsx
// ALL section labels use this pattern
<label className="text-label-sm font-label tracking-[0.05em] uppercase text-on-surface-variant">
  {label}
</label>

// Smaller stat labels
<p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">
  {statLabel}
</p>
```

### 3.4 — Sleep Score Ring (SVG)

```tsx
// Circular score ring with gradient stroke — from Dashboard page
<div className="relative w-48 h-48 flex items-center justify-center">
  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
    {/* Background track */}
    <circle
      className="text-surface-container-highest"
      cx="50" cy="50" r="45"
      fill="none" stroke="currentColor" strokeWidth="8"
    />
    {/* Score arc — strokeDashoffset controls fill (282.7 = full circle) */}
    <circle
      cx="50" cy="50" r="45"
      fill="none" stroke="url(#scoreGradient)"
      strokeWidth="8" strokeLinecap="round"
      strokeDasharray="282.7"
      strokeDashoffset={282.7 - (282.7 * score / 100)}
    />
    <defs>
      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6c5ce7" />
        <stop offset="100%" stopColor="#00cec9" />
      </linearGradient>
    </defs>
  </svg>
  {/* Center text */}
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-5xl font-headline font-extrabold">{score}</span>
    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
      Sleep Score
    </span>
  </div>
</div>
```

### 3.5 — Result Cards (Calculator recommendations)

```tsx
// OPTIMAL result card (teal border)
<div className="p-5 rounded-xl bg-surface-container-highest/50 border border-secondary/20 flex justify-between items-center group hover:bg-surface-container-highest transition-all cursor-pointer">
  <div>
    <span className="text-2xl font-bold font-headline block">10:15 PM</span>
    <span className="text-xs font-label uppercase text-secondary font-bold">Optimal • 6 Cycles</span>
  </div>
  <div className="text-right">
    <span className="block text-sm text-on-surface-variant">9h 15m Sleep</span>
    <span className="material-symbols-outlined text-secondary">verified</span>
  </div>
</div>

// STANDARD result card (no teal border)
<div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/5 flex justify-between items-center group hover:bg-surface-container-highest transition-all cursor-pointer">
  <div>
    <span className="text-2xl font-bold font-headline block">11:45 PM</span>
    <span className="text-xs font-label uppercase text-on-surface-variant">Healthy • 5 Cycles</span>
  </div>
  <div className="text-right">
    <span className="block text-sm text-on-surface-variant">7h 45m Sleep</span>
  </div>
</div>
```

### 3.6 — Stat Pill / Mini Card

```tsx
// Sleep stage stat pills (from Dashboard)
<div className="bg-surface-container-low/50 p-3 rounded-2xl border border-outline-variant/10">
  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">REM</p>
  <p className="text-lg font-bold">1h 45m</p>
</div>
```

### 3.7 — Biometric Stats Row

```tsx
// Resting HR / HRV cards (from Dashboard)
<div className="glass-card rounded-2xl p-5">
  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Resting HR</p>
  <div className="flex items-baseline gap-1">
    <span className="text-3xl font-bold">52</span>
    <span className="text-sm text-on-surface-variant font-label uppercase">BPM</span>
  </div>
  <p className="text-secondary text-xs font-semibold mt-1">Optimal Range</p>
</div>
```

### 3.8 — Hero Headlines

```tsx
// Homepage hero (gradient text)
<h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-on-surface to-on-surface-variant">
  Sleep Smarter.<br/>Wake Refreshed.
</h1>

// Pricing hero (partial gradient)
<h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-6 text-on-surface">
  Sleep Better, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-fixed-dim to-secondary">Starting Tonight</span>
</h1>

// Dashboard greeting
<h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-2">
  Morning, {name}.
</h1>
<p className="text-on-surface-variant text-lg">
  Your body is recovering well after a deep 7h session.
</p>
```

### 3.9 — Premium Badge

```tsx
// "PREMIUM" badge on Pro-gated cards
<span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase">
  Premium
</span>

// "MOST POPULAR" badge on pricing card
<div className="absolute top-0 right-0 bg-gradient-to-bl from-primary-container to-secondary-container px-6 py-2 rounded-bl-2xl text-[10px] font-black tracking-widest uppercase">
  Most Popular
</div>
```

### 3.10 — Device Connection Card

```tsx
// Connected device (from Dashboard)
<div className="glass-card rounded-2xl p-4 flex items-center gap-4">
  <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center">
    {/* Device icon */}
  </div>
  <div className="flex-1">
    <p className="font-bold text-sm">Oura Ring Gen3</p>
    <p className="text-xs text-on-surface-variant">Connected • Last sync: 2m ago</p>
  </div>
  <span className="text-secondary font-bold text-sm">84%</span>
</div>

// Wearable grid cards (from Homepage sidebar)
<div className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-container border border-outline-variant/10 hover:border-primary-fixed-dim/40 transition-all cursor-pointer">
  <span className="text-xl font-bold font-headline mb-1">Oura</span>
  <span className="text-xs font-label">Ring</span>
</div>
```

### 3.11 — AI Coach Card

```tsx
// AI insight card (from Dashboard + Homepage)
<div className="glass-card rounded-2xl p-6">
  <div className="flex items-center gap-2 mb-4">
    <span className="material-symbols-outlined text-secondary">auto_awesome</span>
    <h3 className="font-headline font-bold">AI Sleep Coach</h3>
  </div>
  <p className="text-sm text-on-surface-variant italic leading-relaxed">
    "Your REM sleep is 15% higher than your average. This suggests intense
    cognitive activity yesterday. Wind down with a 5-min meditation tonight."
  </p>
  <button className="mt-4 text-secondary text-sm font-bold uppercase tracking-widest hover:text-secondary-fixed transition-colors">
    Chat with Coach →
  </button>
</div>
```

### 3.12 — Footer

```tsx
<footer className="bg-[#121222] w-full py-12 px-8 border-t border-outline-variant/15">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
    {/* Brand */}
    <div>
      <div className="text-xl font-bold text-on-surface font-headline mb-4">{BRAND_NAME}</div>
      <p className="text-sm text-on-surface/40 leading-relaxed font-body max-w-xs">
        Built for better sleep. Science-backed methodologies to help you wake up refreshed.
      </p>
    </div>
    {/* Link columns */}
    <div>
      <h4 className="text-secondary text-xs font-bold uppercase tracking-widest mb-4">Calculators</h4>
      <a className="block text-sm text-on-surface/50 hover:text-on-surface transition-colors mb-2">{link}</a>
    </div>
  </div>
  <div className="mt-12 pt-8 border-t border-outline-variant/10 text-center">
    <p className="text-sm text-on-surface/30">© 2026 {BRAND_NAME}. Built for better sleep.</p>
  </div>
</footer>
```

### 3.13 — Input Fields

```tsx
// Time input (from Calculator)
<input
  className="w-full bg-surface-container-low border-0 rounded-xl px-6 py-5 text-3xl font-headline font-bold text-on-surface focus:ring-2 focus:ring-primary-fixed-dim transition-all"
  type="text"
  value="05:30"
/>

// Range slider
<input
  className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary"
  type="range" min="5" max="45" step="5" value="15"
/>
```

### 3.14 — Pricing Cards

```tsx
// FREE card
<div className="glass-card rounded-3xl p-8 flex flex-col h-full">
  <h3 className="text-2xl font-headline font-bold mb-2">FREE</h3>
  <div className="flex items-baseline gap-1 mb-4">
    <span className="text-4xl font-bold tracking-tight">$0</span>
    <span className="text-on-surface-variant text-sm">/ forever</span>
  </div>
  {/* Features list */}
  <button className="w-full py-4 rounded-xl border border-outline-variant/30 font-bold text-sm hover:bg-surface-container-high transition-all">
    Get Started
  </button>
</div>

// PRO card (with glow)
<div className="glass-card pro-glow relative rounded-3xl p-8 flex flex-col h-full transition-transform hover:-translate-y-1 overflow-hidden">
  {/* "Most Popular" badge */}
  <h3 className="text-2xl font-headline font-bold mb-2 text-primary-fixed-dim">PRO</h3>
  <div className="flex items-baseline gap-1 mb-4">
    <span className="text-4xl font-bold tracking-tight">$49.99</span>
    <span className="text-on-surface-variant text-sm">/ year</span>
  </div>
  {/* Features with checkmarks */}
  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container font-bold text-sm text-on-primary-container shadow-lg shadow-primary-container/20">
    Go Pro Now
  </button>
</div>
```

### 3.15 — Social Proof Bar

```tsx
<div className="text-center py-16">
  <p className="text-label-sm uppercase tracking-widest text-on-surface-variant mb-8">
    Trusted by 1M+ restless sleepers
  </p>
  <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
    <div className="font-headline font-bold text-2xl">TechCrunch</div>
    <div className="font-headline font-bold text-2xl">WIRED</div>
    {/* etc. */}
  </div>
</div>
```

### 3.16 — Blog Post Typography

```tsx
// Drop cap
<p className="first-letter:text-6xl first-letter:font-headline first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
  Your internal biological clock...
</p>

// Blockquote
<blockquote className="border-l-2 border-primary-container pl-6 py-2 my-8 italic text-on-surface-variant">
  "Sleep is not just a passive state; it is an active metabolic process."
  <cite className="block mt-2 not-italic text-xs uppercase tracking-widest text-secondary">
    — Dr. Sarah Chen
  </cite>
</blockquote>

// Inline CTA card (mid-article)
<div className="glass-card rounded-2xl p-6 text-center my-8">
  <span className="material-symbols-outlined text-3xl text-secondary mb-2">calculate</span>
  <h3 className="font-headline font-bold mb-2">Calculate Your Optimal Wake Time</h3>
  <p className="text-sm text-on-surface-variant mb-4">
    Use our sleep cycle algorithm to find the exact moment you should wake up.
  </p>
  <button className="btn-gradient">Launch Calculator</button>
</div>
```

### 3.17 — Chronotype Result Card (Shareable)

```tsx
// The shareable Wolf profile card
<div className="glass-card rounded-3xl p-8 relative overflow-hidden">
  <div className="flex items-center gap-2 mb-6">
    <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center text-sm">🌊</div>
    <span className="font-headline font-bold text-sm">DRIFT</span>
    <span className="ml-auto text-xs text-on-surface-variant">WOLF PROFILE • Q4 2024</span>
  </div>
  {/* Wolf illustration */}
  <div className="grid grid-cols-2 gap-3 mt-6">
    <div className="bg-surface-container-low rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Optimal Window</p>
      <p className="font-headline font-bold">12:30 AM — 08:00 AM</p>
    </div>
    <div className="bg-surface-container-low rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Peak Performance</p>
      <p className="font-headline font-bold">06:00 PM — 10:00 PM</p>
    </div>
  </div>
</div>
```

---

## 4. LAYOUT GRID PATTERNS

### Homepage: 12-column bento

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
  <section className="lg:col-span-8">{/* Calculator */}</section>
  <aside className="lg:col-span-4">{/* Sidebar: devices + AI coach */}</aside>
</div>
```

### Dashboard: 12-column asymmetric

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
  <div className="lg:col-span-7 space-y-8">{/* Last Night + Hypnogram */}</div>
  <div className="lg:col-span-5 space-y-8">{/* Cycles + Trends + Devices */}</div>
</div>
```

### Pricing: 2-column centered

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
  {/* Free card */}
  {/* Pro card */}
</div>
```

### Calculator pages: Single column, max-width

```tsx
<main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
  <header>{/* H1 + subtitle */}</header>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{/* Calculator inputs + results */}</div>
  {/* Supporting content below */}
</main>
```

---

## 5. CRITICAL DESIGN RULES

Extracted from the Aether Drift DESIGN.md:

1. **NO 1px borders for sectioning.** Separate sections with background color shifts only. Transition from `surface` to `surface-container-low` to create depth.

2. **Every neutral has indigo undertone.** No pure grays. Every surface color includes a microscopic indigo tint.

3. **Never use pure white (#ffffff).** Use `on-surface` (#e3e0f8) for text. Pure white is too harsh.

4. **Glass-morphism on all interactive cards.** `backdrop-filter: blur(24px)` with 70% opacity backgrounds.

5. **Ghost borders only** (when borders are needed): `border-outline-variant/15` — that's rgba(71,69,84,0.15).

6. **The signature gradient** is `from-primary-container to-secondary-container` (indigo → teal, 135°). This appears on CTAs, score rings, hero data, and the Pro badge.

7. **Dramatic headline scale.** Display text at 3.5rem+, body at 0.875rem. The contrast creates editorial tension.

8. **Labels are always uppercase** with `tracking-[0.05em]` or `tracking-widest` and `text-[10px]` or `text-label-sm`.

9. **Ambient glow behind cards** using `div.absolute` with `bg-primary-container/10 blur-[100px]` positioned behind glass cards.

10. **Star-field background** on the base page — fixed position, pointer-events-none, 10% opacity dots.

---

## 6. AD SLOT INTEGRATION

Based on the mockup layouts, ads fit in these positions without disrupting the design:

```tsx
// Ad slot component — invisible for Pro users, reserved dimensions
<div className={cn(
  "w-full flex items-center justify-center",
  "bg-surface-container-lowest/30 rounded-2xl",
  "border border-outline-variant/5",
  isPro && "hidden"
)}>
  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/30 py-1">
    Advertisement
  </p>
  {/* Ad loads here via IntersectionObserver */}
  <div
    data-ad-slot={slotId}
    style={{ minHeight: height, minWidth: width }}
  />
</div>
```

Placement per page type:
- **Calculator pages:** After results section, before FAQ
- **Blog posts:** After 2nd H2, before FAQ section
- **Dashboard (free users):** Below trends section
- **Programmatic pages:** After quick-reference table, before content

---

## 7. STITCH REFERENCE FILES

All mockup screenshots are at:
```
/stitch/stitch/homepage_calculator/screen.png        ← Homepage
/stitch/stitch/user_dashboard/screen.png             ← Dashboard
/stitch/stitch/caffeine_sleep_calculator/screen.png  ← Caffeine calc
/stitch/stitch/shift_worker_sleep_calculator/screen.png ← Shift worker
/stitch/stitch/sleep_debt_calculator/screen.png      ← Sleep debt
/stitch/stitch/pricing_page/screen.png               ← Pricing
/stitch/stitch/blog_post_page/screen.png             ← Blog post
/stitch/stitch/sleep_statistics_2026/screen.png      ← Statistics
/stitch/stitch/chronotype_quiz_results/screen.png    ← Chronotype results
/stitch/stitch/mobile_homepage_calculator/screen.png ← Mobile view
```

HTML source code for each is in the `code.html` file alongside each screenshot.
Copy these into the project root `/stitch/` directory for reference during development.
