---
name: Refine Services Cards Spacing
description: Fix service card gap, breathing, and CTA baseline alignment in the "What we offer" section
type: project
---

## Task Name
Services Section Card Refinement — Cerebro v4.5

## Task Goal
Remove the awkward center seam/notch created by touching rounded cards, add a clean gap between the two service panels, improve internal breathing, and pin both CTA links to the same baseline.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no duplicate gap/margin/flex declarations |

## Affected Files
- `css/style.css` — all 3 fixes (no HTML or JS changes needed)

## Current State (v4.4)
The `.services-grid` uses a CSS "hairline border via background" technique:
```css
.services-grid {
  background: var(--c-line-strong);
  gap: 1px;
  border: 1px solid var(--c-line-strong);
}
```
This worked for sharp-cornered cards but the v4.4 `border-radius: 10px` on `.service-card` creates a visible seam/notch where the two rounded corners meet at the 1px center gap.

Cards also have no flex column layout, so CTA links float at different vertical positions depending on text length.

## Root Cause
The 1px hairline technique collapses cards together. With radius, the corner arcs of adjacent cards create a concave notch at the join point. Only a real gap solves it — rounded corners require separation to read as distinct panels.

## Implementation Plan

### FIX 1 — Real gap between cards
**Change `.services-grid`:**
- Remove `background: var(--c-line-strong)` — no longer needed; each card has its own border
- Remove `border: 1px solid var(--c-line-strong)` — no longer needed
- Change `gap: 1px` → `gap: 1.5rem` (24px) — clean separation, reads as two distinct panels

### FIX 2 — Card breathing
**Change `.service-card`:**
- Add `display: flex; flex-direction: column` — required for CTA pinning (FIX 3)
- Change `padding: 3rem 2.75rem` → `padding: 3rem 3rem` — even padding on all sides; slightly more open feel now that cards are separated

### FIX 3 — CTA baseline alignment
**Change `.service-list`:**
- `margin-bottom: 2.5rem` → `margin-bottom: 0` — spacing handled by card-link padding-top instead

**Change `.card-link`:**
- Add `margin-top: auto` — in flex column, absorbs all remaining vertical space, pins CTA to card bottom
- Add `padding-top: 2rem` — consistent visual gap from last list item regardless of card height

## Testing Checklist
- [ ] No center seam or notch between cards
- [ ] 24px visual gap clearly visible between cards
- [ ] Both cards same height (grid stretch default)
- [ ] "Start a project" and "Explore automation" on exactly the same horizontal baseline
- [ ] Cards feel like two distinct premium panels, not one divided block
- [ ] Internal padding feels balanced and open
- [ ] Hover background still works correctly
- [ ] Mobile (900px breakpoint) stacks to single column — verify gap becomes vertical spacing between stacked cards
- [ ] No regression on border-radius appearance
