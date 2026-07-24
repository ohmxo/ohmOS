# Brand Asset Requirements Checklist — OHMXO Identity

> Generated from: DESIGN.md, Ohmxo_Knowledge_Base.md, Works.csv, CV, ohmxo.com/studio, ryOS codebase audit

**Status key:** ✅ HAVE | ⚠️ PARTIAL | ❌ NEED FROM YOU | 🔲 NOT APPLICABLE

---

## 1. REQUIRED NOW — OHMXO Identity Foundation

These are needed to complete the basic branding pass and make the OS feel like yours.

### Logo Files

| Item | Status | Details |
|------|--------|---------|
| Full logo (horizontal, SVG) | ⚠️ PARTIAL | `ohmxo-nav-logo.svg` downloaded from ohmxo.com — red "OHMXO" text on transparent. Works for nav but is just text. |
| Logo mark / icon (SVG) | ❌ NEED | The `ohmxo-mark-light.svg` and `ohmxo-mark-dark.svg` I created are placeholder "O" in a box. You need a real brand mark. |
| Logo — light background variant | ❌ NEED | Needed for apple-touch-icon, favicon, light-mode contexts |
| Logo — dark background variant | ⚠️ PARTIAL | nav-icon.png works for dark, but need SVG |
| Logo — favicon (32×32, 16×16, ICO) | ⚠️ PARTIAL | `favicon-32.png` created from nav-icon, but it's a nav-icon crop. A proper favicon designed for 32×32 readability would be better. |
| Logo — apple-touch-icon (180×180) | ⚠️ PARTIAL | Created from site-icon.png, but same caveat — proper design preferred |
| Logo — OG social share image (1200×630) | ❌ NEED | `index.html` references `ohmxo.com/icons/mac-512.png` for OG image — a proper social share card would be better |

**What I need from you:** Your actual brand mark/icon SVG (the "O" or whatever the OHMXO mark is, not just Helvetica text). If you have a brand guidelines PDF or a Figma file with the logo, that's ideal.

### Brand Colors

| Item | Status | Details |
|------|--------|---------|
| Primary accent color | ✅ HAVE | `#ff0000` (OHMXO Red) — documented in DESIGN.md |
| Background color | ✅ HAVE | `#0f0f0f` (near-black) |
| Surface colors | ✅ HAVE | `#1a1a1a` (cards), `#2a2a2a` (borders) |
| Text colors | ✅ HAVE | `#ffffff` (primary), `#888888` (muted) |
| Color usage rules | ✅ HAVE | DESIGN.md section 2 — "No gradients, no red on white, flat opaque" |

### Fonts / Typefaces

| Item | Status | Details |
|------|--------|---------|
| Display typeface | ❌ NEED | DESIGN.md specifies **Humane** for headings — but this is a commercial font. Need to know if you own it or want an alternative. |
| Body typeface | ❌ NEED | **Neue Montreal** for body text — also commercial. Need a substitute or license. |
| Mono typeface | ❌ NEED | **DM Mono** — available on Google Fonts (free), but confirm |
| Type scale | ✅ HAVE | DESIGN.md section 3 has full fluid scale |
| OS UI font override | ❌ NEED | For the ryOS theme system, we need to decide what font the OS chrome uses. Currently: Lucida Grande, Chicago, MS Sans Serif. |

**What I need from you:** Which fonts you actually have access to / want to use. Humane and Neue Montreal are commercial — alternatives would be something like Uncut Sans, Inter, or similar open-source options.

### Brand Voice & Copy

| Item | Status | Details |
|------|--------|---------|
| Tagline | ✅ HAVE | "Music × Tech" / "Digital architecture" / "We don't build websites. We architect ecosystems." |
| Site description | ✅ HAVE | "Digital architecture for artists, brands, and creative enterprises." |
| About copy | ✅ HAVE | Ohmxo_Knowledge_Base.md + DESIGN.md + ohmxo.com/studio |
| Tone guidelines | ✅ HAVE | DESIGN.md section 8 — "Direct. Architectural. Technically confident." |
| Writing rules | ✅ HAVE | All caps, no exclamation marks, no "innovative", verbs over adjectives |

### Founder / Identity

| Item | Status | Details |
|------|--------|---------|
| Full name | ✅ HAVE | Jacob Adeshiyan |
| Title | ⚠️ PARTIAL | CV says "Founder & Creative Director — GNRE". DESIGN.md says "Jacob / Founder". What title do you want in the OS? |
| Email | ✅ HAVE | `jacob@ohmxo.com` (from DESIGN.md) or `jacob.shiyan@icloud.com` (CV) |
| Phone | ✅ HAVE | `+44 7544 351579` |
| Location | ✅ HAVE | London, UK |
| Personal website | ✅ HAVE | `thegnre.com` (CV) |
| Agency website | ✅ HAVE | `ohmxo.com` |
| Social links | ⚠️ PARTIAL | CV mentions `x.com/ohmxo`? From contacts.ts had `x.com/ryolu_`. Need your actual social links. |

**What I need from you:** Your preferred title in the OS (e.g., "Founder, OHMXO" vs "Creative Director"), and your actual social links (Twitter/X, LinkedIn, Instagram, etc.)

### Legal / Footer

| Item | Status | Details |
|------|--------|---------|
| Copyright line | ✅ HAVE | "© Jacob Adeshiyan. 2024-{current year}" — already set |
| Privacy policy URL | ❌ NEED | Currently links to `os.ryo.lu/docs/privacy` — do you have one? Or keep default? |
| Terms of service URL | ❌ NEED | Same — currently `os.ryo.lu/docs/terms` |
| AGPL license notice | ⚠️ PARTIAL | ryOS is AGPL-3.0. We need to decide how to disclose this on the live site. |

