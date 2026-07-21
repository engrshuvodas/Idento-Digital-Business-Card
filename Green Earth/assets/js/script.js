/**
 * script.js – Green Earth Theme
 *
 * Background:
 *   • Tree silhouettes drawn at the bottom edges.
 *   • Fireflies — soft glowing dots that drift and pulse gently.
 *   • Falling leaves — multiple shapes (oval, maple-like) in
 *     different autumn/forest colours, rotating as they fall.
 */

(function () {
  'use strict';

  /* ============================================================
     NATURE CANVAS — Trees, Fireflies & Falling Leaves
  ============================================================ */
  const canvas = document.getElementById('nature-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initTrees();
    initLeaves();
    initFireflies();
  }

  /* ─── COLOUR PALETTES ─────────────────────────────────────── */
  const LEAF_COLORS = [
    'rgba(76,  175, 80,  _)',   // bright green
    'rgba(56,  142, 60,  _)',   // deep green
    'rgba(129, 199, 132, _)',   // light green
    'rgba(249, 168, 37,  _)',   // amber
    'rgba(230, 126, 34,  _)',   // warm orange
    'rgba(121, 85,  72,  _)',   // earthy brown
    'rgba(161, 136, 127, _)',   // dusty rose-brown
  ];

  function leafColor(alpha) {
    const c = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
    return c.replace('_', alpha.toFixed(2));
  }

  /* ─── TREE SILHOUETTES ────────────────────────────────────── */
  let trees = [];

  function initTrees() {
    trees = [];
    // Left side trees
    trees.push({ x: W * -0.02, side: 'left',  scale: 1.1 });
    trees.push({ x: W *  0.06, side: 'left',  scale: 0.8 });
    trees.push({ x: W *  0.14, side: 'left',  scale: 0.65 });
    // Right side trees
    trees.push({ x: W *  1.02, side: 'right', scale: 1.1 });
    trees.push({ x: W *  0.94, side: 'right', scale: 0.8 });
    trees.push({ x: W *  0.86, side: 'right', scale: 0.65 });
  }

  function drawTree(x, scale) {
    const baseY  = H;
    const trunkH = H * 0.28 * scale;
    const trunkW = 18 * scale;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 30, 12, 0.9)';

    // Trunk
    ctx.fillRect(x - trunkW / 2, baseY - trunkH, trunkW, trunkH);

    // Three layered canopy triangles
    const layers = [
      { r: 90 * scale, yOff: trunkH * 0.85 },
      { r: 70 * scale, yOff: trunkH * 0.60 },
      { r: 50 * scale, yOff: trunkH * 0.38 },
    ];

    layers.forEach(l => {
      ctx.beginPath();
      ctx.arc(x, baseY - l.yOff, l.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawTrees() {
    trees.forEach(t => drawTree(t.x, t.scale));
  }

  /* ─── FALLING LEAVES ──────────────────────────────────────── */
  const LEAF_COUNT = 38;
  let leaves = [];

  function makeLeaf() {
    return {
      x:       Math.random() * W,
      y:       -20 - Math.random() * H * 0.3,   // start above viewport
      size:    6 + Math.random() * 14,
      speedY:  0.6 + Math.random() * 1.2,        // fall speed
      speedX:  (Math.random() - 0.5) * 0.8,      // horizontal drift
      rot:     Math.random() * Math.PI * 2,
      rotSpeed:(Math.random() - 0.5) * 0.04,     // rotation speed
      wobble:  Math.random() * Math.PI * 2,
      wobbleS: 0.02 + Math.random() * 0.015,
      color:   leafColor(0.7 + Math.random() * 0.3),
      type:    Math.floor(Math.random() * 3),     // 0=oval, 1=rounded, 2=pointed
    };
  }

  function initLeaves() {
    leaves = [];
    for (let i = 0; i < LEAF_COUNT; i++) {
      const l = makeLeaf();
      l.y = Math.random() * H;   // stagger initial positions
      leaves.push(l);
    }
  }

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.fillStyle = l.color;
    ctx.beginPath();

    if (l.type === 0) {
      // Simple oval
      ctx.ellipse(0, 0, l.size * 0.5, l.size, 0, 0, Math.PI * 2);
    } else if (l.type === 1) {
      // Rounder leaf
      ctx.moveTo(0, -l.size);
      ctx.bezierCurveTo( l.size * 0.8, -l.size * 0.3,  l.size * 0.8, l.size * 0.3, 0, l.size);
      ctx.bezierCurveTo(-l.size * 0.8,  l.size * 0.3, -l.size * 0.8,-l.size * 0.3, 0,-l.size);
    } else {
      // Pointed maple-like
      ctx.moveTo(0, -l.size);
      ctx.bezierCurveTo( l.size * 0.6, -l.size * 0.2,  l.size * 0.4, l.size * 0.6, 0, l.size);
      ctx.bezierCurveTo(-l.size * 0.4,  l.size * 0.6, -l.size * 0.6,-l.size * 0.2, 0,-l.size);
    }

    ctx.fill();
    ctx.restore();
  }

  function updateLeaves() {
    leaves.forEach(l => {
      l.wobble += l.wobbleS;
      l.x      += l.speedX + Math.sin(l.wobble) * 0.7;
      l.y      += l.speedY;
      l.rot    += l.rotSpeed;

      if (l.y > H + 30) {
        Object.assign(l, makeLeaf()); // recycle off-screen leaf
      }
    });
  }

  /* ─── FIREFLIES ───────────────────────────────────────────── */
  const FIREFLY_COUNT = 30;
  let fireflies = [];

  function initFireflies() {
    fireflies = [];
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      fireflies.push({
        x:     Math.random() * W,
        y:     H * 0.3 + Math.random() * H * 0.7,
        vx:    (Math.random() - 0.5) * 0.5,
        vy:    (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.025 + Math.random() * 0.02,
        r:     1.2 + Math.random() * 1.8,
      });
    }
  }

  function drawFireflies(t) {
    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;

      // Bounce inside screen
      if (f.x < 0 || f.x > W) f.vx *= -1;
      if (f.y < H * 0.25 || f.y > H) f.vy *= -1;

      // Pulse opacity
      const alpha = 0.3 + Math.sin(f.phase + t * f.speed) * 0.5;
      const glow  = Math.max(0, Math.min(1, alpha));

      // Outer glow
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 8);
      grad.addColorStop(0,   `rgba(200, 255, 150, ${glow * 0.6})`);
      grad.addColorStop(0.4, `rgba(150, 230, 80,  ${glow * 0.2})`);
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 255, 180, ${glow})`;
      ctx.fill();
    });
  }

  /* ─── ANIMATION LOOP ──────────────────────────────────────── */
  let frameCount = 0;

  function animate() {
    ctx.clearRect(0, 0, W, H);
    frameCount++;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0,    '#050e05');
    skyGrad.addColorStop(0.45, '#0a1a0c');
    skyGrad.addColorStop(1,    '#152b10');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // Distant forest haze
    const hazeGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
    hazeGrad.addColorStop(0,   'rgba(10, 40, 10, 0)');
    hazeGrad.addColorStop(0.6, 'rgba(10, 30, 10, 0.3)');
    hazeGrad.addColorStop(1,   'rgba(8, 20, 8, 0.7)');
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, H * 0.5, W, H * 0.5);

    drawFireflies(frameCount);
    updateLeaves();
    leaves.forEach(l => drawLeaf(l));
    drawTrees();

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);

  /* ============================================================
     TOAST
  ============================================================ */
  function showToast(message) {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    c.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  /* ============================================================
     SAVE CONTACT
     – 3-tier platform-aware vCard save for best UX on every device
     – Tier 1: iOS Safari  → data URI opens Contacts app natively
     – Tier 2: Android     → Blob .vcf download + guided toast
     – Tier 3: Desktop     → Blob .vcf download + desktop toast
  ============================================================ */
  const saveBtn = document.getElementById('btn-save-contact');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Engr Shuvo Das',
        'N:Das;Shuvo;;;',
        'ORG:Fiverr',
        'TITLE:Freelancer',
        'TEL;TYPE=CELL,VOICE:+919641700503',
        'EMAIL;TYPE=WORK:engrshuvoda@gmail.com',
        'ADR;TYPE=HOME:;;Gujarat;;;; India',
        'URL:https://linkedin.com/in/engrshuvoda',
        'END:VCARD',
      ].join('\r\n');

      /* ── Platform detection ── */
      const isIOS    = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isAndroid = /android/i.test(navigator.userAgent);

      if (isIOS && isSafari) {
        /* Tier 1 – iOS Safari: data URI triggers native Add Contact sheet */
        window.location.href = 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(vcard);
        showToast('📲 Tap "Add New Contact" to save!');
      } else {
        /* Tier 2 & 3 – Android + Desktop: Blob .vcf download */
        const blob = new Blob([vcard], { type: 'text/x-vcard;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = 'engr-shuvo-das.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(isAndroid
          ? '📲 Tap the downloaded file → "Open with Contacts"'
          : '💾 Open the downloaded .vcf file to add to contacts!'
        );
      }

      /* ── Success state ── */
      saveBtn.disabled    = true;
      saveBtn.textContent = '✅ Saved!';
      saveBtn.style.background = 'linear-gradient(90deg, #1b5e20, #388e3c)';
      saveBtn.style.boxShadow  = '0 8px 20px rgba(56, 142, 60, 0.4)';
    });
  }

  /* ============================================================
     SHARE BUTTON
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Engr Shuvo Das',
        text:  'Check out my digital business card!',
        url:   window.location.href,
      };
      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.url);
          showToast('Link copied to clipboard!');
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share error:', err);
      }
    });
  }

})();
