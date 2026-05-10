---
name: Tech Stack Decision
description: Documents the technology choices for the Cerebro Software website and why each was selected
type: project
---

## Tech Stack: Cerebro Software Website

### Core Decision: Vanilla HTML/CSS/JS (No Framework)

**Why not Next.js / React:**
React adds a component abstraction layer and hydration overhead that works against animation-first sites. For a marketing/portfolio site where every millisecond of animation timing matters and where Three.js and GSAP need full control over the DOM, vanilla JS is the correct choice. No virtual DOM, no component lifecycle fighting with GSAP, no SSR complexity.

### Libraries (CDN)

| Library | Version | Purpose |
|---|---|---|
| Three.js | r128 | 3D neural brain visualization in hero |
| GSAP | 3.11.4 | All scroll-triggered animations, hero pin, section reveals |
| ScrollTrigger | 3.11.4 (GSAP plugin) | Scroll-based pinning and progress tracking |

**Why Three.js r128:** Stable version with good CDN availability. The r128 API is well-documented and doesn't require bundling.

**Why GSAP + ScrollTrigger:** Industry standard for award-winning site animations. ScrollTrigger gives us pixel-perfect scroll-to-animation mapping with scrubbing capability. Nothing else matches it for this use case.

### Animation Architecture

**Hero pin approach:**
```
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: '+=200%',
  pin: true,
  pinSpacing: true
})
```
- Hero stays fixed while user scrolls 200vh extra
- During the pin, brain transforms and headlines change
- After pin completes, normal scroll to next sections

**Brain state machine:**
- State 0 (scroll 0-35%): Full brain, gentle rotation
- State 1 (scroll 35-70%): Particles expand outward
- State 2 (scroll 70-100%): Particles contract and fade

**Section reveals:** Individual fromTo animations triggered at 85% viewport entry

### Fonts
- **Syne** (wght 400;600;700;800) — Headings, nav, brand marks. Modern, confident, slightly unusual. Perfect for an AI/tech premium brand.
- **Inter** (wght 300;400;500;600) — Body text, labels, UI elements. Clean, readable, neutral.

Loaded via Google Fonts API for simplicity. Preconnect links added for performance.

### File Structure
```
CEREBRO OFFICIAL/
├── index.html
├── css/
│   └── style.css          # Complete design system, layout, responsive
├── js/
│   ├── brain.js            # Three.js neural scene (isolated module)
│   ├── cursor.js           # Custom cursor (isolated module)
│   └── main.js             # GSAP, scroll logic, UI (orchestrator)
└── project-docs/           # Internal context docs (not served)
```

### Design System Constants
```
Palette:
  bg:         #ffffff
  text:       #0a0a0a
  muted:      #888888
  line:       rgba(10,10,10,0.08)
  featured:   #0a0a0a (inverted cards)

Typography scale:
  hero:    clamp(3.5rem, 6vw, 7.5rem) / Syne 800
  h2:      clamp(2rem, 3.5vw, 4rem) / Syne 700
  h3:      1.5rem / Syne 600
  body:    1rem / Inter 400
  small:   0.875rem / Inter 400
  eyebrow: 0.7rem uppercase ls:0.15em / Inter 500

Spacing:
  section padding: 8rem 0
  container max:   1200px
  card padding:    2.5rem
  gap-sm: 1rem, gap-md: 2rem, gap-lg: 4rem
```
