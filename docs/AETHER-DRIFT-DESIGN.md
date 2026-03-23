# Design System Specification: Celestial Precision

## 1. Overview & Creative North Star
### The Creative North Star: "The Observational Sanctuary"
This design system rejects the cluttered, high-anxiety aesthetic of traditional health tracking. Instead, it adopts the persona of an **Observational Sanctuary**—a space that feels as infinite as the night sky yet as precise as a laboratory instrument. 

We move beyond "standard" dark mode by utilizing **chromatic depth**. We break the rigid, boxy "template" look through intentional asymmetry, overlapping glass surfaces, and a high-contrast typographic scale. The goal is an editorial experience where data feels like a celestial map: expansive, quiet, and deeply premium.

---

## 2. Colors & Tonal Depth
The palette is rooted in the transition from deep midnight to the ethereal glow of dawn. We do not use "gray"; every neutral is infused with a microscopic hint of indigo to maintain a luxurious, cohesive atmosphere.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. 
Boundaries must be defined solely through background color shifts. To separate a section, transition from `surface` (#121222) to `surface-container-low` (#1a1a2b). This creates a sophisticated, "molded" look rather than a "sketched" one.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
- **Base Layer:** `surface` (#121222) for the canvas.
- **Secondary Sections:** `surface-container-low` (#1a1a2b) for secondary content groups.
- **Interactive Cards:** `surface-container` (#1e1e2f) or `surface-container-high` (#29283a) for primary focus areas.

### The "Glass & Gradient" Rule
To achieve the signature "Drift" feel, use **Backdrop Blurs** (20px–40px) on `surface-container` elements with an opacity of 60-80%. 
- **Signature Gradient:** Use a linear gradient (135°) from `primary-container` (#6c5ce7) to `secondary-container` (#00cec9) for primary CTAs and hero data visualizations. This is the "soul" of the system—it represents the spark of life within the calm of sleep.

---

## 3. Typography
Our typography strategy balances the "Editorial Luxury" of Plus Jakarta Sans with the "Scientific Rigor" of Inter.

| Level | Token | Font | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | Emotional, quiet headlines. Use with -2% letter spacing. |
| **Headline** | `headline-md` | Plus Jakarta Sans | 1.75rem | Section titles. Always provide generous `spacing-10` above. |
| **Title** | `title-lg` | Inter | 1.375rem | Data group headers. Semi-bold for authority. |
| **Body** | `body-md` | Inter | 0.875rem | Primary reading. Use `on-surface-variant` for softer focus. |
| **Label** | `label-sm` | Inter | 0.6875rem | Technical stats and metadata. All-caps with +5% tracking. |

**The Hierarchy Philosophy:** We use dramatic size differences between Display and Body text to create an "asymmetric" editorial feel. Headlines should feel like art; body text should feel like a medical record—clear and indisputable.

---

## 4. Elevation & Depth
In this design system, depth is a feeling, not a drop-shadow.

### The Layering Principle
Achieve lift by "stacking" tonal tiers. Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "recess" or "lift" without visual noise.

### Ambient Shadows
For floating elements (modals, tooltips), use **Ambient Shadows**:
- **Color:** `#000000` at 40% opacity.
- **Blur:** 60px.
- **Spread:** -10px (to keep the shadow tight and sophisticated).
- **Y-Offset:** 20px.

### The "Ghost Border" Fallback
If a border is required for accessibility, use the `outline-variant` (#474554) at **15% opacity**. Never use 100% opaque borders; they shatter the illusion of glass and light.

---

## 5. Components

### Primary Action (Glowing Button)
- **Background:** Gradient `primary-container` to `secondary-container`.
- **Corner Radius:** `full` (pill shape).
- **Effect:** A subtle `0 0 15px` outer glow matching the `primary` color at 30% opacity.
- **Typography:** `label-md` (Inter, Bold).

### Glassmorphism Cards
- **Background:** `surface-container-high` at 70% opacity.
- **Blur:** `backdrop-filter: blur(24px)`.
- **Border:** Ghost Border (15% opacity `outline-variant`).
- **Nesting:** Forbid dividers. Separate content using `spacing-4` (1.4rem) or a subtle shift to `surface-container-highest` for internal card sections.

### Precise Data Visuals (The "Scientific" Component)
- **Rings/Charts:** Use `secondary` (#46eae5) for active data and `surface-container-highest` for background tracks.
- **Stats:** Use `title-md` Inter for the numerical value, paired with `label-sm` Inter for the unit (e.g., 75 *BPM*).

### Input Fields
- **State:** Unfocused inputs use `surface-container-low`. 
- **Focus State:** The border transitions to a 1px `primary` (#c6bfff) glow. No heavy fills.
- **Error:** Use `error` (#ffb4ab) only for the helper text and a 1px border; do not turn the entire field red.

---

## 6. Do’s and Don’ts

### Do:
- **Use generous whitespace:** If a layout feels "full," increase the spacing by two increments on the scale.
- **Embrace asymmetry:** Align a large `display-lg` headline to the left and float a `surface-container` card to the right to create visual tension.
- **Subtle Star-Fields:** Use a background pattern of 1px dots at 5% opacity `on-background` to provide a sense of infinite depth.

### Don't:
- **Never use dividers:** Use `spacing-6` or `surface` shifts. Lines create "cells"; we want "flow."
- **Avoid pure white:** Use `on-surface` (#e3e0f8) for text. Pure white (#ffffff) is too harsh for a sleep-focused health app.
- **No sharp corners:** Everything must use at least `DEFAULT` (0.5rem) or `lg` (1rem) rounding to maintain the "Calm" brand personality.

### Accessibility Note:
While we utilize glass-morphism and transparency, always ensure the `on-surface` text maintains a 4.5:1 contrast ratio against the blurred background. If the background is too busy, increase the opacity of the glass layer.