---
name: Rebuild Mobile Cinematic Experience
description: Full mobile layer rebuild — cinematic scroll hero, premium nav overlay, editorial footer, no desktop regression
type: project
---

## Task Name
Rebuild Mobile Cinematic Experience — Cerebro v4.8

## Current Mobile Problems

| Problem | Root Cause |
|---|---|
| Hero feels static — no scroll scene transitions | v4.7 removed all ScrollTrigger on mobile; matchMedia block only resets state, never creates new ScrollTrigger |
| Neural cluster appears as a cut-off banner | CAM_Z = 3.8 on mobile is too far; brain appears small in tall portrait viewport. Also `height: 100svh` CSS override can diverge from `window.innerHeight` used by renderer |
| Blank white hero space | Scenes start `opacity: 0` (CSS); without scroll-driven progress they stay invisible |
| No word-by-word reveal during scene transitions | No `goToScene()` calls on mobile since no `onUpdate` fires |
| Mobile menu feels cramped/footer-like | Gap too tight (2.2rem), link font too small (1.5rem), CTA not differentiated from nav links |
| Mobile footer not editorial | Footer credits wrapping awkwardly, wordmark size inconsistent, statement head too large for some mobile widths |
| Canvas/renderer size mismatch on iOS | `onResize` uses `window.innerWidth/Height`; `hero` has `height: 100svh` — they diverge as Safari toolbar shows/hides |

## Affected Files

- `js/main.js` — restore mobile ScrollTrigger with `end: '+=300%'`
- `js/brain.js` — CAM_Z from 3.8 → 3.2; canvas-based resize dimensions
- `css/style.css` — full rebuild of 768px and 480px responsive blocks
- `index.html` — no changes needed

## Root Cause Summary

v4.7 correctly removed the problematic desktop pin from mobile but went too far — it left mobile with zero scroll-driven animation. The "blank hero" bug was caused by invisible scenes (opacity:0 initial state), not the pin-spacer itself. The pin-spacer provides the scroll travel distance for scene transitions and IS correct behavior. The fix is to restore the pinned ScrollTrigger on mobile with a shorter travel distance (`+=300%`), while also improving the visual composition.

## Implementation Plan

### Fix 1 — main.js: restore mobile ScrollTrigger
- Replace static mobile matchMedia block with `ScrollTrigger.create({ end: '+=300%', pin: true })`
- Same `onUpdate` scene logic as desktop
- Desktop: `+=420%` (unchanged), Mobile: `+=300%`
- gsap.matchMedia auto-kills contained ScrollTriggers on resize

### Fix 2 — brain.js: closer camera + canvas-aware resize
- `CAM_Z: IS_MOBILE ? 3.8 → 3.2` — brain ~19% larger on mobile
- `onResize` + `init`: use `canvas.offsetWidth/Height` as primary dimension source
  so renderer stays in sync with actual CSS canvas size

### Fix 3 — style.css 768px block rebuild
Nav overlay:
- `gap: 2.2rem → 3.5rem` — more breathing room
- Nav links: `1.5rem → 2.25rem`, `weight 800 → 900`, `letter-spacing -0.03em`
- Remove `::after` underline pseudo in overlay (hover effect irrelevant on touch)
- CTA differentiated as small technical button: `0.82rem`, uppercase, border, not muted

Hero composition:
- Remove `.hero { height: 100svh }` — conflicts with GSAP pin calculations
- Overline: `top: calc(var(--nav-h) + 1.5rem)` — closer to nav, above brain bulk
- Scenes: `bottom: 8vh → 10vh` — gives brain more visible breathing room above text
- Headline sizes: slightly larger floor (`2.8rem` for scenes 1/2)
- Hide `.hero-scene-sub` on mobile — declutters scene 2

Footer:
- Statement padding: `3rem → 3.5rem`
- Statement head: `7.5vw` (slightly smaller max)
- Credits: tighter gap

### Fix 4 — style.css 480px block rebuild
- Unified headline size for scenes 0/1/2: `clamp(2.2rem, 11vw, 3.8rem)`
- Brand scene: `clamp(2.8rem, 13vw, 4.5rem)`
- Footer wordmark: `34vw → 28vw` — less aggressive crop on small screens

## Desktop Preservation Checklist

- [ ] Desktop `@media (min-width: 768px)` ScrollTrigger untouched: `end: '+=420%'`
- [ ] Desktop hero scenes: positions, sizes, scene logic unchanged
- [ ] Desktop nav: overlay not visible (`display: none` of `.nav-menu-btn` on desktop)
- [ ] Desktop footer: all desktop CSS rules unmodified
- [ ] All changes scoped to `@media (max-width: 768px)` and `(max-width: 480px)`
- [ ] gsap.matchMedia context correctly gates each breakpoint

## Testing Checklist

- [ ] iPhone SE (375×667): hero visible on first load, no blank white area
- [ ] iPhone SE: brain cluster visible, centered, large enough to feel dramatic
- [ ] iPhone SE: overline visible below nav
- [ ] iPhone SE: word-by-word reveal fires on Scene 0 after preloader
- [ ] iPhone SE: scroll past hero → Scene 1 transitions correctly
- [ ] iPhone SE: all 4 scenes transition with word reveal
- [ ] iPhone SE: no horizontal overflow
- [ ] iPhone SE: nav overlay opens fullscreen, links large and spaced
- [ ] iPhone SE: nav CTA clearly differentiated as action button
- [ ] iPhone SE: footer statement readable, wordmark editorial
- [ ] iPhone SE: footer columns stack cleanly
- [ ] iPhone 12/13: same as SE checks
- [ ] Desktop 1440px: pinned 4-scene hero unchanged
- [ ] Desktop: scroll through all 4 scenes, word reveal works
- [ ] Desktop: footer unchanged
- [ ] Resize mobile→desktop: pin-spacer added, hero re-pins
- [ ] Resize desktop→mobile: pin-spacer removed, mobile ScrollTrigger activates