---

## 2. NEEDED LATER — Themes, Portfolio OS, Studio App, AI

### Wallpapers & Visual Identity

| Item | Status | Details |
|------|--------|---------|
| Default wallpaper | ❌ NEED | Currently Aqua abstract-7.jpg. Need a OHMXO-branded wallpaper or chosen photo. |
| Desktop background style | ❌ NEED | Dark minimal? OHMXO pattern? Tile? Photo? |
| Boot screen background | ❌ NEED | Currently uses theme-specific splash images (Aqua blue, Windows boot) |
| Login screen background | ❌ NEED | If auth is kept |

### App Icons & OS Branding

| Item | Status | Details |
|------|--------|---------|
| System app icons (Finder, Trash, etc.) | ❌ NEED | Currently use ryOS per-theme icon sets (macosx/, win98/, xp/, default/) |
| Custom app icons for music apps | ❌ NEED | iPod, Synth, Winamp, Karaoke, Soundboard — could get OHMXO-styled icons |
| Dock icon set | ❌ NEED | Currently ryOS defaults |
| Loading / splash screen imagery | ❌ NEED | Currently uses `hello.svg`, `macos.svg`, `xp-boot.gif`, `win98.gif` |
| Error state illustrations | ❌ NEED | Currently plain text |

### Portfolio / Case Study Assets

| Item | Status | Details |
|------|--------|---------|
| Campaign data (Works.csv) | ✅ HAVE | 6 campaigns with stream counts, views, followers |
| Campaign images | ❌ NEED | Works.csv has Framer URLs for images/videos — but these may not load outside the ohmxo.com domain |
| Campaign videos | ❌ NEED | Same — Framerusercontent URLs may be hotlink-protected |
| Client logos | ❌ NEED | For the Studio app or portfolio section |
| Studio page content | ✅ HAVE | From ohmxo.com/studio — disciplines, team cards, clients |
| Testimonials | ❌ NEED | CV mentions references (Andy Parker, Lee Graves) — if you want quotes |

### AI Assistant / Personality

| Item | Status | Details |
|------|--------|---------|
| Assistant name | ❌ NEED | Currently "Ryo" — needs a new name. "Jacob"? "OHMXO Assistant"? Something else? |
| Assistant personality | ❌ NEED | Currently "thoughtful, helpful, can code, explain features" — what should the OHMXO assistant be? |
| Assistant avatar | ❌ NEED | Currently Clippy/Office Assistant characters. Should this be replaced with something OHMXO? |
| System prompt | ❌ NEED | Multiple places reference "Ryo" as the AI persona. Needs a rewrite for OHMXO context. |
| Voice / TTS setting | ❌ NEED | If ElevenLabs is configured, what voice? |

### Service Vocabulary

| Item | Status | Details |
|------|--------|---------|
| Agentix | ✅ HAVE | AI Automation — "Workflow Automation, Smart Chatbots, Data Analysis" |
| Nexus | ✅ HAVE | Web Design — "Dynamic digital experiences, Framer, Next.js" |
| Growth | ✅ HAVE | Digital Marketing — "Meta, TikTok, Google Ads" |

---

## 3. NICE-TO-HAVE — Premium Polish

| Item | Status | Notes |
|------|--------|-------|
| Animated logo / loading animation | ❌ NEED | Boot screen could have a red O mark animation |
| Custom cursor | ❌ NEED | DESIGN.md mentions "custom red cursor (28px), mix-blend-mode: difference" |
| Branded 404 page | ❌ NEED | Currently generic |
| Branded error states | ❌ NEED | Crash dialog, IE error page, etc. |
| Branded notification sounds | ❌ NEED | Boot sound, error sounds, notification — currently use ryOS sounds |
| PWA icons / splash screens | ❌ NEED | Need OHMXO-branded PWA manifest icons |
| Social media preview cards | ❌ NEED | OG image for Twitter/Facebook when sharing the OS URL |
| Email templates | ❌ NEED | If account recovery is enabled |
| Print / PDF assets | ❌ NEED | CV, case studies, proposals |
| Dark/light mode wallpaper sets | ❌ NEED | Different wallpapers for dark vs light mode |
| Seasonal / event wallpapers | ❌ NEED | Optional |

---

## Summary: What I Actually Need From You

### Before proceeding with Phase 1.5 (branding cleanup):

1. **Your actual brand mark SVG** — the OHMXO logo mark, not a text placeholder
2. **Your social links** — Twitter/X, LinkedIn, Instagram, GitHub (whatever you want shown)
3. **Your preferred title** — "Founder, OHMXO" / "Creative Director" / "Digital Architect" — whatever goes in the OS
4. **Privacy & terms URLs** — do you have them, or do we keep the default docs?

### Before Phase 2 (themes, wallpaper, Studio app):

5. **Font decision** — Humane/Neue Montreal are commercial. Want alternatives? Or do you have licenses?
6. **Default wallpaper** — a photo or design you want as the OS background
7. **App icon preferences** — keep the retro icons or replace with OHMXO-styled ones?
8. **Campaign media** — do you have local copies of the campaign images/videos, or do the Framer URLs work?
9. **AI assistant name** — what should the assistant be called?
10. **Assistant personality** — what should the AI know and be able to do when someone asks it questions?