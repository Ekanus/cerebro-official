---
name: Refine Footer, Cards, Cursor, Overline
description: Six-fix polish pass — compact footer, border radius on cards/forms/buttons, cursor light on footer, overline position, wordmark visibility
type: project
---

## Task Name
Six-Fix Polish Pass — Cerebro v4.4

## Task Goal
Targeted refinement pass: tighten the footer into a complete editorial closing frame, add subtle premium radius across all cards/forms/buttons, and confirm cursor + overline + wordmark state from v4.3.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Post-pass: verify no duplicate border-radius declarations after adding radius to cards |

## Affected Files
- `css/style.css` — all 6 fixes

## Current State (from v4.3)
- cursor--light on footer: ✅ already done
- overline at `calc(var(--nav-h) + 3.2rem)`: needs to go lower (user asking again)
- wordmark at `rgba(255,255,255,0.11)`: needs slightly more
- footer padding: was INCREASED in v4.3 — now must be REDUCED significantly

## Implementation Plan

### FIX 1 — Cursor light (confirm)
Already done in v4.3: `cursor--light` on `.footer`. No changes needed.

### FIX 2 — Overline slightly lower
`top: calc(var(--nav-h) + 3.2rem)` → `calc(var(--nav-h) + 4.5rem)`
More clearly separated from the nav bar, better grounded in the hero composition.

### FIX 3 — Wordmark more visible
`rgba(255,255,255,0.11)` → `rgba(255,255,255,0.14)`
Marginally more presence. Still background, not competing with columns.

### FIX 4 — Footer compact (target: fits ~700–750px viewport)

Before (v4.3 state):                     After:
footer-statement padding: 6rem/5rem  →  3.5rem/3rem
footer-statement-head margin: 3.2rem  →  1.8rem
footer-body padding: 4.5rem/3.5rem   →  2.8rem/2rem
footer-columns margin/padding-b: 3.5rem →  2rem
footer-wordmark-wrap font-size: 19vw  →  16vw
footer-wordmark-wrap margin-top: 1rem →  0.5rem
Mobile footer-statement: 4rem/3rem   →  3rem/2rem
Mobile wordmark: 28vw                →  24vw

### FIX 5 — Footer micro-polish
- `.footer-col gap: .85rem` → `.7rem`
- `.footer-col-label margin-bottom: .5rem` → `.35rem`
- `.footer-cta-link font-size: 1.1rem` → `1rem` (slightly more restrained)

### FIX 6 — Border radius (premium + subtle)
```
.service-card:     border-radius: 10px  (+ add border: 1px solid var(--c-line) so radius is visible)
.product-card:     border-radius: 10px
.pricing-card:     border-radius: 10px
.contact-form:     border-radius: 10px
.btn:              border-radius: 8px   (was 2px)
.form-input:       border-radius: 8px   (was 2px)
.product-version:  border-radius: 4px   (was 2px)
.product-tag:      border-radius: 4px   (was 2px)
.pricing-badge:    keep 20px (pill, intentional)
```
No oversized pill corners. No "SaaS rounded" look. Just enough to soften rigidity.

## Testing Checklist
- [ ] Cursor switches to white dots/ring when entering the dark footer
- [ ] Cursor returns to dark when leaving footer
- [ ] Hero overline is visibly lower and feels more connected to hero composition
- [ ] Footer wordmark is subtly more legible
- [ ] Footer fits in ~750px viewport height as a complete frame
- [ ] Footer statement, columns, credits, wordmark all visible without extra scroll
- [ ] Service, product, pricing cards all have 10px radius
- [ ] Contact form has 10px radius
- [ ] Buttons have 8px radius
- [ ] Form inputs have 8px radius
- [ ] Product tags and version badges have 4px radius
- [ ] No regression on hero scroll behavior
- [ ] No FOUC on word reveal
