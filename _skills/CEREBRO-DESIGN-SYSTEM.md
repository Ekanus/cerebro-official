# Cerebro Software — Design System

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Palette */
  --c-bg:           #ffffff;
  --c-text:         #0a0a0a;
  --c-muted:        #888888;
  --c-muted-light:  #bbbbbb;
  --c-line:         rgba(10, 10, 10, 0.07);
  --c-line-strong:  rgba(10, 10, 10, 0.13);

  /* Typography */
  --ff-display: 'Hanken Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --ff-body:    'Inter', system-ui, sans-serif;

  /* Layout */
  --container: 1200px;
  --nav-h:     76px;   /* 62px on mobile (≤768px) */

  /* Easing */
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--c-bg` | `#ffffff` | Page background, card fills |
| `--c-text` | `#0a0a0a` | All body text, headings |
| `--c-muted` | `#888888` | Eyebrows, labels, secondary text |
| `--c-muted-light` | `#bbbbbb` | Very subtle labels, credits |
| `--c-line` | `rgba(10,10,10,0.07)` | Dividers, card borders (light) |
| `--c-line-strong` | `rgba(10,10,10,0.13)` | Form inputs, card borders (normal) |
| Footer bg | `var(--c-text)` = `#0a0a0a` | Dark footer section |
| Footer text | `rgba(255,255,255,0.85)` | White on dark |

Body text on light sections uses `#444` or `#555` for paragraphs (slightly softer than `--c-text`).

## Typographic Scale

All fluid — use `clamp(min, preferred-vw, max)`.

| Level | CSS | Value |
|-------|-----|-------|
| Hero headline (scene 0) | `.hero-headline` | `clamp(3rem, 6vw, 7.2rem)` |
| Hero headline (scenes 1–2) | `.hero-headline` | `clamp(3.2rem, 6.8vw, 8.5rem)` |
| Brand ending | `.hero-headline--brand` | `clamp(3.8rem, 8.5vw, 10.5rem)` |
| Section headline (h2) | `.section-headline` | `clamp(2rem, 3.8vw, 4.25rem)` |
| Card title (h3) | `.service-card-title` | `clamp(1.4rem, 2vw, 1.75rem)` |
| Mission headline | `.mission-headline` | `clamp(1.75rem, 2.8vw, 3.25rem)` |
| Eyebrow / label | `.section-eyebrow` | `0.68rem`, weight 500, `letter-spacing: 0.17em`, uppercase |
| Body | `p` | `0.93rem–1rem`, `line-height: 1.72` |
| Small / credit | captions | `0.72rem` |

### Eyebrow pattern (used above every major section headline)

```html
<p class="section-eyebrow">Services</p>
<h2 class="section-headline">What we build</h2>
```

```css
.section-eyebrow {
  font-family: var(--ff-body);
  font-weight: 500;
  font-size: 0.68rem;
  letter-spacing: 0.17em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin-bottom: 1rem;
}
```

### Word reveal spans (.hw technique)

For animated word-by-word reveals, wrap each word in a span:
```html
<h1 class="hero-headline">
  <span class="hw">The</span> <span class="hw">brain</span>
  <span class="hw">behind</span>
</h1>
```

```css
.hw { display: inline-block; opacity: 0; }
```

Opacity starts at 0 in CSS to prevent a flash before GSAP runs. GSAP animates each span in via `stagger`.

## Spacing System

| Context | Value |
|---------|-------|
| Section vertical padding | `8rem 0` (desktop), `5rem 0` (768px), `4rem 0` (480px) |
| Container horizontal padding | `2.5rem` (desktop), `1.5rem` (768px), `1.25rem` (480px) |
| Section header `margin-bottom` | `4rem` (desktop), `2.5rem` (768px), `2rem` (480px) |
| Card padding | `3rem` (service), `2.75rem` (product), `2.25rem` (pricing) |
| Grid gap (2-col) | `1.5rem` (services), `2rem` (products), `1.25rem` (pricing) |
| Nav height | `76px` (desktop), `62px` (mobile) |

## Border Radius

| Element | Value |
|---------|-------|
| Cards (service, product, pricing) | `10px` |
| Buttons | `8px` |
| Form inputs / textarea / select | `8px` |
| Tags / badges | `4px` (rectangular), `20px` (pill) |
| Scrollbar thumb | `3px` |

## Animation Tokens

Standard reveal (used for almost all section elements):
- `opacity: 0 → 1`
- `y: 40 → 0` (headlines: `y: 55`, small items: `y: 20–25`)
- `duration: 0.80s`
- `ease: power3.out`
- `scrollTrigger: { start: 'top 88%' }`

Stagger values by element type:
| Elements | Stagger |
|----------|---------|
| Service cards | `0.14s` |
| Product cards | `0.16s` |
| Pricing cards | `0.10s` |
| Why items | `0.11s` |
| Footer cols | `0.09s` |
| Word spans (.hw) | `0.075–0.09s` |

## Breakpoints

| Breakpoint | Value | Purpose |
|------------|-------|---------|
| Tablet | `1024px` | Reduced section padding, layout tweaks |
| Medium | `900px` | Single-column mission, services, products, contact |
| Mobile nav | `768px` | Mobile nav overlay, mobile hero switch, `--nav-h: 62px` |
| Small mobile | `480px` | Smaller type scale, single-column footer |

## Component Anatomy

### Section Header
```html
<div class="section-header">
  <p class="section-eyebrow">Label</p>
  <h2 class="section-headline">Main headline</h2>
  <p class="section-intro">Intro paragraph...</p>
</div>
```

### Service Card
```html
<div class="service-card">
  <span class="service-card-index">01</span>
  <h3 class="service-card-title">Title</h3>
  <p class="service-card-desc">Description</p>
  <ul class="service-list">
    <li>Feature</li>
  </ul>
  <a href="#" class="card-link">Learn more <span class="arrow">→</span></a>
</div>
```

### Pricing Card
```html
<div class="pricing-card">
  <p class="pricing-tier">Tier Name</p>
  <div class="pricing-price">
    <span class="price-main">€999</span>
    <span class="price-per">/mo</span>
  </div>
  <p class="pricing-setup">+ €X setup</p>
  <ul class="pricing-features">
    <li>Feature</li>
  </ul>
  <a href="#contact" class="btn btn--outline btn--full">Get started</a>
</div>
```

Add class `pricing-card--featured` + `<span class="pricing-badge">Most popular</span>` for the highlighted tier.

## GSAP Initial Hidden State

Add these selectors to the CSS opacity:0 block so elements don't flash before GSAP runs:

```css
.nav,
.hero-side,
.hero-scene,
.hero-progress,
.mission-eyebrow, .mission-headline, .mission-body,
.section-eyebrow, .section-headline, .section-intro,
.pricing-intro, .service-card, .product-card,
.pricing-card, .why-headline, .why-item,
.contact-eyebrow, .contact-headline, .contact-intro,
.contact-direct, .contact-hint, .contact-form,
.footer-statement-head, .footer-cta-link,
.footer-col, .footer-credits {
  opacity: 0;
}
```

Also: `.hw { display: inline-block; opacity: 0; }` — words start hidden via CSS, GSAP reveals them.
