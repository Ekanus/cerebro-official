const FooterCluster = (() => {
  let canvas, ctx, rafId;
  let time = 0;
  const particles = [];

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const COUNT        = IS_MOBILE ? 40 : 90;
  const CONNECT_DIST = IS_MOBILE ? 80 : 95;
  const CD2          = CONNECT_DIST * CONNECT_DIST;
  const MAX_SPEED    = 0.15;

  function fadeFactor(x, y, w, h) {
    if (IS_MOBILE) {
      // On mobile: fade from left only, no x-cutoff, full vertical presence
      const fx = Math.exp(-2.5 * (x / w));
      const fy = 0.5 + 0.5 * (y / h);
      return fx * fy;
    }
    const fx = Math.exp(-3.5 * (x / w));
    const fy = 0.35 + 0.65 * (y / h);
    return fx * fy;
  }

  function makeParticle(w, h) {
    const x = Math.pow(Math.random(), 2.0) * w * (IS_MOBILE ? 0.75 : 0.60);
    const y = h * 0.10 + Math.random() * h * 0.90;
    return {
      x, y,
      vx: (Math.random() - 0.5) * MAX_SPEED * 2,
      vy: (Math.random() - 0.5) * MAX_SPEED * 2,
      r:  IS_MOBILE ? 1.2 + Math.random() * 1.5 : 0.9 + Math.random() * 1.3,
      a:  IS_MOBILE ? 0.18 + Math.random() * 0.22 : 0.10 + Math.random() * 0.16,
    };
  }

  function sizeCanvas() {
    const footer = document.querySelector('.footer');
    if (!footer || !canvas) return;
    const w = footer.offsetWidth;
    const h = footer.offsetHeight;
    if (!w || !h) return;
    if (canvas.width === w && canvas.height === h) return;
    canvas.width        = w;
    canvas.height       = h;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) particles.push(makeParticle(w, h));
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    time += 0.004;

    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const breathe = 0.80 + Math.sin(time * 0.55) * 0.13;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x += w;
      if (p.x > w) p.x -= w;
      if (p.y < 0) p.y += h;
      if (p.y > h) p.y -= h;
    }

    const fades = new Array(particles.length);
    for (let i = 0; i < particles.length; i++) {
      fades[i] = fadeFactor(particles[i].x, particles[i].y, w, h);
    }

    ctx.lineWidth = IS_MOBILE ? 0.8 : 0.6;
    for (let i = 0; i < particles.length; i++) {
      if (fades[i] < 0.01) continue;
      for (let j = i + 1; j < particles.length; j++) {
        if (fades[j] < 0.01) continue;
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CD2) {
          const d     = Math.sqrt(d2);
          const fade  = (fades[i] + fades[j]) * 0.5;
          const alpha = ((1 - d / CONNECT_DIST) * (IS_MOBILE ? 0.10 : 0.062) * breathe * fade).toFixed(3);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      if (fades[i] < 0.01) continue;
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(p.a * fades[i]).toFixed(3)})`;
      ctx.fill();
    }
  }

  function init() {
    canvas = document.getElementById('footerClusterCanvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ctx = canvas.getContext('2d');
    const footer = document.querySelector('.footer');

    // Size after full render — critical on mobile
    requestAnimationFrame(() => {
      setTimeout(() => {
        sizeCanvas();
        // Start animation immediately — don't wait for IntersectionObserver on mobile
        if (IS_MOBILE && !rafId) rafId = requestAnimationFrame(loop);
        setTimeout(sizeCanvas, 600);
      }, 80);
    });

    if (window.ResizeObserver) {
      new ResizeObserver(sizeCanvas).observe(footer);
    } else {
      window.addEventListener('resize', sizeCanvas);
    }

    // Desktop: pause when not visible. Mobile: always run when footer exists
    if (!IS_MOBILE) {
      new IntersectionObserver(entries => {
        const visible = entries[0].isIntersecting;
        if (visible && !rafId)  { rafId = requestAnimationFrame(loop); }
        if (!visible && rafId)  { cancelAnimationFrame(rafId); rafId = null; }
      }, { threshold: 0.01 }).observe(footer);
    } else {
      // On mobile, use scroll to start — more reliable than IntersectionObserver
      const startOnScroll = () => {
        if (!rafId) rafId = requestAnimationFrame(loop);
        window.removeEventListener('scroll', startOnScroll);
      };
      window.addEventListener('scroll', startOnScroll, { passive: true });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
