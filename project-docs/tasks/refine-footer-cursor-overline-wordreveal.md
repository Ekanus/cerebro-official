---
name: Refine Footer, Cursor, Overline, Word Reveal
description: 5 focused refinements — cursor light mode on footer, overline position, wordmark visibility, footer spacing, word reveal CSS fix
type: project
---

## Task Name
Five-Fix Refinement Pass — Cerebro v4.3

## Task Goal
Targeted polish across cursor behavior, hero overline placement, footer wordmark legibility, footer editorial spacing, and word-by-word reveal CSS correctness.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Applied first — fixed 3 issues: lerpPositions skip when expandT=0, y-offset consistency in goToScene resets, cursor MutationObserver stays as-is (static site, no real DOM churn) |

### simplify findings addressed before this task
1. **brain.js** — skip `lerpPositions()` when `expandT === 0` (Scene 0–1 range): saves ~3000 float operations per frame
2. **main.js** — unify word reset `y` value from `y:14`/`y:12` inconsistency to `y:12` everywhere
3. **MutationObserver** — left intact; `dataset` guards prevent double-binding; static site has no real DOM churn post-load

## Affected Files
- `css/style.css` — cursor light mode, overline position, wordmark opacity, footer spacing, .hw initial state
- `js/cursor.js` — footer mouseenter/leave adds `cursor--light` class

## Implementation Plan

### FIX 1 — Cursor light mode on footer
**cursor.js**: In `init()`, after `bindHoverTargets()`:
```javascript
const footer = document.querySelector('.footer');
if (footer) {
  footer.addEventListener('mouseenter', () => cursorEl.classList.add('cursor--light'));
  footer.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor--light'));
}
```
**css/style.css** — add after `.cursor--hidden` rules:
```css
.cursor--light .cursor-inner { background: #fff; }
.cursor--light .cursor-outer { border-color: rgba(255,255,255,0.45); }
```
No `transition` needed — cursor styles already have `transition` on inner/outer for the hover state change.

### FIX 2 — Hero overline lower
`top: calc(var(--nav-h) + 1.8rem)` → `top: calc(var(--nav-h) + 3.2rem)`
Moves it ~1.4rem further down — still above the cluster, more visually grounded.

### FIX 3 — Footer wordmark more visible
`color: rgba(255,255,255,0.06)` → `color: rgba(255,255,255,0.11)`
Just enough to register as a deliberate presence, not enough to compete with the columns.

### FIX 4 — Footer spacing polish
- `.footer-statement` padding: `6rem 0 4rem` → `6rem 0 5rem` (more air before columns divider)
- `.footer-statement-head` margin-bottom: `2.5rem` → `3.2rem` (more gap between headline and CTA email)
- `.footer-body` padding: `4rem 0 3rem` → `4.5rem 0 3.5rem` (balanced breathing inside columns)

### FIX 5 — Word-by-word reveal CSS correctness
Add `.hw { opacity: 0; }` to the CSS rule (in hero typography section after the `display: inline-block`).
This ensures words start hidden at CSS level — belt-and-suspenders against flash before GSAP initialises the FROM state. The existing JS word animation in `goToScene` and `runHeroEntrance` handles the reveal.

## Testing Checklist
- [ ] Custom cursor visible (white dots) when moving over dark footer
- [ ] Cursor returns to normal (dark) when leaving footer
- [ ] Cursor light mode works over footer links and empty black space
- [ ] Hero overline "AI Automation & Digital Solutions" is lower and feels grounded
- [ ] Footer wordmark is slightly more legible but still a background element
- [ ] Footer statement has more breathing room before the email CTA
- [ ] Footer columns feel more spacious
- [ ] Hero Scene 0 words reveal staggered on first load (not all at once)
- [ ] Scene 1, 2, 3 words reveal staggered on scroll forward
- [ ] Reverse scroll: words reveal cleanly when returning to previous scenes
- [ ] No hero scene overlap or stacking bug
