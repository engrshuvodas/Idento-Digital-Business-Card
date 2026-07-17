/**
 * script.js – Engr Shuvo Das Digital Business Card
 * Recreated from Stitch design ID: 4870904703855832271
 *
 * Features:
 *  1. Mouse-follow glow overlay
 *  2. Parallax bokeh background on mouse move
 *  3. Canvas floating particles (performance-optimised RAF loop)
 *  4. Button ripple / press micro-interactions
 *  5. prefers-reduced-motion guard throughout
 *  6. Share button (Web Share API + clipboard fallback + toast)
 *  7. Save Contact (generates .vcf / vCard download)
 */

(function () {
  'use strict';

  /* ============================================================
     REDUCED MOTION CHECK
  ============================================================ */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ============================================================
     1. MOUSE-FOLLOW GLOW
  ============================================================ */
  const mouseGlow = document.getElementById('mouseGlow');

  if (mouseGlow && !prefersReducedMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Lerp factor – lower = smoother/slower follow
    const LERP = 0.08;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateGlow() {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      mouseGlow.style.transform = `translate(${currentX - 190}px, ${currentY - 190}px)`;
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  } else if (mouseGlow) {
    mouseGlow.style.display = 'none';
  }

  /* ============================================================
     2. PARALLAX BACKGROUND (mouse tilt effect on bg image)
  ============================================================ */
  const bgImage = document.querySelector('.bg-image');

  if (bgImage && !prefersReducedMotion) {
    let mx = 0, my = 0;
    const PARALLAX_STRENGTH = 8; // px shift at edges

    document.addEventListener('mousemove', (e) => {
      // Normalise to -1 … +1
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // On mobile / touch – gyroscope parallax (optional, graceful fallback)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          mx = Math.max(-1, Math.min(1, e.gamma / 30));
          my = Math.max(-1, Math.min(1, (e.beta - 20) / 30));
        }
      });
    }

    let bgRafId;
    function animateBg() {
      const tx = mx * PARALLAX_STRENGTH;
      const ty = my * PARALLAX_STRENGTH;
      bgImage.style.transform = `scale(1.1) translate(${tx}px, ${ty}px)`;
      bgRafId = requestAnimationFrame(animateBg);
    }
    animateBg();
  }

  /* ============================================================
     3. CANVAS FLOATING PARTICLES
  ============================================================ */
  const canvas = document.getElementById('bg-canvas');

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');

    // Resize canvas to viewport
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    /* Particle definition */
    const PARTICLE_COUNT = 40;
    const particles = [];

    // Palette – green-tinted, very subtle
    const COLORS = [
      'rgba(174, 209, 138, PAL)',   // primary-fixed-dim
      'rgba(78,  124,  46, PAL)',   // dark green
      'rgba(221, 255, 185, PAL)',   // primary
      'rgba(191, 227, 154, PAL)',   // primary-container
    ];

    function randomColor(alpha) {
      const base = COLORS[Math.floor(Math.random() * COLORS.length)];
      return base.replace('PAL', alpha.toFixed(2));
    }

    function createParticle() {
      const size   = Math.random() * 3 + 1;         // 1–4 px
      const alpha  = Math.random() * 0.25 + 0.05;   // 0.05–0.3
      const speed  = Math.random() * 0.4 + 0.1;     // slow drift
      const angle  = Math.random() * Math.PI * 2;

      return {
        x:      Math.random() * canvas.width,
        y:      Math.random() * canvas.height,
        size,
        alpha,
        maxAlpha: alpha,
        vx:     Math.cos(angle) * speed,
        vy:     Math.sin(angle) * speed,
        color:  randomColor(alpha),
        pulse:  Math.random() * Math.PI * 2,  // phase offset for twinkle
        pulseSpeed: Math.random() * 0.02 + 0.005,
        life:   0,
        maxLife: Math.random() * 400 + 200,
      };
    }

    // Initialise pool
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }

    /* Main particle loop */
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Age + replace dead particles
        p.life++;
        if (p.life > p.maxLife) {
          particles[i] = createParticle();
          continue;
        }

        // Twinkle – slight alpha pulse
        p.pulse += p.pulseSpeed;
        const twinkle = Math.sin(p.pulse) * 0.5 + 0.5;   // 0…1

        // Fade-in / fade-out by life fraction
        const lifeFraction = p.life / p.maxLife;
        const fadeIn  = Math.min(1, lifeFraction * 5);
        const fadeOut = Math.min(1, (1 - lifeFraction) * 5);
        const lifeAlpha = fadeIn * fadeOut;

        const finalAlpha = p.maxAlpha * lifeAlpha * (0.6 + 0.4 * twinkle);

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10)               p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10)               p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw soft circle
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 2.5
        );
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${finalAlpha})`));
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

  /* ============================================================
     4. BUTTON MICRO-INTERACTIONS
     – Mouse-follow inner radial shine (CSS custom props)
     – Ripple on click
  ============================================================ */
  const actionBtns = document.querySelectorAll('.action-btn');

  actionBtns.forEach((btn) => {
    /* Mouse-follow shine via CSS variables */
    if (!prefersReducedMotion) {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--mouse-x', `${x}px`);
        btn.style.setProperty('--mouse-y', `${y}px`);
      });
    }

    /* Click ripple */
    btn.addEventListener('click', function (e) {
      if (prefersReducedMotion) return;

      const rect   = btn.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 6px;
        height: 6px;
        background: rgba(174, 209, 138, 0.5);
        top: ${y - 3}px;
        left: ${x - 3}px;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
      `;

      // Inject keyframes once
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes rippleAnim {
            0%   { transform: scale(0); opacity: 1; }
            100% { transform: scale(40); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ============================================================
     5. CARD 3D TILT (subtle, desktop only)
  ============================================================ */
  const card = document.querySelector('.glass-card');
  const cardWrapper = document.querySelector('.card-wrapper');

  if (card && !prefersReducedMotion && window.innerWidth >= 768) {
    const MAX_TILT = 6; // degrees

    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);   // -1 … 1
      const dy   = (e.clientY - cy) / (rect.height / 2);   // -1 … 1

      card.style.transform = `
        perspective(1000px)
        rotateX(${(-dy * MAX_TILT).toFixed(2)}deg)
        rotateY(${( dx * MAX_TILT).toFixed(2)}deg)
        scale(1.01)
      `;
    });

    cardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    cardWrapper.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  }

  /* ============================================================
     6. LAZY-LOAD IMAGES  (IntersectionObserver)
  ============================================================ */
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach((img) => observer.observe(img));
  }

  /* ============================================================
     7. SCROLL / TOUCH: Swipe up to reveal on mobile
  ============================================================ */
  // (Page is a single card – no scroll needed, but ensure smooth
  //  rendering on first paint by removing will-change after load)
  window.addEventListener('load', () => {
    const bgImg = document.querySelector('.bg-image');
    if (bgImg) {
      // Let browser manage after first paint
      setTimeout(() => {
        bgImg.style.willChange = 'auto';
      }, 2000);
    }
  });

  /* ============================================================
     8. SHARE BUTTON
     – Uses Web Share API where available (mobile/modern browsers)
     – Falls back to copying the page URL to clipboard
     – Shows a lightweight toast notification in both cases
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  /** Show a brief toast message */
  function showToast(message, isSuccess = true) {
    // Remove any existing toast
    const existing = document.getElementById('card-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'card-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: ${isSuccess ? 'rgba(78, 124, 46, 0.92)' : 'rgba(50,50,50,0.92)'};
      color: #dfe4db;
      font-family: 'Manrope', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 10px 20px;
      border-radius: 999px;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(174,209,138,0.25);
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease, transform 0.25s ease;
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.opacity  = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(8px)';
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2800);
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Engr Shuvo Das – Digital Business Card',
        text: 'Connect with Engr Shuvo Das, Freelancer at Fiverr.',
        url: window.location.href,
      };

      // Try native Web Share API first (mobile / Safari / Edge)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          // Native sheet opened – no toast needed
        } catch (err) {
          if (err.name !== 'AbortError') {
            showToast('Could not share – try copying the link.');
          }
        }
      } else {
        // Clipboard fallback
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('🔗 Link copied to clipboard!');
        } catch (_) {
          showToast('Copy this URL: ' + window.location.href, false);
        }
      }

      // Ripple on the FAB too
      if (!prefersReducedMotion) {
        shareBtn.style.transform = 'scale(0.88)';
        setTimeout(() => (shareBtn.style.transform = ''), 150);
      }
    });
  }

  /* ============================================================
     9. SAVE CONTACT BUTTON
     – Generates a vCard (.vcf) file and triggers download
     – Swaps icon + label to a "Saved!" success state
  ============================================================ */
  const saveBtn = document.getElementById('btn-save-contact');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      /* ── Build vCard 3.0 string ── */
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

      /* ── Trigger download ── */
      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'engr-shuvo-das.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      /* ── Success state ── */
      const icon  = saveBtn.querySelector('.material-symbols-outlined');
      const delay = prefersReducedMotion ? 0 : 250;

      saveBtn.disabled = true;

      setTimeout(() => {
        if (icon) icon.textContent = 'check_circle';
        // Replace text node (last child)
        const textNodes = [...saveBtn.childNodes].filter(
          (n) => n.nodeType === Node.TEXT_NODE
        );
        textNodes.forEach((n) => (n.textContent = ' Saved!'));
        saveBtn.classList.add('saved');
      }, delay);

      showToast('✅ Contact saved to your device!');
    });
  }

})();
