/**
 * script.js – Engr Shuvo Das Digital Business Card (Minimal Light)
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
     – 3-tier platform-aware vCard save for best UX on every device
     – Tier 1: iOS Safari  → data URI opens Contacts app natively
     – Tier 2: Android     → Blob .vcf download + guided toast
     – Tier 3: Desktop     → Blob .vcf download + desktop toast
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
      saveBtn.disabled = true;
      saveBtn.textContent = '✅ Saved!';
      saveBtn.style.background = '#10b981';
      saveBtn.style.color = 'white';
      saveBtn.style.transform = 'scale(0.98)';
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
        url: window.location.href, // Or hardcode canonical URL
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
