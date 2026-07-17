/**
 * script.js – Trust Finance
 */

(function () {
  'use strict';

  /* ============================================================
     BACKGROUND CHART — more visible, gentle glow
  ============================================================ */
  const canvas = document.getElementById('finance-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], offset = 0;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildPath();
    }

    function buildPath() {
      pts = [];
      let y = H * 0.65;
      const steps = 100;
      for (let i = 0; i < steps; i++) {
        // slightly bullish trend with natural noise
        y = Math.max(H * 0.08, Math.min(H * 0.88, y + (Math.random() - 0.48) * 26));
        pts.push({ x: (i / (steps - 1)) * W * 1.4, y });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Build path
      ctx.beginPath();
      ctx.moveTo(pts[0].x - offset, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x - offset, pts[i].y);
      }

      // Outer glow pass
      ctx.save();
      ctx.strokeStyle = 'rgba(13, 189, 111, 0.12)';
      ctx.lineWidth   = 10;
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      // Mid glow
      ctx.save();
      ctx.strokeStyle = 'rgba(13, 189, 111, 0.2)';
      ctx.lineWidth   = 4;
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      // Crisp top line
      ctx.save();
      ctx.strokeStyle = 'rgba(13, 189, 111, 0.55)';
      ctx.lineWidth   = 2;
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      // Fill under the line — gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   'rgba(13, 189, 111, 0.08)');
      grad.addColorStop(1,   'rgba(13, 189, 111, 0)');
      ctx.lineTo(pts[pts.length - 1].x - offset, H);
      ctx.lineTo(pts[0].x - offset, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      offset = (offset + 0.6) % (W * 0.3);
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

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
        'ORG:Trust Finance Advisory',
        'TITLE:Financial Advisor & Insurance Agent',
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
      a.download = 'engr-shuvo-das-finance.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      saveBtn.disabled    = true;
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background  = 'linear-gradient(90deg, #0a8f54, #0dbd6f)';
      saveBtn.style.boxShadow   = '0 8px 24px rgba(13,189,111,0.4)';

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
        title: 'Engr Shuvo Das – Financial Advisor',
        text:  'Get in touch for a free consultation.',
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
