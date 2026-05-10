# Cerebro Software — GSAP Animation Patterns

## Setup

```js
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  // all animation code goes here
});
```

---

## 1. reveal() Utility — Core Scroll Reveal

This single function handles all section reveals. Copy it verbatim into every project's `main.js`.

```js
function reveal(selector, vars = {}) {
  gsap.utils.toArray(selector).forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: vars.y ?? 40 },
      {
        opacity: 1, y: 0,
        duration:  vars.duration ?? 0.80,
        delay:    (vars.stagger ?? 0) * i,
        ease:      vars.ease ?? 'power3.out',
        scrollTrigger: { trigger: el, start: vars.start ?? 'top 88%' },
      }
    );
  });
}
```

### Standard reveal calls (apply to every project):

```js
reveal('.mission-eyebrow',  { y: 20 });
reveal('.mission-headline', { y: 55, duration: 1.0 });
reveal('.mission-body',     { y: 25 });

reveal('.section-eyebrow',  { y: 20 });
reveal('.section-headline', { y: 55, duration: 1.0 });
reveal('.section-intro',    { y: 25 });
reveal('.service-card',     { stagger: 0.14, y: 50 });
reveal('.product-card',     { stagger: 0.16, y: 55, duration: 0.85 });
reveal('.pricing-intro',    { y: 25 });
reveal('.pricing-card',     { stagger: 0.10, y: 38 });
reveal('.why-headline',     { y: 60, duration: 1.0 });
reveal('.why-item',         { stagger: 0.11, y: 32 });
reveal('.contact-eyebrow',  { y: 20 });
reveal('.contact-headline', { y: 55, duration: 1.0 });
reveal('.contact-intro',    { y: 25 });
reveal('.contact-direct');
reveal('.contact-hint',     { y: 10 });
reveal('.contact-form',     { y: 45, duration: 0.9 });
reveal('.footer-statement-head', { y: 40, duration: 0.9 });
reveal('.footer-cta-link',       { y: 20 });
reveal('.footer-col',            { stagger: 0.09, y: 22 });
reveal('.footer-credits',        { y: 16 });
```

---

## 2. Nav Scroll State

Adds a blur/shadow to the nav when the user scrolls past 70px.

```js
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -70px',
  onUpdate(self) {
    nav.classList.toggle('nav--scrolled', self.progress > 0);
  },
});
```

```css
.nav--scrolled {
  background: rgba(255,255,255,0.90);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 var(--c-line);
}
```

---

## 3. Hero Entrance Timeline

Called after the preloader exits. Animates nav, overline, side labels, the first hero scene, and word spans all in a single coordinated timeline.

```js
function runHeroEntrance() {
  const words0 = Array.from(scenes[0].querySelectorAll('.hw'));
  gsap.timeline()
    .fromTo('.nav',
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
    )
    .fromTo('.hero-overline',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      '-=0.30'
    )
    .fromTo('.hero-side',
      { opacity: 0 },
      { opacity: 1, duration: 0.80, stagger: 0.08 },
      '-=0.35'
    )
    .fromTo(scenes[0],
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.80, ease: 'power3.out' },
      '-=0.45'
    )
    .fromTo(words0,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' },
      '-=0.65'
    )
    .fromTo('.hero-progress',
      { opacity: 0 },
      { opacity: 1, duration: 0.70 },
      '-=0.20'
    );
}
```

---

## 4. Scroll-Pinned Hero with Scene System

The desktop hero pins for `420%` of scroll height and advances through 4 scenes (0–3) based on scroll progress.

### Scene switching logic

```js
const scenes       = Array.from(document.querySelectorAll('.hero-scene'));
const stageCounter = document.getElementById('stageCounter');
let currentScene   = 0;

function goToScene(idx) {
  if (idx === currentScene || idx < 0 || idx >= scenes.length) return;
  const prev = scenes[currentScene];
  const next = scenes[idx];
  currentScene = idx;

  gsap.killTweensOf(scenes);
  scenes.forEach(s => gsap.killTweensOf(s.querySelectorAll('.hw')));

  // Reset idle scenes
  scenes.forEach(s => {
    if (s !== prev && s !== next) {
      gsap.set(s, { opacity: 0, y: 0 });
      gsap.set(s.querySelectorAll('.hw'), { opacity: 0, y: 12 });
    }
  });

  // Exit previous
  gsap.to(prev, {
    opacity: 0, y: -20, duration: 0.45, ease: 'power3.in',
    overwrite: true,
    onComplete: () => {
      gsap.set(prev, { y: 0 });
      gsap.set(prev.querySelectorAll('.hw'), { opacity: 0, y: 12 });
    },
  });

  // Enter next
  gsap.set(next, { opacity: 1, y: 22 });
  gsap.to(next, { y: 0, duration: 0.50, ease: 'power3.out', overwrite: true });
  const words = next.querySelectorAll('.hw');
  gsap.set(words, { opacity: 0, y: 12 });
  gsap.to(words, {
    opacity: 1, y: 0,
    duration: 0.55,
    stagger: 0.075,
    ease: 'power2.out',
    delay: 0.06,
    overwrite: true,
  });

  if (stageCounter) stageCounter.textContent = `0${idx + 1} — 04`;
}
```

