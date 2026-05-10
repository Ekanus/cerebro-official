---
name: Refine Preloader Timing
description: Slow the preloader intro so first-visit users can experience it; keep repeat visit polished
type: project
---

## Task Name
Preloader Timing Refinement — Cerebro v4.1

## Task Goal
The current preloader completes in ~2.04s total. It feels too fast — the brand entrance, tagline, and counter flash by before the user can absorb them. Target: 2.2–2.4s total for first visit, ~0.55s for repeat visit.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | Verify preloader.js after timing changes — no duplicate or dead timing constants |

## Implementation Plan

### Timing Changes (js/preloader.js)

**Current timeline:**
- t=0.00 – logo in (0.40s)
- t=0.24 – tagline in (0.32s)
- t=0.38 – bar fade in (0.28s)
- t=0.48 – counter 0→100 (0.78s) → completes ~1.26s
- t=1.44 – slideUp (0.60s)
- t=2.04 – hero entrance starts

**New timeline (target ~2.4s total):**
- t=0.00 – logo in (0.48s)
- t=0.30 – tagline in (0.38s)   [0.48 − 0.18]
- t=0.50 – bar fade in (0.30s)   [0.68 − 0.18]
- t=0.70 – counter 0→100 (0.88s) → completes ~1.58s   [0.80 − 0.10]
- t=1.78 – slideUp (0.65s)       [1.58 + 0.20 pause]
- t=2.43 – hero entrance starts

**Repeat visit change:**
- Was: 0.35s fade, delay 0.08s
- New: 0.55s fade, delay 0.10s — still quick but not abrupt

**`prefers-reduced-motion`:** keep at 0.25s instant skip (accessibility requirement)

### Specific code changes
- `logo` to duration: `0.48`
- `tagline` to duration: `0.38`, offset: `'-=0.18'`
- `.preloader-progress-wrap` to duration: `0.30`, offset: `'-=0.18'`
- counter `duration: 0.88`, offset `'-=0.10'`
- `gsap.delayedCall(0.20, ...)` (was 0.18)
- `slideUp` duration: `0.65` (was 0.60)
- Repeat visit fade: duration `0.55`, delay `0.10`

## Testing Checklist
- [ ] First visit: preloader runs ~2.4s total, brand name readable
- [ ] Counter reaches 00 → 100 visibly (not a flash)
- [ ] Slide-up exit feels smooth, not abrupt
- [ ] Repeat visit (sessionStorage set): short but polished ~0.65s total
- [ ] `prefers-reduced-motion`: instant 0.25s skip still works
- [ ] Hero entrance starts cleanly after preloader exits (ScrollTrigger.refresh runs)
- [ ] No layout shift or FOUC on exit
