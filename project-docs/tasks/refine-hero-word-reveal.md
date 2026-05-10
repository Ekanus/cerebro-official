---
name: Refine Hero Word Reveal
description: Word-by-word staggered animation for all four hero scenes, integrated with scene stability system
type: project
---

## Task Name
Hero Word-by-Word Reveal — Cerebro v4.2

## Task Goal
Hero headlines build progressively word by word when a scene becomes active, creating a sense of narrative unfolding. Each word enters with opacity + y + subtle blur, staggered at 75ms per word. The existing stability system (killTweensOf, overwrite) is extended to cover word animations, preventing any overlap or stacking.

## Relevant Skills

| Skill | Relevance |
|---|---|
| `simplify` | After confirming the word system works, check for any animation dead code or redundant GSAP calls |

## Implementation Plan

### HTML Changes (index.html)
Wrap each word in `<span class="hw">` (headline word). Preserve `<br>` tags exactly.

Scene 0: `The brain behind smart<br>systems.`
→ `<span class="hw">The</span> <span class="hw">brain</span> <span class="hw">behind</span> <span class="hw">smart</span><br><span class="hw">systems.</span>`

Scene 1: `We automate<br>what slows<br>you down.`
→ each word wrapped

Scene 2: `AI systems for<br>real businesses.`
→ each word wrapped

Scene 3: `CEREBRO<br>SOFTWARE.`
→ each word wrapped

### CSS Changes (style.css)
```css
.hw {
  display: inline-block;  /* required for transform-based animation to work on inline text */
}
```
No initial `opacity: 0` in CSS — GSAP sets this via `gsap.set()` before animating.
Parent `.hero-scene { opacity: 0 }` hides all words before GSAP runs (prevents FOUC).

### JS Changes (main.js)

**goToScene() — updated logic:**
1. `gsap.killTweensOf(scenes)` — as before
2. NEW: `scenes.forEach(s => gsap.killTweensOf(s.querySelectorAll('.hw')))` — kills word animations too
3. Reset non-transitioning scenes: `gsap.set(s, { opacity:0, y:0 })` + `gsap.set(.hw, { opacity:0, y:12 })`
4. Exit (prev): fade whole container out as before. `onComplete`: reset prev's words → `gsap.set(.hw, {opacity:0, y:12})`
5. Enter (next): `gsap.set(next, {opacity:1, y:22})` then `gsap.to(next, {y:0, duration:0.50})`, then stagger words:
   ```javascript
   gsap.set(words, { opacity: 0, y: 14 });
   gsap.to(words, { opacity: 1, y: 0, filter:'blur(0px)', duration: 0.55,
     stagger: 0.075, ease: 'power2.out', delay: 0.06, overwrite: true });
   ```

**runHeroEntrance() — extended:**
- Scene 0 now shows as before (scene slides in)
- After the slide-in tween, words stagger in with:
  ```javascript
  .fromTo(words0,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' },
    '-=0.65'  // words start just as scene is arriving
  )
  ```

### Why this is stable
- `gsap.killTweensOf(.hw)` prevents stale word tweens from running after scene switches
- `gsap.set(.hw, {opacity:0, y:12})` in exit `onComplete` + in reset loop ensures words are always in correct initial state before next activation
- `overwrite: true` on all word enter tweens prevents any stacking if timing is very rapid
- The parent scene container is always set/reset explicitly before word tweens fire

## Testing Checklist
- [ ] Scene 0 words reveal on first load (entrance TL)
- [ ] Scene 1 words reveal when scrolling forward
- [ ] Scene 2 words reveal when scrolling forward
- [ ] Scene 3 words reveal when scrolling forward
- [ ] On rapid scroll: no word overlap or stacking from previous scenes
- [ ] On reverse scroll (scene 1 → scene 0): scene 0 words reveal cleanly
- [ ] On reverse scroll (scene 2 → scene 0): scene 0 words reveal cleanly (not stuck at opacity:0)
- [ ] Word timing feels readable — user can follow each word as it appears
- [ ] No FOUC before GSAP runs (parent scene opacity:0 covers initial state)
