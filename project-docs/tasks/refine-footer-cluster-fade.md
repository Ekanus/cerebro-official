---
name: Refine Footer Cluster Fade
description: Replace hard rectangular canvas boundary with positional fade — exponential x-falloff + bottom bias gives organic bottom-left concentration, no hard edge
type: project
---

## Task Name
Footer Cluster Fade Refinement — Cerebro v4.5b

## Task Goal
The current cluster reads as a uniform rectangle that ends abruptly at x = 65% of footer width. Refine it into an organic atmospheric trace with:
- strongest density / opacity in the bottom-left (near/behind the CEREBRO wordmark)
- smooth exponential falloff toward the right — no hard cutoff anywhere
- very subtle diffusion into the center
- almost invisible trace toward the far right

## Root Cause Analysis
Two problems in the original implementation:

1. **Hard rectangular boundary**: `canvas.width = footer.offsetWidth * 0.65` clips the canvas.
   Particles wrap at the canvas edge so they never drift beyond 65%, creating a visible
   rectangular cutoff rather than an organic fade.

2. **Uniform spawn + uniform opacity**: `Math.random() * w` and `Math.random() * h`
   distribute particles evenly. All dots and lines draw at the same opacity regardless of
   position — no sense of concentration or diffusion.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no dead code, no residual 0.65 width reference |

## Affected Files
- `js/footer-cluster.js` — full rewrite of fade logic and canvas sizing
- `css/style.css` — no changes needed (canvas is already full-coverage positioned)

## Implementation Plan

### Change 1 — Full-width canvas (removes hard edge)
`sizeCanvas()`: change `footer.offsetWidth * 0.65` → `footer.offsetWidth`
- Canvas now covers the entire footer
- `overflow: hidden` on `.footer` clips anything outside footer bounds
- Particles can drift anywhere but become nearly invisible toward the right via fade factor

### Change 2 — Position-based exponential fade factor
Add `fadeFactor(x, y, w, h)` function:
```
fx = exp(-3.5 × (x / w))          // exponential decay left→right
fy = 0.35 + 0.65 × (y / h)        // linear rise bottom→top (bottom = stronger)
fade = fx × fy
```
Resulting distribution:
| Position              | fx    | fy    | fade  | Effective weight |
|-----------------------|-------|-------|-------|-----------------|
| bottom-left (0, h)    | 1.000 | 1.000 | 1.000 | Full            |
| bottom-center (w/2,h) | 0.174 | 1.000 | 0.174 | ~17% — subtle   |
| bottom-right (w, h)   | 0.030 | 1.000 | 0.030 | ~3% — trace     |
| top-left (0, 0)       | 1.000 | 0.350 | 0.350 | ~35% — subdued  |
| center (w/2, h/2)     | 0.174 | 0.675 | 0.117 | ~12% — ghostly  |

No position yields 0 — no hard cutoff anywhere. The rightmost trace (~3%) is imperceptible
but means the fade is mathematically continuous, not clipped.

### Change 3 — Pre-compute fade per frame (performance)
Compute `fades[i] = fadeFactor(...)` for all particles once per frame into a flat array,
then use `fades[i]` in both the O(n²) line loop and the O(n) node loop.
Skip both lines and dots when `fades[i] < 0.02` to avoid near-zero draws.
For lines: use `(fades[i] + fades[j]) * 0.5` as the pair fade — both particles must
contribute; a low-fade particle visually pulls a line toward invisibility.

### Change 4 — Biased spawn toward bottom-left
```
x = pow(rand, 2.0) × w × 0.60    // power bias: most particles spawn near left edge
y = h × 0.20 + rand × h × 0.80  // bottom-biased: particles lean toward the wordmark area
```
Initial density matches the fade curve — particles are denser where they're most visible.
As they drift rightward they fade out and return from the left edge at near-zero opacity.

## Testing Checklist
- [ ] No hard rectangular cutoff at any point — cluster diffuses smoothly to the right
- [ ] Bottom-left clearly the densest / brightest area
- [ ] Center of footer: very subtle diffusion (dots barely visible, a few faint lines)
- [ ] Right side of footer: almost invisible trace (< 5% of max brightness)
- [ ] Footer content (statement, columns, credits) readable over the cluster
- [ ] Wordmark text readable — cluster is decorative, not obstructive
- [ ] Animation stays calm — no fast particles, no flicker
- [ ] IntersectionObserver still pauses when footer is off-screen
- [ ] prefers-reduced-motion: still no animation when preferred
- [ ] No console errors
- [ ] Mobile: reduced count, same fade behavior
- [ ] Resize: re-measures correctly
