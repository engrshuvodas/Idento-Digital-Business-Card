<div align="center">
  
  # 📇 Idento
  
  ### **Digital Business Card Themes Gallery**
  
  <p align="center">
    <a href="https://engrshuvodas.github.io/Idento-Digital-Business-Card/">
      <img src="https://img.shields.io/badge/Live%20Demo-Active-brightgreen?style=for-the-badge&logo=github" alt="Live Demo" />
    </a>
    <a href="https://github.com/engrshuvodas/Idento-Digital-Business-Card/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/Stack-HTML5%20%7C%20JS-blue?style=for-the-badge&logo=html5" alt="Stack" />
  </p>

  <p><strong>Idento</strong> is a collection of 9 responsive, animated digital business cards. Built using pure front-end web technologies, these templates are fast, fully responsive, and feature a client-side vCard (.vcf) contact generator.</p>

  <h4>
    <a href="https://engrshuvodas.github.io/Idento-Digital-Business-Card/">Explore The Gallery Live</a>
  </h4>

</div>

---

## ⚡ Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <h4>🎨 9 Handcrafted Themes</h4>
      <p>Beautiful layouts tailored for freelancers, realtors, healthcare workers, financial advisors, and creators.</p>
    </td>
    <td width="50%">
      <h4>💾 vCard (.vcf) Generator</h4>
      <p>Generates and downloads contact files directly on the client-side so users can save your details instantly.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>🔗 Smart Share Menu</h4>
      <p>Integrates the native Web Share API on mobile devices, with a clipboard-copy and toast notification fallback on desktop.</p>
    </td>
    <td width="50%">
      <h4>✨ Micro-Interactions</h4>
      <p>Includes canvas particle effects, mouse-following glows, gyro-based mobile parallax, and button ripples.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h4>♿ Accessibility First</h4>
      <p>Respects system preferences like <code>prefers-reduced-motion</code> to automatically disable animations when requested.</p>
    </td>
    <td width="50%">
      <h4>⚡ Zero-Dependency Engine</h4>
      <p>Built with vanilla HTML and modern Javascript. No frameworks, libraries, npm packages, or build setups required.</p>
    </td>
  </tr>
</table>

---

## 🎨 Theme Catalog

<table width="100%">
  <thead>
    <tr>
      <th align="center">Icon</th>
      <th align="left">Theme Name</th>
      <th align="left">Style / Aesthetic</th>
      <th align="left">Target Role</th>
      <th align="left">Key Visual Effect</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">🌿</td>
      <td><strong>Forest Glass</strong></td>
      <td>Green & Cyan, Glassmorphism</td>
      <td>Creative Freelancers</td>
      <td>Animated blobs, bokeh parallax</td>
    </tr>
    <tr>
      <td align="center">☀️</td>
      <td><strong>Minimal Light</strong></td>
      <td>Slate & White, Light Mode</td>
      <td>Executive & Corporate</td>
      <td>Minimal shadows, sleek borders</td>
    </tr>
    <tr>
      <td align="center">🌌</td>
      <td><strong>Dark Galaxy</strong></td>
      <td>Blue & Indigo, Dark Glass</td>
      <td>Tech & Developers</td>
      <td>Floating starfields, glass cards</td>
    </tr>
    <tr>
      <td align="center">🌸</td>
      <td><strong>Rose Glass</strong></td>
      <td>Pink & Purple, Soft Glass</td>
      <td>Beauty & Creators</td>
      <td>Rising background bubbles</td>
    </tr>
    <tr>
      <td align="center">✨</td>
      <td><strong>Dynamic Influencer</strong></td>
      <td>Neon Pink & Blue, Dark Neon</td>
      <td>Influencers & Artists</td>
      <td>Floating badges, neon outlines</td>
    </tr>
    <tr>
      <td align="center">🏛️</td>
      <td><strong>Luxury Estate</strong></td>
      <td>Navy & Gold, Premium Dark</td>
      <td>Real Estate & High-end</td>
      <td>Gold constellation star map</td>
    </tr>
    <tr>
      <td align="center">🩺</td>
      <td><strong>Medical Pro</strong></td>
      <td>Blue & Medical Teal, Light</td>
      <td>Doctors & Healthcare</td>
      <td>ECG heartbeat, pulsing rings</td>
    </tr>
    <tr>
      <td align="center">📈</td>
      <td><strong>Trust Finance</strong></td>
      <td>Emerald & Mint, Dark Grid</td>
      <td>Advisors & Analysts</td>
      <td>Glowing chart background grid</td>
    </tr>
    <tr>
      <td align="center">🍁</td>
      <td><strong>Green Earth</strong></td>
      <td>Forest & Amber, Night Nature</td>
      <td>Eco brands & Botanists</td>
      <td>Falling leaves & fireflies</td>
    </tr>
  </tbody>
</table>

---

## ⚙️ Customization Guide

<details>
<summary><b>1. How to change the Profile Picture</b></summary>
<br>
Place your profile image inside the assets directory of your selected theme:
<pre><code>[Theme Directory]/assets/images/your-photo.png</code></pre>
Then open <code>index.html</code> and edit the image tag src attribute:
<pre><code>&lt;img src="assets/images/your-photo.png" alt="Your Name Professional Headshot" class="avatar-img" /&gt;</code></pre>
</details>

<details>
<summary><b>2. How to update Personal & Social Info</b></summary>
<br>
Open <code>index.html</code> of your theme and edit the header text:
<pre><code>&lt;h1 class="profile-name"&gt;Your Name&lt;/h1&gt;
&lt;p class="profile-title"&gt;Your Title | Company&lt;/p&gt;</code></pre>
Modify the contact link buttons to match your accounts:
<pre><code>&lt;a href="https://instagram.com/yourprofile" class="action-btn"&gt;
  ...
&lt;/a&gt;</code></pre>
</details>

<details>
<summary><b>3. How to edit the Contact Downloader (vCard Details)</b></summary>
<br>
Open <code>assets/js/script.js</code> and locate the vCard builder at the bottom of the script. Edit the properties:
<pre><code>const vcard = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'FN:Your Full Name',
  'N:LastName;FirstName;;;',
  'ORG:Your Company',
  'TITLE:Your Title',
  'TEL;TYPE=CELL,VOICE:+1234567890',
  'EMAIL;TYPE=WORK:your.email@example.com',
  'ADR;TYPE=HOME:;;City;State;Zip;Country',
  'URL:https://linkedin.com/in/yourusername',
  'END:VCARD'
].join('\r\n');</code></pre>
</details>

---

## 🚀 Deployment Guide

<details>
<summary><b>Deploying to GitHub Pages</b></summary>
<br>
<ol>
  <li>Push the repository to GitHub.</li>
  <li>Open the repository page and click on <b>Settings</b>.</li>
  <li>Scroll down to <b>Pages</b> on the left sidebar.</li>
  <li>Set the source build and deployment branch to <code>main</code> (or your default branch) and folder to <code>/ (root)</code>.</li>
  <li>Click <b>Save</b>. Your site will be published at <code>https://[your-username].github.io/Idento-Digital-Business-Card/</code></li>
</ol>
</details>

---

<div align="center">
  <p>Designed and crafted by <a href="https://github.com/engrshuvodas">Engr Shuvo Das</a></p>
</div>




bf