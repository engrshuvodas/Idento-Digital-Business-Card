/**
 * script.js – World Explorer Theme
 *
 * Background:
 *   • Twinkling star field (random dots that fade in/out).
 *   • Aurora borealis — multiple wide sine-wave colour bands that
 *     undulate slowly across the upper portion of the sky.
 */

(function () {
  'use strict';

  /* ============================================================
     AURORA + STARS CANVAS
  ============================================================ */
  const canvas = document.getElementById('aurora-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  /* ─── Resize ─────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }

  /* ─── STARS ───────────────────────────────────────────────── */
  const STAR_COUNT = 220;
  let stars = [];

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x:       Math.random() * W,
        y:       Math.random() * H,
        r:       Math.random() * 1.4 + 0.3,
        phase:   Math.random() * Math.PI * 2,
        speed:   Math.random() * 0.012 + 0.005,
        base:    Math.random() * 0.5 + 0.3,  // base opacity
      });
    }
  }

  function drawStars(t) {
    stars.forEach(s => {
      const alpha = s.base + Math.sin(s.phase + t * s.speed) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, Math.min(1, alpha))})`;
      ctx.fill();
    });
  }

  /* ─── AURORA BANDS ────────────────────────────────────────── */
  //  Each band: a sine wave gradient strip painted across the canvas.
  const BANDS = [
    {
      color1: [10,  255, 178],   // teal-green
      color2: [0,   200, 150],
      yBase:  0.18,              // vertical centre (fraction of H)
      amplitude: 0.065,
      frequency: 1.4,
      speed: 0.00035,
      phase: 0,
      thickness: 0.18,
      alpha: 0.45,
    },
    {
      color1: [127,  90, 240],   // violet
      color2: [180, 120, 255],
      yBase:  0.10,
      amplitude: 0.055,
      frequency: 1.1,
      speed: 0.00028,
      phase: Math.PI * 0.7,
      thickness: 0.15,
      alpha: 0.35,
    },
    {
      color1: [247, 151,  30],   // amber/orange  (sunset rim)
      color2: [255, 200,  80],
      yBase:  0.30,
      amplitude: 0.04,
      frequency: 0.8,
      speed: 0.00020,
      phase: Math.PI * 1.5,
      thickness: 0.1,
      alpha: 0.18,
    },
  ];

  function drawAurora(t) {
    BANDS.forEach(b => {
      const pts  = 120;               // horizontal samples
      const half = (H * b.thickness) / 2;

      ctx.save();
      // soft blend
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i <= pts; i++) {
        const x   = (i / pts) * W;
        // wave centre Y for this x position
        const cy  = H * b.yBase +
                    Math.sin(i / pts * Math.PI * 2 * b.frequency + t * b.speed * 1000 + b.phase) * H * b.amplitude;

        // Very thin vertical strip
        const sw = W / pts + 1;

        const grad = ctx.createLinearGradient(x, cy - half, x, cy + half);
        const [r1, g1, bl1] = b.color1;
        const [r2, g2, bl2] = b.color2;

        // Fade at edges of the strip, brightest at centre
        grad.addColorStop(0,    `rgba(${r1},${g1},${bl1},0)`);
        grad.addColorStop(0.3,  `rgba(${r2},${g2},${bl2},${b.alpha * 0.6})`);
        grad.addColorStop(0.5,  `rgba(${r1},${g1},${bl1},${b.alpha})`);
        grad.addColorStop(0.7,  `rgba(${r2},${g2},${bl2},${b.alpha * 0.6})`);
        grad.addColorStop(1,    `rgba(${r1},${g1},${bl1},0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(x, cy - half, sw, half * 2);
      }

      ctx.restore();
    });
  }

  /* ─── ANIMATION LOOP ──────────────────────────────────────── */
  function animate(t) {
    ctx.clearRect(0, 0, W, H);

    // Deep space gradient base
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0,   '#060b18');
    skyGrad.addColorStop(0.5, '#0a1025');
    skyGrad.addColorStop(1,   '#080d1c');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    drawAurora(t);
    drawStars(t * 0.001);

    requestAnimationFrame(animate);
  }

  /* ─── INIT ────────────────────────────────────────────────── */
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
  ============================================================ */
  const saveBtn = document.getElementById('btn-save-contact');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Engr Shuvo Das',
        'N:Das;Shuvo;;;',
        'ORG:World Explorer Travel',
        'TITLE:Tour Operator & Travel Consultant',
        'TEL;TYPE=CELL,VOICE:+919641700503',
        'EMAIL;TYPE=WORK:engrshuvoda@gmail.com',
        'ADR;TYPE=WORK:;;Gujarat;;;; India',
        'URL:https://www.instagram.com/engrshuvo74886/',
        'END:VCARD',
      ].join('\r\n');

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'engr-shuvo-das-travel.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      saveBtn.disabled    = true;
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background = 'linear-gradient(90deg, #0affb2, #0affb2)';
      saveBtn.style.boxShadow  = '0 8px 24px rgba(10,255,178,0.45)';

      showToast('Contact saved to your device!');
    });
  }

  /* ============================================================
     SHARE BUTTON
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Engr Shuvo Das – Tour Operator',
        text:  'Book your dream trip today!',
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
