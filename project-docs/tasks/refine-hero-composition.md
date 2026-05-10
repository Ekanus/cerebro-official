---
name: Refine Hero Composition
description: Visual quality pass on Scene 0 typography, neural object expressiveness, and scroll pacing
type: project
---

## Task Name
Hero Composition Refinement — Cerebro v4.1

## Task Goal
The v4 stability fix succeeded but left the hero feeling safer and flatter than v2. This task restores visual impact, pacing, and sculptural quality without reintroducing the stacking bug.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | After all changes: review that no dead CSS rules remain from v2 overrides |
| `init` | After composition is stable: regenerate CLAUDE.md with updated brain.js and scene system |

### Why these skills influence execution
- `simplify`: The CSS has accumulated overrides across v1→v4. Composition changes may leave dead rules. Run after this pass to prune.
- `init`: Brain.js state machine and goToScene() are now stable enough to document in CLAUDE.md for future sessions.

## Implementation Plan

### Scene 0 Typography Fix

**Problem:** "The brain behind smart" (22 chars) wraps inside the container at `width: min(900px, 90vw)` at most viewport sizes, creating 3 lines despite the explicit `<br>` after "smart".

**Solution:** Apply `white-space: nowrap` directly to the Scene 0 `.hero-headline`. Remove the width constraint from `.hero-scene--0` — the nowrap headline sets its own width, and `left: 50%; transform: translateX(-50%)` centers it perfectly. The `<br>` is the only permitted break.

**CSS changes:**
- `.hero-scene--0`: remove `width: min(900px, 90vw)`, change `bottom: 11vh → 13vh`
- `.hero-scene--0 .hero-headline`: add `white-space: nowrap`, keep `clamp(3.5rem, 7vw, 8.5rem)`, increase `margin-bottom: 2rem → 2.4rem`
- `.hero-overline`: `top: calc(var(--nav-h) + 1.8rem)` (was 2.5rem) — closer to nav, less floating
- Mobile override: add `white-space: normal` at ≤768px breakpoint

### Neural Object Visual Quality

**Problem:** Too uniform, too gentle, reads as a generic network rather than a brain.

**Changes to js/brain.js:**
- Particle opacity: `0.55 → 0.65` — more presence
- Particle size: `0.022 → 0.026` desktop — more visible nodes
- Line opacity: `0.10 → 0.13` — more visible connections
- Connection distance: `0.42 → 0.45` — denser network in the core
- Breathing amplitude: `0.013 → 0.022` — more visible organic pulse
- Rotation speed: `time * 0.25 → time * 0.28` — slightly more alive
- Z wobble: `0.04 → 0.06` — more natural 3D drift
- Lobe gap: from `abs(px) < 0.06, rand > 0.35` to `abs(px) < 0.10, rand > 0.25` — cleaner sulcus between lobes, more recognizable brain shape
- Expansion scale: `1.5 + rand * 0.5` → `1.6 + rand * 0.65` — more dramatic scatter state

### Scroll Pacing

**Problem:** Scenes change too quickly. Not enough dwell time per scene.

**Change to js/main.js:**
- Hero pin: `end: '+=300%' → '+=420%'` — 40% more scroll, each scene gets ~105vh of dwell time
- Scene exit transition: `duration 0.32 → 0.45`, `ease power2.in → power3.in`, `y -14 → -20`
- Scene enter transition: `duration 0.44 → 0.65`, `ease power2.out → power3.out`, `y 18 → 22`

## Testing Checklist
- [ ] Scene 0 shows exactly 2 lines at 1440px, 1280px, 1920px
- [ ] Scene 0 shows exactly 2 lines at 768px (mobile with white-space: normal)
- [ ] Brain feels more distinctive — two-lobe shape is clearly recognizable
- [ ] Brain breathing is visible on first load
- [ ] Scroll through all 4 scenes — each stays visible long enough to read
- [ ] Reverse scroll — no scene stacking (v4 stability preserved)
- [ ] Transitions feel cinematic — smoother in/out than before
- [ ] No layout regression in sections below hero
