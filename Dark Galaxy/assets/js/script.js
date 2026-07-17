/**
 * script.js – Engr Shuvo Das Digital Business Card (Dark Galaxy)
 */

(function () {
  'use strict';

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
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background = 'rgba(255, 255, 255, 0.2)';
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
        url: window.location.href, // Or hardcode canonical URL: 'https://engrshuvodas.github.io/Idento-Digital-Business-Card/Dark Galaxy/'
      };

      try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback: Copy to clipboard
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
