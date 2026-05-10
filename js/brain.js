const BrainScene = (() => {
  let scene, camera, renderer, canvas;
  let brainGroup;
  let particles, lineSegments;
  let currentPositions, originalPositions, expandedPositions, displayPositions;
  let time = 0;
  let targetScroll = 0;
  let lerpedScroll = 0;
  let targetGroupX = 0, targetGroupY = 0;
  let rafId;

  // Mouse lean — whole-brain tilt toward cursor (global, always active)
  let smoothLeanX = 0, smoothLeanY = 0;
  let targetLeanX = 0, targetLeanY = 0;
  // Mouse local — per-particle repulsion near canvas
  let mouseCanvasX = 0, mouseCanvasY = 0;
  let mouseNear = false;
  let _vHalfH = 0; // precomputed world-space half-height at z=0

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const PARTICLE_COUNT = IS_MOBILE ? 280 : 1000;
  const MAX_CONNECTIONS = IS_MOBILE ? 500 : 3000;
  const CONNECT_DIST = IS_MOBILE ? 0.38 : 0.45;

  const STAGE_TARGETS = [
    { x: 0.00, y: 0.02 },
    { x: 0.55, y: -0.05 },
    { x: -0.15, y: 0.08 },
    { x: 0.00, y: 0.00 },
  ];

  // Soft circular dot texture — radial white gradient gives smooth circular alpha mask
  function makeCircleTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const r = 32;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0,    'rgba(255,255,255,1.00)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.90)');
    g.addColorStop(1,    'rgba(255,255,255,0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }

  function generateBrainPoints() {
    const pts = [];
    let attempts = 0;

    while (pts.length < PARTICLE_COUNT * 3 && attempts < PARTICLE_COUNT * 10) {
      attempts++;
      const lobe = Math.random() > 0.5 ? 1 : -1;

      let x, y, z, r;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        r = Math.sqrt(x * x + y * y + z * z);
      } while (r > 1);

      const px = x * 0.88 + lobe * 0.33;
      const py = y * 0.74;
      const pz = z * 0.54;

      // Wider sulcus — more recognisable two-lobe brain shape
      if (Math.abs(px) < 0.10 && Math.random() > 0.25) continue;

      pts.push(px, py, pz);
    }
    return pts;
  }

  function buildConnections(pts) {
    const verts = [];
    const n = pts.length / 3;
    let count = 0;

    for (let i = 0; i < n && count < MAX_CONNECTIONS; i++) {
      for (let j = i + 1; j < n && count < MAX_CONNECTIONS; j++) {
        const dx = pts[i * 3]     - pts[j * 3];
        const dy = pts[i * 3 + 1] - pts[j * 3 + 1];
        const dz = pts[i * 3 + 2] - pts[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < CONNECT_DIST * CONNECT_DIST) {
          verts.push(
            pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2],
            pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]
          );
          count++;
        }
      }
    }
    return verts;
  }

  // Named handlers so destroy() can remove them
  function onWindowMouseMove(e) {
    if (IS_MOBILE) return;
    targetLeanX = (e.clientX / window.innerWidth  - 0.5);
    targetLeanY = (e.clientY / window.innerHeight - 0.5);
  }

  function onCanvasMouseMove(e) {
    if (IS_MOBILE) return;
    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top)  / rect.height;
    mouseCanvasX = (nx * 2 - 1) * _vHalfH * (rect.width / rect.height);
    mouseCanvasY = (1 - ny * 2) * _vHalfH;
    mouseNear = true;
  }

  function onCanvasMouseLeave() { mouseNear = false; }

  function init(canvasEl) {
    canvas = canvasEl;

    scene = new THREE.Scene();

    const w = canvas.offsetWidth  || window.innerWidth;
    const h = canvas.offsetHeight || window.innerHeight;
    const CAM_Z   = IS_MOBILE ? 3.2 : 2.8;
    const CAM_FOV = IS_MOBILE ? 70  : 54;
    camera = new THREE.PerspectiveCamera(CAM_FOV, w / h, 0.1, 100);
    camera.position.set(0, 0.04, CAM_Z);

    // Precompute world-space half-height at z=0 for mouse XY projection
    _vHalfH = Math.tan(CAM_FOV * Math.PI / 360) * CAM_Z;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    brainGroup = new THREE.Group();
    scene.add(brainGroup);

    const rawPts = generateBrainPoints();
    const n = rawPts.length;

    originalPositions = new Float32Array(rawPts);
    currentPositions  = new Float32Array(rawPts);
    displayPositions  = new Float32Array(rawPts); // GPU-facing: currentPositions + mouse offset

    expandedPositions = new Float32Array(n);
    for (let i = 0; i < n; i += 3) {
      const scale = 1.6 + Math.random() * 0.65;
      expandedPositions[i]     = rawPts[i]     * scale;
      expandedPositions[i + 1] = rawPts[i + 1] * scale;
      expandedPositions[i + 2] = rawPts[i + 2] * scale;
    }

    // ── Particles — circular soft dots ────────────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(displayPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0a0a0a,
      map: makeCircleTexture(),
      size: IS_MOBILE ? 0.048 : 0.040,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      depthWrite: false,
      alphaTest: 0.05,
    });
    particles = new THREE.Points(pGeo, pMat);
    brainGroup.add(particles);

    // ── Connection lines ───────────────────────────────────────────────────
    const lineVerts = buildConnections(rawPts);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
    const lMat = new THREE.LineBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
    });
    lineSegments = new THREE.LineSegments(lGeo, lMat);
    brainGroup.add(lineSegments);

    // ── Mouse interaction listeners ────────────────────────────────────────
    window.addEventListener('mousemove', onWindowMouseMove);
    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseleave', onCanvasMouseLeave);

    rafId = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);
  }

  function lerpPositions(target, t) {
    for (let i = 0; i < currentPositions.length; i++) {
      currentPositions[i] = originalPositions[i] + (target[i] - originalPositions[i]) * t;
    }
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    time += 0.007;

    lerpedScroll += (targetScroll - lerpedScroll) * 0.04;
    const sp = lerpedScroll;

    // ── Mouse lean (global tilt toward cursor) ───────────────────────────
    smoothLeanX += (targetLeanX - smoothLeanX) * 0.025;
    smoothLeanY += (targetLeanY - smoothLeanY) * 0.025;

    // ── Rotation — calmer base speed + lean influence ────────────────────
    const rotY = time * 0.16 + smoothLeanX * 0.30;
    const rotX = sp  * 0.50  + smoothLeanY * 0.20;
    const rotZ = Math.sin(time * 0.4) * 0.06;
    brainGroup.rotation.set(rotX, rotY, rotZ);

    // ── Lateral stage position ───────────────────────────────────────────
    brainGroup.position.x += (targetGroupX - brainGroup.position.x) * 0.032;
    brainGroup.position.y += (targetGroupY - brainGroup.position.y) * 0.032;

    // ── Breathing ────────────────────────────────────────────────────────
    const breathe = 1.0 + Math.sin(time * 0.85) * 0.022;

    // ── State machine ────────────────────────────────────────────────────
    let expandT, opacityP, opacityL, scaleVal;

    if (IS_MOBILE) {
      // Mobile: brain stays visible throughout all panels, gentle expansion only
      expandT  = sp * 0.4;
      opacityP = 0.65;
      opacityL = 0.13;
      scaleVal = breathe + sp * 0.08;
    } else if (sp < 0.30) {
      expandT  = 0;
      opacityP = 0.65;
      opacityL = 0.13;
      scaleVal = breathe;
    } else if (sp < 0.65) {
      const t    = (sp - 0.30) / 0.35;
      const ease = t * t;
      expandT  = ease;
      opacityP = 0.65 - ease * 0.22;
      opacityL = 0.13 - ease * 0.07;
      scaleVal = breathe + ease * 0.22;
    } else {
      const t  = (sp - 0.65) / 0.35;
      expandT  = 1.0 - t * 0.60;
      opacityP = 0.43 - t * 0.38;
      opacityL = 0.06 - t * 0.06;
      scaleVal = breathe + 0.22 - t * 0.34;
    }

    if (expandT > 0) {
      lerpPositions(expandedPositions, expandT);
    } else {
      currentPositions.set(originalPositions);
    }

    // ── Mouse local repulsion → displayPositions ──────────────────────────
    if (mouseNear && !IS_MOBILE) {
      const localMX = mouseCanvasX - brainGroup.position.x;
      const localMY = mouseCanvasY - brainGroup.position.y;
      const INFL_R  = 0.50;
      const INFL_R2 = INFL_R * INFL_R;
      const STRENGTH = 0.09;
      for (let i = 0; i < currentPositions.length; i += 3) {
        const dx = currentPositions[i]     - localMX;
        const dy = currentPositions[i + 1] - localMY;
        const d2 = dx * dx + dy * dy;
        if (d2 < INFL_R2 && d2 > 0.0001) {
          const d = Math.sqrt(d2);
          const f = (1 - d / INFL_R) * (1 - d / INFL_R) * STRENGTH;
          displayPositions[i]     = currentPositions[i]     + (dx / d) * f;
          displayPositions[i + 1] = currentPositions[i + 1] + (dy / d) * f;
        } else {
          displayPositions[i]     = currentPositions[i];
          displayPositions[i + 1] = currentPositions[i + 1];
        }
        displayPositions[i + 2] = currentPositions[i + 2];
      }
    } else {
      displayPositions.set(currentPositions);
    }

    particles.geometry.attributes.position.needsUpdate = true;

    particles.material.opacity    = Math.max(0, opacityP);
    lineSegments.material.opacity = Math.max(0, opacityL);
    brainGroup.scale.setScalar(Math.max(0.05, scaleVal));

    renderer.render(scene, camera);
  }

  function setScrollProgress(p) {
    targetScroll = Math.min(1, Math.max(0, p));
    const stage  = p < 0.25 ? 0 : p < 0.50 ? 1 : p < 0.75 ? 2 : 3;
    const target = STAGE_TARGETS[stage];
    targetGroupX = IS_MOBILE ? 0 : target.x;
    targetGroupY = IS_MOBILE ? 0 : target.y;
  }

  function onResize() {
    const w = canvas.offsetWidth  || window.innerWidth;
    const h = canvas.offsetHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function destroy() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onWindowMouseMove);
    canvas.removeEventListener('mousemove', onCanvasMouseMove);
    canvas.removeEventListener('mouseleave', onCanvasMouseLeave);
    renderer.dispose();
  }

  return { init, setScrollProgress, destroy };
})();
