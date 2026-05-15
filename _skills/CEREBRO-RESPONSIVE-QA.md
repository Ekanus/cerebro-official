# CEREBRO RESPONSIVE QA SKILL

This skill defines how all Cerebro websites must handle desktop, tablet, and mobile layouts.

---

## Core Principle

No feature, section, component, animation, or text change is complete unless it works correctly on desktop, tablet, and mobile.

---

## Breakpoints

| Name | Range |
|------|-------|
| Desktop | above 1024px |
| Tablet | 768px – 1024px |
| Mobile | below 768px |
| Small mobile | below 480px |
| Extra small check | around 390px |

---

## General Rules

- Do not build desktop-only sections.
- Every new section must include responsive behavior from the beginning.
- Do not rely on one generic mobile rule for complex sections.
- Use section-specific mobile layouts when needed.
- Preserve desktop when making mobile changes.
- Mobile fixes must be scoped to media queries.
- Avoid horizontal overflow.
- Avoid text clipping.
- Avoid oversized typography on mobile.
- Avoid excessive vertical gaps.
- Avoid elements touching screen edges.
- Use safe spacing and readable line-height.
- Use `clamp()` for fluid typography.
- Use responsive grids.
- Use larger tap targets on mobile.
- Hide custom cursor on mobile.
- Avoid hover-only interactions on mobile.
- Heavy animations must be simplified or adapted on mobile.
- Scroll pinned animations require dedicated mobile logic.
- Never assume desktop composition works directly on mobile.

---

## For Each New Section or Component

Before coding, explicitly define:

- Desktop layout
- Tablet layout
- Mobile layout
- Small mobile behavior
- Typography scaling
- Spacing scaling
- Grid behavior
- Animation behavior
- What gets hidden, stacked, centered, left-aligned, or simplified
- How overflow is prevented

Document these decisions before writing CSS.

---

## Hero and Animation Rules

- Preserve the approved desktop hero unless a desktop change is explicitly requested.
- Mobile hero may need scene-by-scene layout planning.
- Brain/canvas animations must stay inside the viewport on mobile.
- Do not tune canvas size randomly with repeated magic numbers.
- Prefer controlled constants for mobile fit and scale.
- If using GSAP ScrollTrigger, define separate desktop and mobile behavior when needed.
- Always verify pinned sections on real mobile or Vercel production/preview.
- Check `100vh` / `100svh` behavior carefully across devices.

---

## Typography Rules

- Use `clamp()` for all key typographic values.
- Keep headings readable but not oversized on mobile.
- Match desktop visual hierarchy proportionally, not literally.
- Do not let important words break awkwardly across lines.
- Use controlled line breaks when necessary.
- Check Greek text separately — it is typically longer than English and may need additional adjustments.

---

## Grid and Card Rules

- Desktop multi-column grids should stack or reduce columns on mobile.
- Cards need appropriate padding on mobile.
- Buttons and CTAs must remain visible and tappable at all sizes.
- Forms must become single-column on mobile.

---

## Required Responsive QA Checklist

Complete this checklist after every visual task:

- [ ] Desktop checked
- [ ] Tablet checked
- [ ] Mobile checked
- [ ] Small mobile checked
- [ ] No horizontal scroll
- [ ] No clipped text
- [ ] No hidden CTA
- [ ] No broken animation
- [ ] No oversized mobile text
- [ ] No layout shift issues
- [ ] Desktop unchanged (if task was mobile-only)
- [ ] Mobile unchanged (if task was desktop-only)

---

## Required Report After Every Responsive Task

After completing any responsive task, provide a structured report covering:

| Item | Detail |
|------|--------|
| Files changed | — |
| Desktop behavior | — |
| Tablet behavior | — |
| Mobile behavior | — |
| Small mobile behavior | — |
| Risk areas | — |
| What was intentionally not changed | — |
