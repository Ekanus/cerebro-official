---
name: Add Subtle Footer Neural Cluster
description: Lightweight 2D canvas neural cluster in footer bottom-left — white nodes/lines on dark background, slow drift, independent of hero brain
type: project
---

## Task Name
Footer Neural Cluster — Cerebro v4.5

## Task Goal
Add a quiet neural-trace background detail to the footer bottom-left area. It should feel like an atmospheric AI nervous-system imprint — barely-there, premium, and atmospheric — not a second hero. It connects the footer visually back to the Cerebro brain concept without competing with content.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no duplicate CSS, no dead code in footer-cluster.js |

## Affected Files
- `js/footer-cluster.js` — new file, self-contained 2D canvas module
- `index.html` — add canvas element inside footer, add script tag
- `css/style.css` — add `position: relative; isolation: isolate` to `.footer`, add canvas positioning

## Architecture Decision
**Pure 2D Canvas API — not Three.js.** Reasons:
- Three.js would require a full WebGL renderer init — overkill for a subtle background detail
- 2D canvas is ~10× lighter for this use case
- Stays completely independent from BrainScene's WebGL context, scene graph, and RAF loop
- No risk of GPU context limits being hit by running two WebGL renderers simultaneously
- No shared variables, no shared state, no conflicts

## Current Footer Stack
```
.footer (background: #0a0a0a, overflow: hidden)
  └── .footer-statement
  └── .footer-divider
  └── .footer-body (columns + credits)
  └── .footer-wordmark-wrap (large cropped wordmark)
```

## Implementation Plan

### HTML (index.html)
1. Add `<canvas id="footerClusterCanvas" aria-hidden="true"></canvas>` as first child of `<footer class="footer">`
2. Add `<script src="js/footer-cluster.js"></script>` before `brain.js` in script order

### CSS (style.css)
1. `.footer` — add `position: relative; isolation: isolate;`
   - `position: relative` makes `.footer` the containing block for the absolute canvas
   - `isolation: isolate` creates a new stacking context so `z-index: -1` on the canvas
     stays inside the footer (doesn't escape below the page background)
2. `#footerClusterCanvas` — `position: absolute; left: 0; top: 0; pointer-events: none; z-index: -1; display: block;`
   - `z-index: -1` places canvas above footer's own background (#0a0a0a) but below all non-positioned footer content
   - `pointer-events: none` ensures all footer links and cursor behavior work normally

### JS (footer-cluster.js)
- Self-contained IIFE module, calls `init()` on `DOMContentLoaded`
- Canvas covers the left 65% of footer width, full footer height
- **Particles:** 85 desktop / 40 mobile
- **Connect distance:** 95px desktop / 70px mobile
- **Node size:** 0.9–2.2px radius
- **Node opacity:** 0.10–0.26 per particle (random, set on spawn)
- **Line max opacity:** `0.06 × breathe_factor` — very dim
- **Drift speed:** max 0.15 px/frame — imperceptibly slow
- **Breathing:** `0.80 + sin(time * 0.55) * 0.13` on line opacity — subtle pulse
- **IntersectionObserver:** pause RAF when footer not intersecting viewport (threshold: 0.01)
- **prefers-reduced-motion:** skip init entirely if reduced motion preferred
- **Resize:** re-measure footer, re-scatter particles if size changed

## Stacking Context Note
`isolation: isolate` is the correct tool here. It creates a stacking context on `.footer`
without assigning a specific z-index to the footer itself (which could interfere with
page-level stacking of other sections). The canvas's `z-index: -1` is then scoped to the
footer's stacking context — it renders between `.footer`'s background color and its
non-positioned children.

## Testing Checklist
- [ ] Cluster visible as subtle white dots/lines on dark footer
- [ ] Content (statement, columns, credits, wordmark text) all readable — not obscured
- [ ] Particles animate very slowly — calm, not chaotic
- [ ] Footer cursor invert (cursor--light) still fires correctly when entering footer
- [ ] Canvas has pointer-events: none — all footer links remain clickable
- [ ] IntersectionObserver pauses animation when footer is off-screen
- [ ] prefers-reduced-motion: canvas not rendered when user prefers reduced motion
- [ ] No console errors
- [ ] No flash or jump on page load
- [ ] Hero cluster (brain.js) unaffected — completely separate canvas/context/RAF
- [ ] ScrollTrigger behavior unaffected — no shared state
- [ ] Mobile: reduced particle count, still visible but lighter
- [ ] Resize: canvas re-measures correctly
