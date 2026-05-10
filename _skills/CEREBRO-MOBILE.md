# Cerebro Software — Mobile Responsive Patterns

## Detection Strategy

Use a single constant evaluated once at DOMContentLoaded:

```js
const IS_MOBILE_INIT = window.matchMedia('(max-width: 767px)').matches;
```

Use this to gate: canvas selection, mobile hero setup, wordmark parallax, and preloader callback branch. Do NOT re-evaluate on resize — treat the initial value as fixed for the page lifetime.

For GSAP, use `gsap.matchMedia()` to create viewport-specific ScrollTriggers (see Animations doc).

---

## 1. Mobile Navigation — Full-Screen Overlay

The desktop nav links become a full-screen overlay on mobile. No separate mobile nav HTML — one nav element, CSS switches its behavior at `768px`.

### CSS

```css
@media (max-width: 768px) {
  /* Show hamburger, hide inline links */
  .nav-menu-btn { display: flex; z-index: 100; position: relative; width: 36px; height: 36px; padding: 6px; gap: 6px; }

  /* Overlay: hidden by default, fullscreen fixed when open */
  .nav-links {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 100vh;
    height: 100dvh; /* dynamic viewport height — accounts for iOS browser chrome */
    background: var(--c-bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3.5rem;
    z-index: 99;
    overflow-y: auto;
    padding-top: max(5rem, env(safe-area-inset-top));
    padding-bottom: max(3rem, env(safe-area-inset-bottom));
  }
  .nav-links--open {
    display: flex;
    animation: navOverlayIn 0.38s var(--ease-out);
  }

  /* Link styles in overlay — large display font */
  .nav-link {
    font-family: var(--ff-display);
    font-weight: 900;
    font-size: 2.25rem;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .nav-link::after { display: none; } /* remove underline hover effect */

  /* CTA becomes a bordered button in overlay */
  .nav-link--cta {
    border: 1px solid var(--c-line-strong);
    padding: 0.65rem 2.2rem;
    border-radius: 4px;
    font-family: var(--ff-body);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  /* Brand watermark at top of overlay */
  .nav-links::before {
    content: 'CEREBRO'; /* ← change to client brand name */
    position: absolute;
    top: max(1.6rem, env(safe-area-inset-top));
    left: 0; right: 0;
    text-align: center;
    font-family: var(--ff-display);
    font-weight: 900;
    font-size: 0.78rem;
    letter-spacing: 0.20em;
    color: var(--c-muted);
    opacity: 0.32;
    pointer-events: none;
  }

  /* Staggered link entrance animations */
  .nav-links--open .nav-link { animation: navLinkIn 0.48s var(--ease-out) both; }
  .nav-links--open .nav-link:nth-child(1) { animation-delay: 0.04s; }
  .nav-links--open .nav-link:nth-child(2) { animation-delay: 0.09s; }
  .nav-links--open .nav-link:nth-child(3) { animation-delay: 0.14s; }
  .nav-links--open .nav-link:nth-child(4) { animation-delay: 0.19s; }
}

@keyframes navOverlayIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes navLinkIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### JavaScript

```js
const menuBtn  = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav-links--open');
    menuBtn.classList.toggle('menu-btn--open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-links--open');
      menuBtn.classList.remove('menu-btn--open');
      document.body.style.overflow = '';
    });
  });
}
```

### Hamburger HTML

```html
<button id="menuBtn" class="nav-menu-btn" aria-label="Open menu">
  <span></span>
  <span></span>
</button>
```

```css
.nav-menu-btn { display: none; flex-direction: column; justify-content: center; gap: 5px; width: 28px; height: 28px; padding: 4px; }
.nav-menu-btn span { display: block; width: 100%; height: 1.5px; background: var(--c-text); transition: transform .28s var(--ease-out), opacity .28s; }
.menu-btn--open span:first-child { transform: translateY(6.5px) rotate(45deg); }
.menu-btn--open span:last-child  { transform: translateY(-6.5px) rotate(-45deg); }
```

**Note:** `100dvh` for the overlay height on iOS — `100vh` is the browser's full height (including collapsed chrome), which causes scroll issues when the URL bar is visible. `100dvh` adjusts as chrome shows/hides.

---

## 2. Mobile Hero — Separate HTML Section

The desktop hero (`#hero`) is a complex pinned ScrollTrigger system with a single canvas spanning the full viewport. On mobile:
- The pin creates a massive blank spacer (GSAP pin spacer = 420% scroll height)
- The canvas horizontal field-of-view clips the brain lobes in portrait orientation
- The scene system (4 overlapping absolute-positioned divs) doesn't translate to mobile scroll

**Solution:** Two separate HTML sections with CSS `display` toggling.

```css
/* Desktop: show #hero, hide mobile */
#hero { display: block; }
#heroMobile { display: none; }

/* Mobile: hide desktop, show mobile */
@media (max-width: 768px) {
  #hero { display: none; }
  #heroMobile { display: block; }
}
```

### Mobile Hero HTML Structure

