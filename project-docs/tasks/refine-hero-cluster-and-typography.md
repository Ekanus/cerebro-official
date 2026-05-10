---
name: Refine Hero Cluster and Typography
description: Circular particles, mouse hover interaction, slower rotation, reduced headline sizes
type: project
---

## Task Name
Hero Cluster & Typography Refinement — Cerebro v4.2

## Task Goal
Elevate the neural object from generic to distinctive and alive. Particles become soft circular dots. A subtle mouse lean + local repulsion effect makes the brain responsive to the user's presence. Rotation is calmed. Headline sizes are reduced for better composition balance.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: check that makeCircleTexture and displayPositions don't leave dead code |
| `init` | Now that brain.js is stable and distinctive, worth documenting in CLAUDE.md |

### How skills influence execution
- `simplify`: The displayPositions/currentPositions split adds a layer. After confirming it works, ensure no stale references to currentPositions remain in the geometry attribute.
- `init`: Brain.js interaction model (lean + local repulsion + displayPositions) should be documented so future sessions don't break the architecture.

## Implementation Plan

### Circular Particles
- Add `makeCircleTexture()` — draws a white radial gradient on a 64×64 canvas, returns `THREE.CanvasTexture`
- `PointsMaterial.map = makeCircleTexture()`, `alphaTest: 0.05` (clips transparent edge artifacts)
- `color: 0x0a0a0a` × white texture = dark circular dots
- Increase `size`: `0.022 → 0.040` desktop, `0.030 → 0.048` mobile (soft edge visually shrinks apparent size)

### Mouse Hover Interaction (two-layer)
**Layer 1 — Global lean (always active):**
- Track normalized mouse position on `window.mousemove`
- Smooth with 0.025 lerp factor each frame
- Add `smoothLeanX * 0.30` to rotY, `smoothLeanY * 0.20` to rotX
- Effect: brain gently turns to face the cursor — organic, alive

**Layer 2 — Local repulsion (canvas only):**
- Track mouse on canvas in approximate world space (project screen UV to world XY at z=0 via camera FOV)
- Each frame: per-particle distance from projected mouse in local space
- Within `INFL_R = 0.50` world units: apply outward push `f = (1 - d/R)² × 0.09`
- Write to `displayPositions` (not `currentPositions` — keeps lerp animation unaffected)
- Outside canvas: `displayPositions.set(currentPositions)` — no effect

### Slower Rotation
- `rotY = time * 0.28` → `time * 0.16` — 43% slower, calm and controlled

### Headline Size Reduction (~15–20% smaller)
```
Scene 0:  clamp(3.5rem,  7.0vw,  8.5rem) → clamp(3.0rem,  6.0vw,  7.2rem)
Scene 1:  clamp(4.0rem,  8.5vw, 10.5rem) → clamp(3.2rem,  6.8vw,  8.5rem)
Scene 2:  clamp(4.5rem,  9.5vw, 12.5rem) → clamp(3.5rem,  7.8vw,  9.8rem)
Scene 3:  clamp(4.5rem, 10.0vw, 13.0rem) → clamp(3.8rem,  8.5vw, 10.5rem)
```
- Global line-height: `0.94 → 0.95` (fractionally more breathing room)
- Scene 1/2 line-height: `0.92/0.91 → 0.93`

## Testing Checklist
- [ ] Particles appear as soft circles, not squares
- [ ] Mouse moving over the canvas creates visible (but subtle) local particle ripple
- [ ] Mouse moving anywhere on page creates gentle brain lean toward cursor
- [ ] Rotation is noticeably calmer than before
- [ ] Headline sizes feel more balanced at 1440px, 1280px
- [ ] Scene 0 headline still renders on exactly 2 lines (white-space: nowrap preserved)
- [ ] No performance regression (RAF stays smooth, displayPositions copy is fast)
