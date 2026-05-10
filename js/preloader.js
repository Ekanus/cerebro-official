const Preloader = (() => {
  const SESSION_KEY = 'cbr_s';

  function hasVisited() {
    try { return !!sessionStorage.getItem(SESSION_KEY); }
    catch { return false; }
  }

  function markVisited() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); }
    catch {}
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Restore scroll and remove overlay, then fire callback
  function finish(el, onComplete) {
    document.body.style.overflow = '';
    el.style.display = 'none';
    onComplete();
  }

  // Slide the overlay up off screen — reveals hero below
  function slideUp(el, onComplete) {
    gsap.to(el, {
      yPercent: -100,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => finish(el, onComplete),
    });
  }

  function run(onComplete) {
    const el = document.getElementById('preloader');
    if (!el) { onComplete(); return; }

    // Prevent page scroll while intro runs
    document.body.style.overflow = 'hidden';

    // ── prefers-reduced-motion: instant skip ───────────────────────────────
    if (prefersReducedMotion()) {
      markVisited();
      gsap.to(el, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => finish(el, onComplete),
      });
      return;
    }

    // ── Repeat session visit: quick but polished fade ─────────────────────
    if (hasVisited()) {
      gsap.to(el, {
        opacity: 0,
        duration: 0.55,
        delay: 0.10,
        ease: 'power2.out',
        onComplete: () => finish(el, onComplete),
      });
      return;
    }

    // ── First visit: full intro ────────────────────────────────────────────
    markVisited();

    const fill   = document.getElementById('preloaderFill');
    const pctEl  = document.getElementById('preloaderPct');
    const logo   = el.querySelector('.preloader-logo');
    const tagEl  = el.querySelector('.preloader-tagline');

    // Start hidden — GSAP will animate them in
    gsap.set([logo, tagEl], { opacity: 0, y: 12 });
    gsap.set('.preloader-progress-wrap', { opacity: 0 });

    const tl = gsap.timeline();

    tl
      // Brand name appears
      .to(logo, {
        opacity: 1, y: 0,
        duration: 0.48,
        ease: 'power3.out',
      })
      // Tagline appears slightly after
      .to(tagEl, {
        opacity: 1, y: 0,
        duration: 0.38,
        ease: 'power2.out',
      }, '-=0.18')
      // Progress bar area fades in
      .to('.preloader-progress-wrap', {
        opacity: 1,
        duration: 0.30,
        ease: 'power2.out',
      }, '-=0.18')
      // Counter runs
      .add(() => {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: 100,
          duration: 0.88,
          ease: 'power1.inOut',
          onUpdate() {
            const v = Math.round(obj.n);
            if (pctEl) pctEl.textContent = String(v).padStart(2, '0');
            if (fill)  fill.style.transform = `scaleX(${v / 100})`;
          },
          onComplete() {
            // Brief pause at 100, then exit
            gsap.delayedCall(0.20, () => slideUp(el, onComplete));
          },
        });
      }, '-=0.10');

    // Timing breakdown:
    // 0.00 – logo in     (0.48s)
    // 0.30 – tagline in  (0.38s)
    // 0.50 – bar fade in (0.30s)
    // 0.70 – counter 0→100 (0.88s) → completes at ~1.58s
    // 1.78 – slideUp starts (0.65s)
    // 2.43 – hero entrance starts
  }

  return { run };
})();