```html
<section id="heroMobile" class="hero-mobile">
  <!-- Sticky canvas — stays pinned as panels scroll over it -->
  <canvas id="mobileBrainCanvas" class="mobile-brain-canvas" aria-hidden="true"></canvas>

  <!-- Panel 0 — initial view, revealed by preloader callback -->
  <div class="hm-panel hm-panel--0">
    <p class="hm-overline">AI Automation &amp; Digital Solutions</p>
    <h1 class="hm-headline">
      <span class="hw">The</span> <span class="hw">brain</span><br>
      <span class="hw">behind</span> <span class="hw">smart</span><br>
      <span class="hw">systems.</span>
    </h1>
    <div class="hm-meta">
      <span>Heraklion, Crete</span>
      <span aria-hidden="true">·</span>
      <span>cerebro.gr</span>
    </div>
  </div>

  <!-- Panels 1–3 — revealed by IntersectionObserver as user scrolls -->
  <div class="hm-panel hm-panel--1">
    <p class="hm-eyebrow">Automation Intelligence</p>
    <h1 class="hm-headline">
      <span class="hw">We</span> <span class="hw">automate</span><br>
      <span class="hw">what</span> <span class="hw">slows</span><br>
      <span class="hw">you</span> <span class="hw">down.</span>
    </h1>
  </div>

  <div class="hm-panel hm-panel--2">
    <h1 class="hm-headline">
      <span class="hw">AI</span> <span class="hw">systems</span><br>
      <span class="hw">for</span> <span class="hw">real</span><br>
      <span class="hw">businesses.</span>
    </h1>
  </div>

  <div class="hm-panel hm-panel--3">
    <h1 class="hm-headline hm-headline--brand">
      <span class="hw">CEREBRO</span><br>
      <span class="hw">SOFTWARE.</span>
    </h1>
    <p class="hm-url">cerebro.gr</p>
  </div>
</section>
```

### Sticky Canvas CSS (the key trick)

```css
.mobile-brain-canvas {
  position: sticky;
  top: 0;
  display: block;
  width: 100%;
  height: 100vh;
  height: 100svh;
  margin-bottom: -100vh;
  margin-bottom: -100svh;   /* net zero height contribution to flow */
  pointer-events: none;
  z-index: 0;
}

.hm-panel {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;           /* content anchored to bottom */
  padding: calc(var(--nav-h) + 1rem) 1.5rem 11vh;
  box-sizing: border-box;
  background: transparent;            /* MUST be transparent — panels overlay the canvas */
}
```

The negative margin trick: the canvas is `100svh` tall but contributes 0 to document flow. The panels stack normally underneath. As the user scrolls, the canvas stays sticky at top:0, making the brain appear fixed while panels scroll over it.

`background: transparent` on `.hm-panel` is critical — without it, panels inherit white from the parent and cover the canvas.

### Brain Scroll Progress Sync

```js
const heroMobile = document.getElementById('heroMobile');
if (heroMobile) {
  const syncBrain = () => {
    const rect       = heroMobile.getBoundingClientRect();
    const scrollable = heroMobile.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    BrainScene.setScrollProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
  };
  window.addEventListener('scroll', syncBrain, { passive: true });
  syncBrain();
}
```

### Mobile Brain Camera (in brain.js)

The mobile brain uses a wider FOV to prevent the lobes from being clipped in portrait:

```js
const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
const CAM_Z   = IS_MOBILE ? 3.2 : 2.8;
const CAM_FOV = IS_MOBILE ? 70  : 54;  // wider FOV = lobes stay in frame
```

At FOV=54° with portrait aspect ratio (0.562), horizontal view = ±0.92 units. Brain lobes span ±1.21 units — they'd be clipped. FOV=70° gives ±1.26 horizontal — full brain visible.

### Overline Positioning

The `.hm-overline` in panel 0 must be `position: absolute` to escape the `justify-content: flex-end` stacking (otherwise it collapses into the bottom cluster with the headline):

```css
.hm-overline {
  position: absolute;
  top: calc(var(--nav-h) + 3.5rem);
  left: 1.5rem;
  font-family: var(--ff-body);
  font-size: 0.58rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin: 0;
}
```

---

## 3. Responsive Grid Patterns

| Section | Desktop | 900px | 768px | 480px |
|---------|---------|-------|-------|-------|
| Services | 2-col | 1-col | 1-col | 1-col |
| Products | 2-col | 1-col | 1-col | 1-col |
| Pricing | 4-col | 2-col | 1-col | 1-col |
| Footer columns | 4-col | 2-col | 2-col | 1-col |
| Why grid | 2-col | 2-col | 1-col | 1-col |
| Mission | 200px + 1fr | — | 1-col | 1-col |
| Contact | 2-col | 2-col | 1-col | 1-col |
| Form row | 2-col | 2-col | 1-col | 1-col |

```css
@media (max-width: 900px) {
  .services-grid  { grid-template-columns: 1fr; }
  .products-grid  { grid-template-columns: 1fr; }
  .mission-grid   { grid-template-columns: 1fr; gap: 1.5rem; }
  .contact-layout { grid-template-columns: 1fr; gap: 3rem; }
  .footer-columns { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; }
}
@media (max-width: 768px) {
  .why-grid     { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .form-row     { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .footer-columns { grid-template-columns: 1fr; }
}
```

---

## 4. Touch Considerations

### No custom cursor on mobile

```js
// In cursor.js
if (window.matchMedia('(pointer: coarse)').matches) return; // exit early on touch devices
```

The custom cursor (the follower dot + ring) serves no purpose on touch and would appear stuck on screen.

### Larger tap targets

Mobile nav links in the overlay are `font-size: 2.25rem` — naturally large tap targets. The hamburger button is `36×36px` with `6px` padding = `48×48px` touch area (meets WCAG 2.5.5).

### Disable hover states that don't work on touch

Some CSS hover states (card lifts, link underlines) fire on touch and can feel sticky. The existing patterns use `transition` so they resolve naturally, but avoid `position: fixed` hover effects that require a second tap to dismiss.

### Scroll behavior

```css
-webkit-overflow-scrolling: touch; /* on nav overlay scroll container */
```

Add this to any `overflow-y: auto` container that users will scroll on iOS.

### Safe area insets (iOS notch / home indicator)

```css
padding-bottom: max(1.4rem, env(safe-area-inset-bottom));
padding-top: max(5rem, env(safe-area-inset-top));
```

Use `max()` so the value is the larger of the fixed rem and the safe area — this handles both notched and non-notched devices.
