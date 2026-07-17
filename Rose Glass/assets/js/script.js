/**
 * script.js – Engr Shuvo Das Digital Business Card (Rose Glass)
 */

(function () {
  'use strict';

  /* ============================================================
     CANVAS BUBBLE ENGINE
  ============================================================ */
  const canvas = document.getElementById('bubble-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let bubbles = [];

    // Resize canvas
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    // Initialize bubbles
    function initBubbles() {
      bubbles = [];
      const numBubbles = Math.floor(window.innerWidth / 30); // scale with screen size
      for (let i = 0; i < numBubbles; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 30 + 10,
          speed: Math.random() * 0.8 + 0.2, // slow rise
          opacity: Math.random() * 0.4 + 0.1, // very soft
          wobble: Math.random() * Math.PI * 2, // phase
          wobbleSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach(b => {
        // Update position
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        b.x += Math.sin(b.wobble) * 0.5;

        // Reset if it floats off top
        if (b.y + b.radius < 0) {
          b.y = height + b.radius;
          b.x = Math.random() * width;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        
        // Soft white gradient for bubble
        const gradient = ctx.createRadialGradient(
          b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
          b.x, b.y, b.radius
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${b.opacity + 0.2})`);
        gradient.addColorStop(0.8, `rgba(255, 255, 255, ${b.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Subtle crisp edge
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      resize();
      initBubbles();
    });

    resize();
    initBubbles();
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

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3000);
  }

  /* ============================================================
     SAVE CONTACT BUTTON
     – Generates a vCard (.vcf) file and triggers download
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
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background = '#814c5c'; // Darker rose for success
      saveBtn.style.boxShadow = 'none';
      saveBtn.style.transform = 'scale(0.98)';
      
      showToast('Contact saved to your device!');
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
        text: 'Check out my digital business card!',
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
