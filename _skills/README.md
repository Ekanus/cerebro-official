# Cerebro Software — Skills Library

Reusable reference documents for building Cerebro client websites. Copy this `_skills/` folder into every new project and include it as context when working with Claude Code.

---

## Files in this Library

### [CEREBRO-STACK.md](CEREBRO-STACK.md)
**The full tech stack and project scaffold.**

Use when: starting a new project, setting up Vercel, wiring CDN links, choosing the file structure, or explaining to a developer why there's no framework.

Covers: Vanilla HTML/CSS/JS rationale, exact CDN URLs for Three.js r128 + GSAP 3.11.4, flat file structure, Vercel static hosting, Resend email service, font loading pattern.

---

### [CEREBRO-DESIGN-SYSTEM.md](CEREBRO-DESIGN-SYSTEM.md)
**All design tokens, typographic scale, spacing rules, and component anatomy.**

Use when: building a new section, writing CSS from scratch, adding a card or pricing table, debugging visual inconsistency, or ensuring a new page matches the existing site.

Covers: CSS custom properties (colors, fonts, easing, nav height), fluid type scale with `clamp()` values, section/card/button spacing, border radius tokens, GSAP initial hidden state selector list, component HTML patterns (section header, service card, pricing card).

---

### [CEREBRO-ANIMATIONS.md](CEREBRO-ANIMATIONS.md)
**Every reusable GSAP animation pattern with full copy-paste code.**

Use when: adding scroll reveals to a new section, wiring up a hero entrance, building a pinned hero, adding word-by-word reveals, or implementing the preloader callback.

Covers: `reveal()` utility function (full code + all standard calls), nav scroll state, hero entrance timeline, scroll-pinned multi-scene hero, `.hw` word reveal technique, footer wordmark parallax, mobile panel IntersectionObserver reveals, preloader callback timing.

---

### [CEREBRO-CONTACT-FORM.md](CEREBRO-CONTACT-FORM.md)
**Complete working contact form: HTML → serverless function → email delivery.**

Use when: adding a contact form to any Cerebro site, troubleshooting form submissions, customizing fields or recipients, or onboarding a client to Resend.

Covers: HTML markup with correct `name` attributes, `api/contact.js` (Resend via native fetch, HTML escaping, error handling), `main.js` async submit handler with loading/success/error states, `vercel.json`, environment variable setup, customization checklist, local vs. deployed testing notes.

---

### [CEREBRO-MOBILE.md](CEREBRO-MOBILE.md)
**Mobile-specific patterns: nav, hero, canvas, grids, and touch.**

Use when: building the mobile version of a new site, fixing mobile layout bugs, implementing the mobile nav overlay, or adapting the brain canvas for portrait orientation.

Covers: `IS_MOBILE_INIT` detection pattern, full-screen nav overlay (CSS + JS + hamburger), separate mobile hero section (`#heroMobile`) with sticky canvas technique, brain camera FOV fix for portrait, `.hm-overline` absolute positioning fix, responsive grid breakpoints table, touch considerations (no cursor, tap target sizes, safe area insets).

---

## How to Use with Claude Code

When starting a new client project, say:

> "We're building a new Cerebro client site. Read the files in `_skills/` for context on our stack, design system, and patterns."

Or reference a specific skill for a focused task:

> "Use the pattern in `_skills/CEREBRO-CONTACT-FORM.md` to add a contact form to this project."
> "Follow `_skills/CEREBRO-ANIMATIONS.md` — add the standard reveal() calls to main.js."
> "Match the design tokens in `_skills/CEREBRO-DESIGN-SYSTEM.md` for this new pricing section."

---

## New Project Checklist

1. Copy `_skills/` into the project root
2. Create `index.html` — use CDN links from `CEREBRO-STACK.md`
3. Create `style.css` — paste design tokens from `CEREBRO-DESIGN-SYSTEM.md`
4. Create `main.js` — include `reveal()` from `CEREBRO-ANIMATIONS.md`
5. Copy `preloader.js`, `brain.js`, `cursor.js`, `footer-cluster.js` from a reference project
6. Create `api/contact.js` from `CEREBRO-CONTACT-FORM.md`
7. Create `vercel.json` (3 lines — see `CEREBRO-STACK.md`)
8. Add `RESEND_API_KEY` to Vercel environment variables
9. Verify domain in Resend dashboard, update `from:` in `api/contact.js`
10. Deploy to Vercel, test form, check mobile breakpoints

---

## Key Decisions (Why, Not Just What)

| Decision | Reason |
|----------|--------|
| No framework | Zero build tooling, no dependency rot, fastest Vercel cold-start |
| Flat file structure | Simpler `<script src="main.js">` paths, no confusion |
| GSAP matchMedia pin gating | Mobile gets a massive blank spacer from pin spacer without it |
| Separate `#heroMobile` section | Pin + portrait FOV + scene system all break on mobile |
| `background: transparent` on `.hm-panel` | Panels inherit white and cover the sticky canvas without it |
| `position: absolute` on `.hm-overline` | Panel uses `justify-content: flex-end`; flex child collapses to bottom |
| `CAM_FOV: 70` on mobile brain | Portrait aspect (0.562) clips lobes at FOV=54; 70° gives clearance |
| `100dvh` for nav overlay | `100vh` doesn't shrink on iOS when browser chrome is visible |
| `100svh` for hero panels | Small viewport height — stable reference that doesn't jump |
| Native `fetch` in serverless | No npm packages needed, no `package.json`, simpler deploy |
