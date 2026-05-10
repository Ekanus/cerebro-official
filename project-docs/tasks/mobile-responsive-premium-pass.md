---
name: Mobile Responsive Premium Pass
description: Comprehensive mobile/tablet responsiveness — premium identity preserved, hero animation intact, cinematic nav overlay, all sections adapted
type: project
---

## Task Name
Mobile Responsive Premium Pass — Cerebro v4.6

## Task Goal
Make the entire Cerebro website fully responsive across tablet (768–1023px) and mobile (<768px) while preserving the cinematic, animated, editorial identity. The mobile experience must feel premium and intentional — not simplified or generic.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no duplicate media query rules |

## Affected Files
- `css/style.css` — all responsive changes (primary)
- No HTML changes needed — structure is already clean
- No JS changes needed — BrainScene/FooterCluster already have IS_MOBILE guards

## Breakpoints
- Desktop: above 1024px (untouched)
- Tablet: 768–1023px (new `@media (max-width: 1024px)`)
- Mobile: below 768px (extending existing block)
- Small mobile: below 480px (extending existing block)

## Current State
The existing responsive CSS handles basic layout collapse (900px: services/products/contact 1-col, 768px: nav overlay, hero scene centering, 480px: some font overrides) but is incomplete:
- No 1024px tablet pass
- No nav open animation (just display:none/flex toggle)
- No CTA differentiation in mobile overlay
- Missing max-width removals on service-card-desc, section-intro, mission-body
- Missing spacing reductions on section-header, why-item padding
- Missing small-mobile (480px) font overrides for scenes 1, 2, and contact

## Implementation Plan

### Step 1 — CSS keyframes (before responsive section)
Add `navOverlayIn` (fade in) and `navLinkIn` (fade + slide up) keyframes used by mobile nav animation.

### Step 2 — Tablet breakpoint: `@media (max-width: 1024px)` (NEW)
- `section { padding: 6rem 0 }` — slightly reduced from desktop 8rem
- `section-header { margin-bottom: 3.5rem }` — slightly reduced
- `why-layout { gap: 4rem }` — less gap between sticky headline and grid
- `contact-layout { gap: 4rem }` — less gap between info and form

### Step 3 — Extend `@media (max-width: 900px)` (EXISTING)
- `service-card-desc { max-width: 100% }` — cards now 1-col; 380px constraint removed
- `mission-body p { max-width: 100% }` — full width body text when grid collapses
- `section-intro { max-width: 100% }` — same
- `product-card { padding: 2.25rem }` — slightly tighter for stacked cards

### Step 4 — Extend `@media (max-width: 768px)` (EXISTING)

#### Nav animation
- `.nav-links--open`: add `animation: navOverlayIn 0.32s var(--ease-out)`
- `.nav-links--open .nav-link`: add `animation: navLinkIn 0.48s var(--ease-out) both`
- Stagger via `animation-delay` on `:nth-child(1–4)` (0.04s–0.19s)
- `.nav-link--cta` in overlay: `opacity: 0.55; letter-spacing: 0.04em` — differentiated as CTA without heavy border

#### Spacing
- `section-header { margin-bottom: 2.5rem }`
- `why-item { padding: 2rem 1.5rem }` — reduces from desktop 2.5rem 2.25rem
- `hero-overline { font-size: 0.62rem; letter-spacing: 0.14em }` — slightly smaller on mobile

#### Content constraints removed
Already handled at 900px step above.

### Step 5 — Extend `@media (max-width: 480px)` (EXISTING)
- `section { padding: 4rem 0 }` — tighter than mobile 5rem
- `container { padding: 0 1.25rem }` — tighter padding on small phones
- `hero-scene--1 .hero-headline { font-size: clamp(2rem, 10vw, 3.2rem) }` — smaller than 768px override
- `hero-scene--2 .hero-headline { font-size: clamp(2rem, 10vw, 3.2rem) }`
- `hero-headline--brand { font-size: clamp(2.4rem, 12vw, 4.5rem) !important }`
- `contact-form { padding: 1.5rem }` — further reduced from 1.75rem
- `footer-body { padding: 2rem 0 1.5rem }` — tighter footer body

## What is NOT changed
- Hero animation (ScrollTrigger + GSAP scenes): works on mobile as-is
- Word-by-word reveal: works on mobile as-is
- BrainScene: already has IS_MOBILE particle reduction (280 vs 1000)
- FooterCluster: already has IS_MOBILE count reduction (45 vs 90)
- Custom cursor: already hidden on touch devices (pointer: coarse check in cursor.js)
- Desktop layout: all changes are scoped to max-width media queries

## Testing Checklist
- [ ] Desktop (1440px): no regressions — hero, footer, cards all correct
- [ ] Tablet (768–1023px): section padding reduced, gaps tighter, all readable
- [ ] Mobile (768px): nav overlay opens with smooth fade + stagger animation
- [ ] Mobile: nav links are large (1.5rem), CTA link subtly differentiated
- [ ] Mobile: hamburger button visible above overlay, closes menu on tap
- [ ] Mobile: hero scenes still animate on scroll, word reveal works
- [ ] Mobile: neural cluster visible on hero (IS_MOBILE already handled in brain.js)
- [ ] Mobile: service cards single-column, desc text full-width
- [ ] Mobile: products single-column, no overflow
- [ ] Mobile: pricing 1-column (already at 768px)
- [ ] Mobile: why-items full-width, reduced padding
- [ ] Mobile: contact form 1-column, inputs full-width
- [ ] Mobile: footer editorial, columns 2-col → 1-col at 480px
- [ ] Mobile: footer cluster visible, subtle, not covering text
- [ ] Small mobile (480px): section padding 4rem, tighter container
- [ ] Small mobile: hero scenes 1/2/brand have reduced clamp font-sizes
- [ ] No horizontal scrolling at any width
- [ ] No layout overflow at 320px
