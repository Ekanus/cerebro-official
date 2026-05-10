---
name: Task 001 — Homepage Build v1
description: First complete build of the Cerebro Software homepage
type: project
---

## Task Name
Homepage Build — Cerebro Software v1

## Task Goal
Build the first production-ready version of the Cerebro Software website homepage, establishing the visual identity, interaction system, animation language, and full section structure.

## Relevant Skills Used
- `init` (post-implementation)
- `simplify` (post-implementation review)

## Constraints
- White background, black text — strictly minimal palette
- Must feel award-winning and premium, inspired by mantis.works philosophy (not a clone)
- Three.js brain visualization as the hero centerpiece
- GSAP + ScrollTrigger for scroll-based animations
- No React/Next.js — vanilla HTML/CSS/JS for maximum animation control
- Must be responsive (desktop-first, mobile-functional)
- No external back-end — static site for now
- Font delivery via Google Fonts CDN

## Implementation Plan

### Phase 1: Project-docs Setup ✅
- Create folder structure
- Write skills-used.md
- Write tech-stack decisions
- Write this task file

### Phase 2: Inspiration Analysis ✅
- Fetched and analyzed mantis.works
- Documented findings in decisions/design-analysis.md

### Phase 3: File Architecture
```
index.html            — Main HTML structure
css/style.css         — Complete design system + layout + responsive
js/brain.js           — Three.js neural brain scene
js/cursor.js          — Custom cursor with lag effect
js/main.js            — GSAP scroll animations, headline changes, UI logic
```

### Phase 4: Hero Implementation
- Three.js scene: ~800 particles in two-lobe brain shape
- Connections: ~2000 line segments between nearby particles
- Scroll pinning: hero pins for 200vh extra scroll
- Headline sequence: 3 headline transitions during pin
- Brain state changes: expand → contract → fade

### Phase 5: Sections
1. Hero (Three.js brain + scroll-pinned headlines)
2. Mission/About
3. Services (Digital Solutions + AI Automation cards)
4. Products (Invoice Sender + Mail Responder)
5. Medical Automation Packages (pricing grid)
6. Why Cerebro (4-item grid)
7. Contact (form + email copy)
8. Footer

## Design Notes
- Font: Syne 800 (headings), Inter 400/500 (body)
- Hero headline: clamp(3.5rem, 6vw, 7.5rem), Syne 800
- Section headlines: clamp(2rem, 3.5vw, 4rem), Syne 700
- Eyebrows: 0.7rem, letter-spacing: 0.15em, uppercase, color: #888
- Cards: 1px solid rgba(0,0,0,0.08) border, 2.5rem padding, hover: translateY(-4px)
- Pricing featured card: black background, white text
- Custom cursor: 8px inner dot + 40px outer ring with 10% lerp lag

## Completion Checklist — v1
- [x] Project-docs structure created
- [x] Inspiration analysis completed
- [x] Tech stack decided
- [x] index.html built (v1)
- [x] css/style.css built (v1)
- [x] js/brain.js built (v1)
- [x] js/cursor.js built (v1)
- [x] js/main.js built (v1)
- [x] All sections complete (v1)
- [x] Responsive styles added (v1)

---

## v2 Upgrade — Editorial & Cinematic Overhaul

### Goal
Elevate from "clean modern landing page" to award-winning experimental studio experience.

### Typography Change
- Replaced: Syne (too playful/startup-like)
- New: **Hanken Grotesk** (neutral geometric grotesk, close to Neue Haas spirit)
- Extreme weight contrast: 900 for headlines, tight letter-spacing (-0.04em), line-height 0.95

### Hero Redesign
4 distinct hero scenes replacing single centered headline:
- Scene 0: centered lower-third, brain centered
- Scene 1: lower-left left-aligned text, brain shifts right
- Scene 2: center-wide at maximum size, brain expanding
- Scene 3: brand ending "CEREBRO / SOFTWARE." brain faded
Each scene is a separately positioned element, GSAP crossfades between them.

