/**
 * script.js – Engr Shuvo Das Digital Business Card (Medical Pro)
 *
 * Animations:
 *  1. ECG Heartbeat line drawing across the bottom canvas.
 *  2. Floating medical cross (✚) particles rising from the bottom.
 *  3. Save Contact vCard download.
 *  4. Share button with Web Share API + clipboard fallback.
 */

(function () {
  'use strict';

  /* ============================================================
     1. ECG CANVAS – Scrolling heartbeat waveform at the bottom
  ============================================================ */
  const ecgCanvas = document.getElementById('ecg-canvas');
  if (ecgCanvas) {
    const ctx = ecgCanvas.getContext('2d');
    let W, H;

    // One heartbeat beat cycle (relative x,y offsets scaled to canvas)
    // Values are normalised 0-1 for y (0 = top, 1 = bottom)
    const BEAT = [
      [0,    0.5], [0.08, 0.5], [0.10, 0.5],
      [0.12, 0.1], [0.15, 0.9], [0.18, 0.05],
      [0.21, 0.5], [0.24, 0.5],
    ];

    let offset = 0;
    const SPEED = 1.5;

    function resize() {
      W = ecgCanvas.width  = window.innerWidth;
      H = ecgCanvas.height = 120;
    }

    function buildWavePath(xOffset) {
      const segW   = W * 0.3;       // one beat occupies 30% of width
      const cycleW = segW + W * 0.15; // gap between beats

      ctx.beginPath();
      let started = false;

      for (let cycle = -1; cycle <= Math.ceil(W / cycleW) + 1; cycle++) {
        const baseX = cycle * cycleW - xOffset;

        BEAT.forEach(([rx, ry]) => {
          const x = baseX + rx * segW;
          const y = H * ry;
          if (!started) { ctx.moveTo(x, y); started = true; }
          else            ctx.lineTo(x, y);
        });
        // Flat line to next beat
        ctx.lineTo(baseX + cycleW, H * 0.5);
      }
    }

    function drawECG() {
      ctx.clearRect(0, 0, W, H);

      // Glow effect — draw thicker semi-transparent line first
      ctx.save();
      buildWavePath(offset);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Crisp top line
      ctx.save();
      buildWavePath(offset);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.85)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      offset = (offset + SPEED) % (W * 0.45);
      requestAnimationFrame(drawECG);
    }

    window.addEventListener('resize', resize);
    resize();
    drawECG();
  }

  /* ============================================================
     2. FLOATING MEDICAL CROSS PARTICLES
  ============================================================ */
  const container = document.getElementById('bg-crosses');
  if (container) {
    const SYMBOLS = ['✚', '⊕', '✦', '⊞'];
    const NUM     = 18;

    for (let i = 0; i < NUM; i++) {
      const el = document.createElement('div');
      el.className = 'bg-cross';
      el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

      const left     = Math.random() * 100;          // %
      const duration = 12 + Math.random() * 20;      // seconds
      const delay    = -(Math.random() * duration);  // stagger start
      const size     = 12 + Math.random() * 18;      // px
      const opacity  = 0.06 + Math.random() * 0.1;

      el.style.cssText = `
        left: ${left}%;
        bottom: -40px;
        font-size: ${size}px;
        opacity: ${opacity};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        animation-timing-function: linear;
      `;
      container.appendChild(el);
    }
  }

  /* ============================================================
     TOAST NOTIFICATION LOGIC
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
     SAVE CONTACT BUTTON (vCard download)
  ============================================================ */
  const saveBtn = document.getElementById('btn-save-contact');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Dr. Engr Shuvo Das',
        'N:Das;Shuvo;;;Dr.',
        'ORG:City Care Medical Center',
        'TITLE:MBBS, General Physician',
        'TEL;TYPE=CELL,VOICE:+919641700503',
        'EMAIL;TYPE=WORK:engrshuvoda@gmail.com',
        'ADR;TYPE=WORK:;;Gujarat;;;; India',
        'URL:https://linkedin.com/in/engrshuvoda',
        'END:VCARD',
      ].join('\r\n');

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'dr-engr-shuvo-das.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="material-symbols-outlined btn-icon" style="font-variation-settings: \'FILL\' 1">check_circle</span> Saved!';
      saveBtn.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
      saveBtn.style.boxShadow  = '0 8px 24px rgba(39, 174, 96, 0.4)';

      showToast('Doctor contact saved!');
    });
  }

  /* ============================================================
     SHARE BUTTON
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Dr. Engr Shuvo Das – General Physician',
        text:  'Book an appointment with Dr. Engr Shuvo Das.',
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