### ScrollTrigger pin (desktop only via matchMedia)

```js
const mm = gsap.matchMedia();

mm.add('(min-width: 768px)', () => {
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: '+=420%',
    pin: true,
    pinSpacing: true,
    onUpdate(self) {
      const p = self.progress;
      BrainScene.setScrollProgress(p);
      const idx = p < 0.26 ? 0 : p < 0.52 ? 1 : p < 0.77 ? 2 : 3;
      goToScene(idx);
    },
  });
});

mm.add('(max-width: 767px)', () => {
  BrainScene.setScrollProgress(0);
});
```

**Critical:** The pin MUST be inside `mm.add('(min-width: 768px)')`. Never add a ScrollTrigger pin without matchMedia gating on mobile — it creates a massive blank spacer on mobile viewports.

---

## 5. Word-by-Word Reveal (.hw Technique)

HTML: wrap each word in a `<span class="hw">`:
```html
<h2 class="section-headline">
  <span class="hw">Smart</span> <span class="hw">systems</span>
  <span class="hw">for</span> <span class="hw">real</span>
  <span class="hw">businesses.</span>
</h2>
```

CSS:
```css
.hw { display: inline-block; opacity: 0; }
```

GSAP reveal:
```js
const words = el.querySelectorAll('.hw');
gsap.to(words, {
  opacity: 1, y: 0,
  duration: 0.55,
  stagger: 0.075,
  ease: 'power2.out',
});
```

For hero entrance, use `fromTo` with `{ opacity: 0, y: 12 }` as the "from" state. For scene transitions, `gsap.set(words, { opacity: 0, y: 12 })` then `gsap.to(words, {...})`.

---

## 6. Footer Wordmark Parallax (desktop only)

The large cropped CEREBRO wordmark at the bottom drifts upward as the user scrolls through the footer.

```js
if (!IS_MOBILE_INIT) {
  const wordmark = document.querySelector('.footer-wordmark');
  if (wordmark) {
    gsap.fromTo(wordmark,
      { y: 30 },
      {
        y: -20, ease: 'none',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      }
    );
  }
}
```

Gate this behind `!IS_MOBILE_INIT` — the wordmark uses a different style on mobile (cinematic crop, no parallax).

---

## 7. Mobile Panel IntersectionObserver Reveal

For the mobile hero's panels 1–3 (panel 0 is revealed by the preloader callback). Reveals eyebrow first, then words stagger, then URL.

```js
const panelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const eyebrow = entry.target.querySelector('.hm-eyebrow');
    const words   = Array.from(entry.target.querySelectorAll('.hw'));
    const url     = entry.target.querySelector('.hm-url');
    const tl = gsap.timeline();
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.40, ease: 'power2.out' });
    tl.to(words, { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' },
          eyebrow ? '-=0.22' : 0);
    if (url) tl.to(url, { opacity: 0.70, y: 0, duration: 0.38, ease: 'power2.out' }, '-=0.18');
    panelObserver.unobserve(entry.target);
  });
}, { threshold: 0.22 });

hmPanels.slice(1).forEach(p => panelObserver.observe(p));
```

Initial hidden state (set before observer runs):
```js
hmPanels.forEach(panel => {
  gsap.set(panel.querySelectorAll('.hw'), { opacity: 0, y: 16 });
});
gsap.set('.hm-overline', { opacity: 0, y: -8 });
gsap.set('.hm-meta',     { opacity: 0, y: 10 });
hmPanels.slice(1).forEach(panel => {
  const eyebrow = panel.querySelector('.hm-eyebrow');
  const url     = panel.querySelector('.hm-url');
  if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 10 });
  if (url)     gsap.set(url,     { opacity: 0, y: 10 });
});
```

---

## 8. Preloader Pattern

The preloader (`preloader.js`) is an IIFE that exposes `Preloader.run(callback)`. Call it at the end of `DOMContentLoaded` after all animations and ScrollTriggers are set up:

```js
Preloader.run(() => {
  ScrollTrigger.refresh(); // recalculate after preloader layout shift
  if (IS_MOBILE_INIT) {
    // mobile entrance animation
    const words0 = Array.from(document.querySelectorAll('.hm-panel--0 .hw'));
    gsap.timeline()
      .fromTo('.nav',       { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
      .fromTo('.hm-overline', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' }, '-=0.30')
      .to(words0, { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' }, '-=0.25')
      .to('.hm-meta', { opacity: 0.65, y: 0, duration: 0.40, ease: 'power2.out' }, '-=0.18');
  } else {
    runHeroEntrance();
  }
});
```

**Always call `ScrollTrigger.refresh()` first** — the preloader is a fixed overlay that occupies the full viewport; removing it changes the document flow and all scroll measurements must be recalculated.

Timing: preloader shows for ~2.2s on first visit (session key check), ~0.6s fade on repeat visits.
