# OHMXO Agency Design System

> Category: Agency / Creative Tech

OHMXO is a digital architecture firm born from the music industry. Founded by Jacob (former A&R, now full-stack architect), the agency operates at the intersection of creative culture and advanced technology — Music × Tech DNA. We build comprehensive digital ecosystems for artists, brands, and creative enterprises. We don't build websites; we architect systems.

**Core philosophy:** "Precision over personality. Craft over hype. Everything uppercase — nothing soft-spoken."

---

## 1. Visual Theme & Atmosphere

Dark, minimal, technically precise. The aesthetic draws from high-end creative studios and underground music culture simultaneously — think Virgil Abloh meets Silicon Valley systems thinking. Interfaces feel architectural: structured grids, massive display type, deliberate negative space. The OHMXO red (`#ff0000`) is never decorative — it signals intent, hierarchy, and action. Everything else is near-black or white. The visual language is monochromatic with one live wire running through it.

References: Rick Owens web presence, NTS Radio, Teenage Engineering, A-COLD-WALL*, Virgil Abloh's Office.

---

## 2. Color

**Primary palette:**

- `#ff0000` — OHMXO Red. Primary accent, CTA backgrounds, active states, logo mark. Never use as a neutral fill.
- `#0f0f0f` — Near-black. Primary background on dark surfaces, primary text on light surfaces.
- `#ffffff` — White. Primary text on dark backgrounds, inverse surfaces.
- `#1a1a1a` — Surface. Card and panel backgrounds on dark layouts.
- `#2a2a2a` — Border. Dividers, input borders, subtle separators.
- `#888888` — Muted. Secondary labels, captions, metadata.

**Usage rules:**
- Background default: `#0f0f0f`
- Body text on dark: `#ffffff`
- Accent / interactive: `#ff0000`
- Never combine red on white — always red on dark or white on dark
- No gradients. No transparency effects on brand colors. Flat, opaque.

---

## 3. Typography

**Typefaces:**
- `Humane` — Display / headings. All uppercase, `line-height: 0.85`. Massively scaled. This is the dominant visual element on every screen.
- `Neue Montreal` — Body / UI text. All uppercase, `font-weight: 500`, `line-height: 1.125`. Clean, utilitarian.
- `DM Mono` — Code, technical labels, metadata, small callouts.

**Type scale (fluid):**
- Display / H1: `clamp(5rem, 20vw, 20rem)` — Humane
- H2: `clamp(4.5rem, 15vw, 15rem)` — Humane
- H3: `clamp(4rem, 12vw, 12rem)` — Humane
- H4: `clamp(3.5rem, 10vw, 10rem)` — Humane
- H5: `clamp(3rem, 8vw, 8rem)` — Humane
- H6: `clamp(2.5rem, 6vw, 6rem)` — Humane
- Body: `1rem` — Neue Montreal
- Body MD: `1.125rem` — Neue Montreal
- Body LG: `1.25rem` — Neue Montreal
- Mono / label: `0.75rem–0.875rem` — DM Mono

**Rules:**
- All headings: uppercase, no exceptions
- All body text: uppercase
- No italic type — ever
- No mixed-case headlines
- Tight tracking on display type; default tracking on body

---

## 4. Spacing & Grid

**Container:** max-width `2000px`, centered, padding `2.5rem` desktop / `1.25rem` mobile.

**Grid:** 12-column on desktop, 4-column on mobile. Gutters `2rem`.

**Spacing scale (base 4px):**
- `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `120px`, `160px`

**Section rhythm:** Generous vertical spacing — sections breathe. Minimum `80px` top/bottom padding on sections, `120–160px` on hero sections.

**Breakpoints:**
- Desktop: `1001px+`
- Tablet / mobile: `≤1000px`
- Small phone: `≤480px` (heading scale reduces)
- Animated elements: `≤600px` (secondary visuals hide)

---

## 5. Layout & Composition

Layouts are architectural — structured, asymmetric, and intentional. Type carries the visual weight; imagery is secondary. Key compositional rules:

- Hero sections: full-bleed, massive H1 spanning full viewport width, minimal supporting text
- Split layouts: text-heavy left, visual right — or full-text columns with type as the visual
- Cards: dark surface (`#1a1a1a`), 0 border-radius or `2px` max, `1px` border in `#2a2a2a`
- No drop shadows on cards — use border instead
- Navigation: minimal, fixed or absolute, logo + links only
- Footer: full-bleed dark section with large display type treatment

---

## 6. Components

**Buttons:**
- Primary: `background: #ff0000`, `color: #ffffff`, `text-transform: uppercase`, `font-family: Neue Montreal`, `font-weight: 500`, `padding: 12px 24px`, `border-radius: 0` (no radius)
- Secondary: `background: transparent`, `border: 1px solid #ffffff`, `color: #ffffff`, same padding
- Hover: invert — primary becomes white/dark, secondary fills red
- No border-radius on buttons — sharp corners always

**Cards:**
- Background: `#1a1a1a`
- Border: `1px solid #2a2a2a`
- Padding: `24px`
- Border-radius: `0` or `2px` max
- No shadows