### Brain Changes
- THREE.Group wrapping particles + lines (enables lateral movement)
- Camera z: 2.8 (closer = brain dominates viewport)
- Desktop particles: 1000 (from 750)
- Stage-based lateral position targets (brain moves as text changes)
- More dramatic expansion state

### Footer Redesign
Full editorial footer with:
- Large opening statement headline
- 4-column navigation (Primary / Go Deeper / Products / Start)
- Credits line with system-style separators
- Huge "CEREBRO" wordmark, partially cropped at bottom

### Side Labels
Vertical text on hero: left = "AI AUTOMATION · DIGITAL SOLUTIONS · SOFTWARE", right = stage counter "01 / 04"

### Cursor Upgrade
Magnetic effect on CTA buttons and important links

## v2 Checklist
- [x] Typography system updated to Hanken Grotesk
- [x] 4 hero scenes with distinct compositions
- [x] Brain: THREE.Group + closer camera + lateral movement
- [x] Footer: editorial redesign with wordmark
- [x] Side labels on hero
- [x] Magnetic cursor
- [ ] Browser test and iteration

---

## v3 — Preloader / Intro Experience

### Goal
Add a short, premium full-screen intro before the hero appears.

### Behavior
- Full-screen white overlay with brand mark, progress line, percentage counter
- Subtle scan-line micro-motion behind the content
- On completion: overlay slides up (yPercent: -100), revealing hero behind it
- Hero entrance timeline runs only AFTER preloader exits

### Session Logic
- First visit in session: full ~1.8s intro
- Repeat visit (same session): 0.35s quick fade via sessionStorage
- `prefers-reduced-motion`: instant 0.25s fade, no animation

### Technical Split in main.js
- ScrollTrigger.create() calls run immediately on DOMContentLoaded
- BrainScene.init() and CustomCursor.init() run immediately
- entranceTl extracted into runHeroEntrance() function
- Preloader.run(runHeroEntrance) defers hero entrance until after preloader
- ScrollTrigger.refresh() called in the callback

### New file
- `js/preloader.js` — isolated Preloader module with sessionStorage logic

## v3 Checklist
- [x] js/preloader.js created
- [x] js/main.js restructured (entrance deferred)
- [x] index.html updated (preloader HTML + script)
- [x] css/style.css updated (preloader styles)

---

## v4 — Hero Stability + Typography Fix

### Root cause of scene stacking bug
`goToScene()` had three compounding issues:
1. No `gsap.killTweensOf()` — old tweens kept running when new ones started
2. `delay: 0.18` on incoming scene — during this delay window, rapid reverse-scroll queued a second tween on the same element without killing the first
3. No `overwrite` flag — GSAP stacked multiple opacity/y tweens on the same elements
4. Exit tween leaves `y: -14` permanently — never reset, so scenes entered from wrong position on reverse

### Fix strategy
- Kill ALL scene tweens before any new animation
- `overwrite: true` on both exit and enter tweens
- Reset non-transitioning scenes immediately with `gsap.set()`
- `onComplete: gsap.set(prev, {y:0})` cleans up exit transform
- Remove the `delay:0.18` (root cause of the race condition)

### Typography fixes
- Scene 0 headline: "The brain behind smart\nsystems." (explicitly 2 lines)
- Label "AI Automation & Digital Solutions" moved out of Scene 0 to `.hero-overline` fixed at top of hero, below nav — no longer overlaps brain
- Each scene composition reviewed for clean non-conflicting layout

## v4 Checklist
- [x] goToScene() rebuilt with kill + overwrite + reset
- [x] Hero label moved to .hero-overline
- [x] Scene 0 headline fixed to 2 intended lines
- [x] CSS .hero-overline added
- [x] Entrance animation updated for .hero-overline
- [ ] Browser test and iteration
