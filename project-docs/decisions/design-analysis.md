---
name: Design Analysis — mantis.works Inspiration
description: Key findings from the mantis.works analysis and how they translate to the Cerebro brand
type: project
---

## What Makes mantis.works Feel Award-Winning

1. **Confident restraint** — animations are minimal and purposeful, not decorative
2. **Narrative-first structure** — emotional positioning before credentials before services
3. **Progressive revelation** — context builds as you scroll, never dumps everything at once
4. **White space as luxury** — generous gaps signal premium positioning
5. **Friction reduction** — copy-to-clipboard emails, expandable cards, multiple contact paths
6. **Unified metaphorical language** — one conceptual framework ties all copy together

## What to Translate into Cerebro

| mantis.works Pattern | Cerebro Adaptation |
|---|---|
| Progressive narrative scroll | Hero pin: brain transforms + headline changes |
| White space abundance | 8rem section padding, generous line-height |
| Minimal purposeful animation | GSAP reveals: subtle Y offset + opacity only |
| Eyebrow labels before headlines | Section eyebrows: uppercase, muted, small |
| Email copy-to-clipboard | Contact section: click email → "Copied!" |
| Social proof woven in | "Why Cerebro" section with concrete reasons |
| Navigation top-right, minimal | Fixed nav: logo left, links right |
| Sensory/conceptual theme | "brain / intelligence / systems" metaphor throughout |

## What NOT to Copy

- Their specific "we create feelings" / nervous system language
- Their NYC context (time, location, weather)
- Their three-tier service structure naming
- Their specific card layout patterns
- Their color accent choices (keep Cerebro as pure black/white)

## Cerebro's Original Creative Concept

**Central metaphor:** Cerebro = the brain. Everything connects to this.
- The product is the brain. The client's business is the body.
- AI automation = neural signals executing automatically
- Digital solutions = the visible face the world sees
- The hero object IS a brain — a wireframe neural structure

**Headline progression during hero scroll:**
1. "The brain behind smart systems."
2. "AI automation for real businesses."
3. "Digital solutions that transform."
4. "Cerebro Software."

**Copy voice:**
- Confident, not arrogant
- Direct, not jargon-heavy
- Greek market aware, but language in English for premium feel
- Specific and concrete (never "cutting-edge solutions")

## Navigation Concept
- Top-left: "CEREBRO" logotype in Syne 700, letter-spacing
- Top-right: Services · Products · About · Contact (CTA)
- Hover: underline slides in from left
- Scrolled state: subtle backdrop blur, slight shadow

## Cursor Concept
- Inner: 8px solid dark circle
- Outer: 40px transparent ring with 1px border
- Lag: outer follows mouse at 10% lerp per frame
- Hover state: inner expands to 12px, outer expands to 60px
- Disabled on touch devices

## Section Flow

```
Hero (pinned, ~300vh scroll)
  └── Brain neural object (Three.js)
  └── Headline progression (4 states)

Mission
  └── "We identify the problems that cost you time. Then we eliminate them."

Services (2 cards)
  └── Digital Solutions
  └── AI Automation

Products (2 cards)
  └── Invoice Sender v4.4
  └── Mail Responder v4.2

Medical Packages (4 pricing cards)
  └── Starter / Essential / Pro / Premium

Why Cerebro (4 items)

Contact
  └── Form + copy-to-clipboard email

Footer
```
