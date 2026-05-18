document.addEventListener('DOMContentLoaded', () => {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  gsap.registerPlugin(ScrollTrigger);

  // ── Early init — independent of preloader ────────────────────────────────
  const IS_MOBILE_INIT = window.matchMedia('(max-width: 767px)').matches;
  const brainCanvas = document.getElementById('brainCanvas');
  if (brainCanvas) BrainScene.init(brainCanvas);
  CustomCursor.init();

  // ── Hero scene system ────────────────────────────────────────────────────
  const scenes       = Array.from(document.querySelectorAll('.hero-scene'));
  const stageCounter = document.getElementById('stageCounter');
  let currentScene   = 0;

  function goToScene(idx) {
    if (idx < 0 || idx >= scenes.length) return;
    if (idx === currentScene) {
      // Even if same scene, ensure all others are hidden
      scenes.forEach((s, i) => {
        if (i !== idx) {
          gsap.set(s, { opacity: 0, y: 0 });
          gsap.set(s.querySelectorAll('.hw'), { opacity: 0, y: 12 });
        }
      });
      return;
    }
    const prev = scenes[currentScene];
    const next = scenes[idx];
    currentScene = idx;

    // Kill tweens on scene containers AND their word children
    gsap.killTweensOf(scenes);
    scenes.forEach(s => gsap.killTweensOf(s.querySelectorAll('.hw')));

    // Reset all non-transitioning scenes and their words
    scenes.forEach(s => {
      if (s !== prev && s !== next) {
        gsap.set(s, { opacity: 0, y: 0 });
        gsap.set(s.querySelectorAll('.hw'), { opacity: 0, y: 12 }); // y:12 matches enter FROM state
      }
    });

    // Exit: fade the prev container out, reset its words on complete
    gsap.to(prev, {
      opacity: 0, y: -20, duration: 0.45, ease: 'power3.in',
      overwrite: true,
      onComplete: () => {
        gsap.set(prev, { y: 0 });
        gsap.set(prev.querySelectorAll('.hw'), { opacity: 0, y: 12 });
      },
    });

    // Enter: container slides in, words stagger in as it arrives
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

  // ── Hero entrance — called by Preloader.run() callback ──────────────────
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
      // Words stagger in as scene arrives
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

  // ── Hero ScrollTrigger — viewport-specific travel distance ───────────────
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    ScrollTrigger.create({
      id: 'heroPin',
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
      onRefresh(self) {
        const p = self.progress;
        const idx = p < 0.26 ? 0 : p < 0.52 ? 1 : p < 0.77 ? 2 : 3;
        scenes.forEach((s, i) => {
          if (i !== idx) gsap.set(s, { opacity: 0, y: 0 });
        });
        if (scenes[idx]) gsap.set(scenes[idx], { opacity: 1, y: 0 });
        currentScene = idx;
      },
    });
  });

  mm.add('(max-width: 767px)', () => {
    ScrollTrigger.create({
      id: 'heroPin',
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
      onRefresh(self) {
        const p = self.progress;
        const idx = p < 0.26 ? 0 : p < 0.52 ? 1 : p < 0.77 ? 2 : 3;
        scenes.forEach((s, i) => {
          if (i !== idx) gsap.set(s, { opacity: 0, y: 0 });
        });
        if (scenes[idx]) gsap.set(scenes[idx], { opacity: 1, y: 0 });
        currentScene = idx;
      },
    });
  });

  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -70px',
    onUpdate(self) {
      nav.classList.toggle('nav--scrolled', self.progress > 0);
    },
  });

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

  // Method timeline scroll reveal
  const methodSteps = document.querySelectorAll('.method-step');
  const methodTimeline = document.querySelector('.method-timeline');
  if (methodSteps.length && methodTimeline) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          methodTimeline.classList.add('is-active');
          const idx = Array.from(methodSteps).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
            const dot = entry.target.querySelector('.method-step-dot');
            if (dot) {
              dot.classList.add('is-lit');
              setTimeout(() => dot.classList.remove('is-lit'), 600);
            }
          }, idx * 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    methodSteps.forEach(step => observer.observe(step));
  }

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

  // ── Language switch — refresh ScrollTrigger after layout reflow ──────────
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });
  });

  // ── Interactions ─────────────────────────────────────────────────────────
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

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-copy-email]').forEach(el => {
    const msgEl = document.getElementById(el.dataset.copyEmail);
    el.addEventListener('click', e => {
      e.preventDefault();
      navigator.clipboard.writeText('info@cerebro.gr').then(() => {
        if (msgEl) {
          msgEl.classList.add('visible');
          setTimeout(() => msgEl.classList.remove('visible'), 2200);
        }
      });
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('.form-submit');
      const data = Object.fromEntries(new FormData(form));

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.name || !data.email || !data.businessType || !data.message) return;
      if (!emailRe.test(data.email)) return;

      btn.textContent = 'Sending…';
      btn.disabled    = true;

      try {
        const res = await fetch('/api/contact', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(data),
        });
        if (res.ok) {
          btn.textContent = 'Message sent ✓';
          btn.classList.add('form-submit--sent');
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = 'Something went wrong. Try again.';
        btn.disabled    = false;
      }
    });
  }

  // ── Reel Overlay ────────────────────────────────────────────────────────
  const reelBtn     = document.getElementById('reelBtn');
  const reelOverlay = document.getElementById('reelOverlay');
  const reelClose   = document.getElementById('reelClose');
  const reelVideo   = document.getElementById('reelVideo');

  let _savedScrollY = 0;

  function openReel() {
    _savedScrollY = window.scrollY;
    reelOverlay.classList.add('reel-overlay--open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    reelVideo.muted = true;
    reelVideo.currentTime = 0;
    reelVideo.controls = false;
    reelVideo.load();
    reelVideo.play().catch(() => {});
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');
    if (cursorInner) cursorInner.style.background = '#fff';
    if (cursorOuter) cursorOuter.style.borderColor = '#fff';
  }

  function closeReel() {
    reelVideo.pause();
    reelVideo.currentTime = 0;
    reelOverlay.classList.remove('reel-overlay--open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.scrollTo({ top: _savedScrollY, behavior: 'instant' });
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');
    if (cursorInner) cursorInner.style.background = '';
    if (cursorOuter) cursorOuter.style.borderColor = '';
  }

  if (reelBtn)   reelBtn.addEventListener('click', openReel);
  if (reelClose) reelClose.addEventListener('click', closeReel);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && reelOverlay.classList.contains('reel-overlay--open')) {
      closeReel();
    }
  });

  // ── Preloader → hero entrance ─────────────────────────────────────────────
  Preloader.run(() => {
    ScrollTrigger.refresh();

    const heroST = ScrollTrigger.getById('heroPin');
    const p = heroST ? heroST.progress : 0;
    const idx = p < 0.26 ? 0 : p < 0.52 ? 1 : p < 0.77 ? 2 : 3;

    // Set all scenes to correct state BEFORE any animation
    scenes.forEach((s, i) => {
      gsap.set(s, { opacity: 0, y: 0 });
      gsap.set(s.querySelectorAll('.hw'), { opacity: 0, y: 12 });
    });
    currentScene = -1;

    if (idx === 0) {
      // Normal first-visit entrance
      runHeroEntrance();
    } else {
      // Refreshed mid-scroll: show correct scene immediately, no animation
      gsap.set(scenes[idx], { opacity: 1, y: 0 });
      gsap.set(scenes[idx].querySelectorAll('.hw'), { opacity: 1, y: 0 });
      currentScene = idx;
      // Still animate nav in
      gsap.fromTo('.nav',
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
      );
    }
  });
});
