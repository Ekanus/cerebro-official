---
name: Fix Mobile Hero and Menu
description: Fix pin-spacer blank hero on mobile using gsap.matchMedia; fix nav overlay clipping with 100dvh + safe-area padding
type: project
---

## Task Name
Mobile Hero + Menu Fix — Cerebro v4.7

## Task Goal
Fix two specific mobile bugs without touching the desktop experience:
1. Mobile hero shows a huge blank white area due to desktop pin-spacer being applied on all viewports
2. Mobile nav overlay clips content on short screens (iPhone SE) due to `inset:0` + no overflow handling

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no dead code in matchMedia callback |

## Affected Files
- `js/main.js` — replace unconditional hero pin with `gsap.matchMedia()` desktop-only gate
- `css/style.css` — fix `.nav-links` overlay height/overflow; add `.hero` mobile height

## Root Cause Analysis

### Bug 1 — Hero pin-spacer on mobile
`ScrollTrigger.create({ pin: true, end: '+=420%' })` runs unconditionally for all viewports.
GSAP inserts a `.pin-spacer` element with `padding-bottom = 420% of hero height`.
On iPhone SE (667px): `420% × 667px = 2800px` of empty scroll space is injected.
Additionally, all `.hero-scene` elements start at `opacity: 0` (CSS initial state for GSAP).
If `ScrollTrigger.refresh()` — called after the preloader exits — miscalculates positions
in the pinned context, scenes can remain invisible, producing a large blank white area.

### Bug 2 — Nav overlay clipping on short screens
`.nav-links` at 768px uses `position: fixed; inset: 0` which sets `bottom: 0`.
On iOS Safari, `bottom: 0` anchors to the visual viewport boundary including the
tab-bar chrome, clipping the bottom of the overlay content.
`100vh` on iOS Safari includes the browser chrome height, so the overlay is actually
taller than the visible area when chrome is shown. No `overflow-y` means content
that overflows the visible area is silently clipped.

## Implementation Plan

### Fix 1 — main.js: gate pinned hero to desktop only

Replace the unconditional `ScrollTrigger.create({ pin: true, ... })` call with
`gsap.matchMedia().add('(min-width: 768px)', callback)`.

Desktop (≥768px):
- Exact same pinned 4-scene hero as before — zero regression
- ScrollTrigger with `pin: true, pinSpacing: true, end: '+=420%'`
- `goToScene()` and `BrainScene.setScrollProgress()` driven by `onUpdate`

Mobile (<768px):
- No pin, no pin-spacer, no ScrollTrigger created for hero
- `BrainScene.setScrollProgress(0)` called once — brain stays in idle/scene-0 state
- Scene 0 is shown via `runHeroEntrance()` (unchanged — fires from Preloader.run callback)
- Scenes 1–3 are explicitly set to `opacity: 0, y: 0` to prevent any stale state
- `currentScene = 0` reset for cleanliness
- Hero is a normal full-height section that scrolls naturally with page
- Word-by-word reveal on scene 0 still fires via `runHeroEntrance()`
- Brain cluster still animates (IS_MOBILE reduces particle count, camera z = 3.8)

### Fix 2 — style.css: nav overlay + hero height

Nav overlay (in `@media (max-width: 768px)` block):
- Replace `inset: 0` with `top: 0; left: 0; right: 0`
- Change `height` from implicit (via inset bottom:0) to explicit:
  `height: 100vh; height: 100dvh;` — `100dvh` is the dynamic viewport height
  which excludes the collapsing browser chrome. Falls back to `100vh` gracefully.
- Add `overflow-y: auto; -webkit-overflow-scrolling: touch` — if links exceed
  available height (e.g. landscape on iPhone SE), the overlay scrolls instead of clipping
- Add `padding-top: max(2rem, env(safe-area-inset-top))` — respects notch
- Add `padding-bottom: max(2rem, env(safe-area-inset-bottom))` — respects home indicator

Hero height (in `@media (max-width: 768px)` block):
- Add `.hero { height: 100vh; height: 100svh; }` — `100svh` is the small viewport
  height (fixed, excludes dynamic chrome). This ensures the hero never extends
  below the visible area on mobile browsers. Falls back to `100vh` if unsupported.

## Testing Checklist
- [ ] iPhone SE (375×667): no blank hero on initial load
- [ ] iPhone SE: hero shows nav + overline + brain cluster + scene-0 headline
- [ ] iPhone SE: scroll past hero reaches content directly (no 2800px empty space)
- [ ] iPhone SE: brain cluster visible, not cut off
- [ ] iPhone SE: no horizontal overflow
- [ ] iPhone SE: word-by-word reveal fires on scene 0 after preloader
- [ ] iPhone SE: nav menu opens with animation
- [ ] iPhone SE: nav menu content not clipped at bottom
- [ ] iPhone SE: nav menu closes when link tapped
- [ ] iPhone SE (landscape): nav menu scrollable if links exceed height
- [ ] iPhone 12/13: hero premium and visible
- [ ] iPhone 12/13: nav menu works correctly
- [ ] Desktop 1440px: pinned 4-scene hero still works exactly as before
- [ ] Desktop: scroll through all 4 scenes correctly
- [ ] Desktop: word-by-word reveal on all scenes
- [ ] Desktop: footer still works
- [ ] Desktop: all section reveals still fire
- [ ] Resize from desktop to mobile: pin-spacer removed, hero returns to normal height
- [ ] Resize from mobile to desktop: pin-spacer added, hero re-pins correctly