**Navigation:**
- Fixed or absolute position
- Logo: OHMXO mark (red on dark)
- Links: Neue Montreal, uppercase, `0.875rem`
- Active: red underline or red color
- Mobile: fullscreen overlay menu

**Inputs / Forms:**
- Background: transparent or `#1a1a1a`
- Border: `1px solid #2a2a2a`
- Focus border: `1px solid #ff0000`
- Text: `#ffffff`, Neue Montreal uppercase
- No border-radius

**Tags / Pills:**
- `border: 1px solid #2a2a2a`, `color: #888888`, `font-family: DM Mono`, `font-size: 0.75rem`, `padding: 4px 8px`, `border-radius: 0`

---

## 7. Motion & Interaction

Motion is purposeful and architectural — not decorative. Influenced by GSAP ScrollTrigger, Lenis smooth scroll, and clip-path transitions.

**Page transitions:**
- Exit: current page dims (`brightness: 0.25`) and translates up `35%`
- Enter: new page wipes in via `clip-path` from bottom — `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)` → full reveal
- Duration: `1.5s`, easing: `cubic-bezier(0.87, 0, 0.13, 1)` (sharp expo)

**Scroll:**
- Smooth scroll via Lenis
- ScrollTrigger on text reveals, section entrances, parallax
- Text: line-by-line or word-by-word reveal, translate Y up from `40px`, fade in
- Sections: fade + slight upward drift on enter

**Hover:**
- Links: color shift to `#ff0000`, `transition: 0.2s`
- Buttons: background invert, `transition: 0.15s`
- Cursor: custom red cursor (`28px`), `mix-blend-mode: difference`

**Constraints:**
- No bounce easing
- No spinning loaders — use shimmer or skeleton
- Animations must feel precise, not playful
- Duration max `1.5s` for any single transition

---

## 8. Voice & Brand

**Tone:** Direct. Architectural. Technically confident without being loud. We speak like a senior engineer who also ran a label — precise, informed, no fluff.

**Writing rules:**
- All caps in UI copy and headings
- Short sentences. No em-dashes unless necessary.
- Numbers as numerals: "3 services", not "three services"
- No exclamation marks
- No "innovative", "cutting-edge", "next-level" — show it, don't say it
- Verbs over adjectives: "We build" not "We are a builder of"

**Brand phrases:**
- "Music × Tech"
- "Digital architecture"
- "We don't build websites. We architect ecosystems."
- "Because nice matters."

**Services vocabulary:**
- Web: **Nexus**
- AI Automation: **Agentix**
- Marketing: **Growth**

---

## 9. Anti-Patterns

❌ No gradients — anywhere, ever  
❌ No border-radius above `2px` on any interactive element  
❌ No drop shadows  
❌ No mixed-case headings  
❌ No italic type  
❌ No red on white combinations  
❌ No decorative icons or emoji in UI  
❌ No AI-generated stock imagery — photography must be real client work  
❌ No "innovative" / "cutting-edge" / "disruptive" copy  
❌ No multiple accent colors — red is the only accent  
❌ No centered body text (headings may center; body is left-aligned)  
❌ No glassmorphism, blur, or frosted panels  
❌ No playful or bouncy easing curves  

---

## 10. Responsive Behavior

- Desktop (`1001px+`): Full fluid type scale, 2-column layouts, full nav
- Tablet/Mobile (`≤1000px`): Single column, hamburger/overlay nav, stacked sections
- Small phone (`≤480px`): Reduced heading scale (see Typography), tighter padding `1.25rem`
- `≤600px`: Secondary animated visuals (hand images, parallax overlays) hidden

All layouts are mobile-first in spirit — nothing breaks, everything scales.

---

## 11. Imagery

- Photography: dark, high-contrast, editorial. Real people, real sessions, real environments.
- No stock. No AI images. Client work and behind-the-scenes only.
- Image treatment: full-bleed, `object-fit: cover`, dark overlay when text sits on image
- Logo mark: red figure on dark background — never placed on light surfaces without adjustment
- Aspect ratios: landscape `16:9` for heroes, `1:1` for thumbnails/avatars, `3:4` for portrait editorial

---

## 12. Agent Prompt Guide

When generating artifacts for OHMXO:

- **Always dark background** (`#0f0f0f`) unless explicitly told otherwise
- **All text uppercase** — no exceptions in headings or UI labels
- **Humane for all headings** — scale aggressively, let type fill the screen
- **No border-radius** on cards, buttons, or inputs
- **One accent color only** — `#ff0000` for interactive elements and emphasis
- **Neue Montreal for body** — weight 500, uppercase
- **DM Mono for any code, tags, or metadata labels**
- Layouts should feel **architectural and spacious** — not cramped
- Motion should feel **precise and intentional** — expo easing, clip-path wipes
- Copy tone: **direct, technical, confident** — no fluff, no hype
- Brand is **OHMXO** (all caps) — never "Ohmxo" or "ohmxo" in UI copy
