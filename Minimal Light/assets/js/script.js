/**
 * script.js – Engr Shuvo Das Digital Business Card (Minimal Light)
 */

(function () {
  'use strict';

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
      saveBtn.style.background = '#10b981'; // Green success color
      saveBtn.style.color = 'white';
      saveBtn.style.transform = 'scale(0.98)';
    });
  }

})();
