/**
 * script.js – Engr Shuvo Das Digital Business Card (Dynamic Influencer)
 */

(function () {
  'use strict';

  /* ============================================================
     CANVAS SOCIAL ICON ENGINE
  ============================================================ */
  const canvas = document.getElementById('social-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let icons = [];

    // Simple SVG paths for the floating background icons
    const pathHeart = new Path2D("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
    const pathPlay = new Path2D("M8 5v14l11-7z");
    const pathCircle = new Path2D("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z");
    // Twitter-like bird path (simplified)
    const pathBird = new Path2D("M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z");
    
    const iconShapes = [
      { path: pathHeart, color: 'rgba(255, 0, 122, 0.15)' },
      { path: pathPlay, color: 'rgba(0, 240, 255, 0.15)' },
      { path: pathCircle, color: 'rgba(121, 40, 202, 0.15)' },
      { path: pathBird, color: 'rgba(255, 255, 255, 0.08)' }
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function initIcons() {
      icons = [];
      const numIcons = Math.floor(window.innerWidth / 40);
      for (let i = 0; i < numIcons; i++) {
        const shape = iconShapes[Math.floor(Math.random() * iconShapes.length)];
        icons.push({
          x: Math.random() * width,
          y: Math.random() * height,
          scale: Math.random() * 2 + 1, // Size scale
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - 0.2, // slight upward bias
          shape: shape
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      icons.forEach(icon => {
        icon.x += icon.speedX;
        icon.y += icon.speedY;
        icon.rotation += icon.rotSpeed;

        // Wrap around screen
        if (icon.x < -50) icon.x = width + 50;
        if (icon.x > width + 50) icon.x = -50;
        if (icon.y < -50) icon.y = height + 50;
        if (icon.y > height + 50) icon.y = -50;

        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);
        ctx.scale(icon.scale, icon.scale);
        
        // Center the 24x24 SVG path roughly
        ctx.translate(-12, -12);

        ctx.fillStyle = icon.shape.color;
        ctx.fill(icon.shape.path);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initIcons();
    });

    resize();
    initIcons();
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
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3000);
  }

  /* ============================================================
     SAVE CONTACT BUTTON
  ============================================================ */
  const saveBtn = document.getElementById('btn-save-contact');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Engr Shuvo Das',
        'N:Das;Shuvo;;;',
        'ORG:Creator',
        'TITLE:Tech Influencer',
        'TEL;TYPE=CELL,VOICE:+919641700503',
        'EMAIL;TYPE=WORK:engrshuvoda@gmail.com',
        'ADR;TYPE=HOME:;;Gujarat;;;; India',
        'URL:https://youtube.com/',
        'END:VCARD',
      ].join('\r\n');

      const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'engr-shuvo-das.vcf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saved to Contacts!';
      // Solid neon color for success
      saveBtn.style.background = '#00f0ff';
      saveBtn.style.color = '#0b0f19';
      saveBtn.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.6)';
      saveBtn.style.transform = 'scale(0.96)';
      
      showToast('Contact successfully saved!');
    });
  }

  /* ============================================================
     SHARE BUTTON LOGIC
  ============================================================ */
  const shareBtn = document.getElementById('btn-share');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Engr Shuvo Das',
        text: 'Check out my links!',
        url: window.location.href,
      };

      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(shareData.url);
          showToast('Link copied to clipboard!');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    });
  }

})();
