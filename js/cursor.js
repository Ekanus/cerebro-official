const CustomCursor = (() => {
  let cursorEl, inner, outer;
  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;
  let rafId;

  function init() {
    cursorEl = document.getElementById('cursor');
    if (!cursorEl) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      cursorEl.style.display = 'none';
      return;
    }

    inner = cursorEl.querySelector('.cursor-inner');
    outer = cursorEl.querySelector('.cursor-outer');

    cursorEl.style.display = 'block';
    document.documentElement.style.cursor = 'none';

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', () => cursorEl.classList.add('cursor--hidden'));
    document.addEventListener('mouseenter', () => cursorEl.classList.remove('cursor--hidden'));

    bindHoverTargets();

    const footer = document.querySelector('.footer');
    if (footer) {
      footer.addEventListener('mouseenter', () => cursorEl.classList.add('cursor--light'));
      footer.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor--light'));
    }

    rafId = requestAnimationFrame(tick);
  }

  // Magnetic pull: element nudges toward cursor on hover
  function addMagnetic(el, strength = 0.25) {
    if (el.dataset.magnetic) return;
    el.dataset.magnetic = 'true';

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
    });
  }

  function bindHoverTargets() {
    const hoverSel = 'a, button, .service-card, .product-card, .pricing-card, [data-hover]';
    const magnetSel = '.btn--dark, .nav-link--cta, .footer-cta-link, .contact-email';

    const bind = () => {
      document.querySelectorAll(hoverSel).forEach(attachHover);
      document.querySelectorAll(magnetSel).forEach(el => addMagnetic(el, 0.22));
    };
    bind();

    new MutationObserver(bind).observe(document.body, { childList: true, subtree: true });
  }

  function attachHover(el) {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = 'true';
    el.addEventListener('mouseenter', () => cursorEl.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('cursor--hover'));
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
  }

  function tick() {
    outerX += (mouseX - outerX) * 0.11;
    outerY += (mouseY - outerY) * 0.11;
    outer.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px)`;
    rafId = requestAnimationFrame(tick);
  }

  return { init };
})();
