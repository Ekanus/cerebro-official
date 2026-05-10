document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── Early init — independent of preloader ────────────────────────────────
  const IS_MOBILE_INIT = window.matchMedia('(max-width: 767px)').matches;
  const brainCanvas = document.getElementById(IS_MOBILE_INIT ? 'mobileBrainCanvas' : 'brainCanvas');
  if (brainCanvas) BrainScene.init(brainCanvas);
  CustomCursor.init();

  // ── Hero scene system ────────────────────────────────────────────────────
  const scenes       = Array.from(document.querySelectorAll('.hero-scene'));
  const stageCounter = document.getElementById('stageCounter');
  let currentScene   = 0;

  function goToScene(idx) {
    if (idx === currentScene || idx < 0 || idx >= scenes.length) return;
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
    // Mobile brain scroll is handled by syncBrain below — no override here
  });

  // ── Mobile panel reveals + scroll-reactive brain ─────────────────────────
  if (IS_MOBILE_INIT) {
    const hmPanels = Array.from(document.querySelectorAll('.hm-panel'));

    // Hidden initial state for all mobile panel content
    hmPanels.forEach(panel => {
      gsap.set(panel.querySelectorAll('.hw'), { opacity: 0, y: 16 });
    });
    gsap.set('.hm-overline', { opacity: 0, y: -8 });
    gsap.set('.hm-meta',     { opacity: 0, y: 10 });

    // Hidden initial state for eyebrows + url in panels 1-3
    hmPanels.slice(1).forEach(panel => {
      const eyebrow = panel.querySelector('.hm-eyebrow');
      const url     = panel.querySelector('.hm-url');
      if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 10 });
      if (url)     gsap.set(url,     { opacity: 0, y: 10 });
    });

    // Reveal each panel as it scrolls into view — eyebrow before words
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

    // Brain reacts to scroll through the mobile hero panels
    const heroMobile = document.getElementById('heroMobile');
    if (heroMobile) {
      const syncBrain = () => {
        const rect = heroMobile.getBoundingClientRect();
        const scrollable = heroMobile.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
        BrainScene.setScrollProgress(progress);
      };
      window.addEventListener('scroll', syncBrain, { passive: true });
      syncBrain();

      // Hide brain canvas when heroMobile section is fully past
      const hideBrainOnExit = new IntersectionObserver((entries) => {
        const mbc = document.getElementById('mobileBrainCanvas');
        if (!mbc) return;
        mbc.style.opacity = entries[0].isIntersecting ? '1' : '0';
      }, { threshold: 0 });
      hideBrainOnExit.observe(heroMobile);
    }
  }

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

  // ── Preloader → hero entrance ─────────────────────────────────────────────
  Preloader.run(() => {
    ScrollTrigger.refresh();
    if (IS_MOBILE_INIT) {
      const words0 = Array.from(document.querySelectorAll('.hm-panel--0 .hw'));
      gsap.timeline()
        .fromTo('.nav',
          { opacity: 0, y: -24 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
        )
        .fromTo('.hm-overline',
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.50, ease: 'power3.out' },
          '-=0.30'
        )
        .to(words0,
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out' },
          '-=0.25'
        )
        .to('.hm-meta',
          { opacity: 0.65, y: 0, duration: 0.40, ease: 'power2.out' },
          '-=0.18'
        );
    } else {
      runHeroEntrance();
    }
  });
});
