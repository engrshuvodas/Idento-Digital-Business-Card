/**
 * script.js – Engr Shuvo Das Digital Business Card (Luxury Estate)
 *
 * Canvas animation: floating translucent building / grid architecture
 * particles — thin gold lines connecting nearby nodes, creating a
 * premium "blueprint" constellation effect.
 */

(function () {
  'use strict';

  /* ============================================================
     ARCHITECTURAL PARTICLE / CONSTELLATION ENGINE
  ============================================================ */
  const canvas = document.getElementById('estate-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];

    const PARTICLE_COUNT  = 55;
    const CONNECTION_DIST = 130;
    const GOLD = 'rgba(201, 168, 76,';

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randBetween(min, max) { return Math.random() * (max - min) + min; }

    /* Create a particle */
    function Particle() {
      this.x   = randBetween(0, W);
      this.y   = randBetween(0, H);
      this.vx  = randBetween(-0.25, 0.25);
      this.vy  = randBetween(-0.25, 0.25);
      this.r   = randBetween(1.5, 3);
      this.a   = randBetween(0.3, 0.8); // opacity
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${GOLD} ${this.a})`;
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            // Fade line based on distance
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${GOLD} ${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); initParticles(); });

    resize();
    initParticles();
    animate();
  }

  /* ============================================================
     TOAST NOTIFICATION LOGIC
  ============================================================ */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  /* ============================================================
     SAVE CONTACT BUTTON
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
        'ORG:Premium Real Estate',
        'TITLE:Real Estate Consultant',
        'TEL;TYPE=CELL,VOICE:+919641700503',
        'EMAIL;TYPE=WORK:engrshuvoda@gmail.com',
        'ADR;TYPE=WORK:;;Gujarat;;;; India',
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
        a.download = 'engr-shuvo-das-estate.vcf';
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
      saveBtn.disabled = true;
      saveBtn.textContent = '✅ Saved ✦';
      saveBtn.style.background = 'linear-gradient(90deg, #3a7d44, #56a35b)';
      saveBtn.style.boxShadow  = '0 8px 24px rgba(86, 163, 91, 0.4)';
      saveBtn.style.transform  = 'scale(0.97)';
    });
  }

  /* ============================================================
     SHARE BUTTON
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Engr Shuvo Das – Real Estate Consultant',
        text:  'Connect with a premium real estate consultant.',
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
