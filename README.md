# 📇 Idento - Digital Business Card Themes

[![GitHub pages](https://img.shields.io/badge/GitHub%20Pages-Active-brightgreen.svg)](https://engrshuvodas.github.io/Idento-Digital-Business-Card/)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20(ES6)-blue.svg)](#-zero-dependency-performance)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Idento** is a premium collection of **9 responsive, animated digital business cards** designed to help freelancers, realtors, healthcare professionals, financial advisors, and creators build a striking online presence. 

Built with pure, modern vanilla web technologies, these templates are fast, fully responsive, highly interactive, and come equipped with an automatic client-side vCard (.vcf) contact generator.

> [!TIP]
> **Live Demo:** You can explore the live interactive gallery and test all themes at [engrshuvodas.github.io/Idento-Digital-Business-Card](https://engrshuvodas.github.io/Idento-Digital-Business-Card/).

---

## ✨ Key Features

*   🎨 **9 Handcrafted Premium Themes:** From high-end luxury layouts to glassmorphic or neon-lit profiles, choose a vibe that fits your profession perfectly.
*   💾 **Client-Side vCard (.vcf) Generator:** A single click on the "Save Contact" button automatically packages your details into a standard vCard file and starts the download so users can add you to their contacts instantly.
*   🔗 **Smart Web Share API:** Utilizes native device sharing sheets on mobile browsers (Safari/Chrome/Edge) with a fallback to clipboard copying and animated toast alerts on desktop.
*   ✨ **Premium Micro-Interactions & Parallax:** Includes interactive particle systems on HTML5 canvases, mouse-following blur glows, gyro-based mobile tilt effects, and ripple buttons.
*   ♿ **Motion-Sensitive Accessibility:** Fully respects the user's OS preference via the `prefers-reduced-motion` media query, disabling animations gracefully for a solid static experience.
*   ⚡ **Zero-Dependency Engine:** 100% vanilla HTML, custom CSS variables, and clean JavaScript. No complex build chains, npm modules, or frameworks required.

---

## 🎨 Theme Catalog

| Theme Icon | Theme Name | Accent Colors / Style | Best Suited For | Key Animation / Visual Effect |
| :---: | :--- | :--- | :--- | :--- |
| 🌿 | **Forest Glass** | Green & Cyan Gradient, Glassmorphism | Creative Freelancers | Animated background blobs, bokeh parallax |
| ☀️ | **Minimal Light** | Soft Slate, Light Mode | Executive & Corporate | Clean borders, elegant typography, minimalist shadows |
| 🌌 | **Dark Galaxy** | Sky Blue & Indigo, Dark Glass | Developers & Tech Stars | Floating starfields, translucent action cards |
| 🌸 | **Rose Glass** | Pink & Purple, Soft Glass | Creators & Beauty | Rising animated background bubbles |
| ✨ | **Dynamic Influencer** | Hot Pink & Blue, Neon Dark | Social Creators & Artists | Neon outline glows, floating social media brand badges |
| 🏛️ | **Luxury Estate** | Deep Navy & Gold | Realtors & Luxury Brands | Golden constellation background, premium golden highlights |
| 🩺 | **Medical Pro** | Blue & Medical Teal | Doctors & Healthcare | Animated ECG heartbeat line, pulsing rings |
| 📈 | **Trust Finance** | Emerald Green & Mint, Dark Chart | Advisors & Stock Analysts | Glowing dynamic grid chart background |
| 🍁 | **Green Earth** | Forest Green & Amber, Deep Night | Eco brands & Nature | Falling leaves, floating fireflies, tree silhouettes |

---

## 🛠️ How to Customize Your Card

Customizing a template with your personal information takes just a few steps:

### 1. Replace the Avatar Image
*   Place your professional headshot image in the `assets/images/` directory of your chosen theme (e.g. `Forest Glass/assets/images/`).
*   Open `index.html` and look for the profile header section. Update the image source:
    ```html
    <img src="assets/images/your-photo.png" alt="Your Name Professional Headshot" class="avatar-img" />
    ```

### 2. Update Personal Details & Social Links
*   Open `index.html` and change the text in the headers:
    ```html
    <h1 class="profile-name">Your Name</h1>
    <p class="profile-title">Your Job Title | Your Company</p>
    ```
*   Update the links (`href` attributes) in the actions navigation list (`<nav class="actions-list">`) to point to your Instagram, WhatsApp, Email, LinkedIn, Google Maps location, etc.

### 3. Customize the Save Contact Button (vCard)
Open `assets/js/script.js` and locate the vCard generator block at the bottom of the script (usually around line 430). Modify the details inside the array to match yours:

```javascript
const vcard = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'FN:Your Full Name',
  'N:LastName;FirstName;;;',
  'ORG:Your Company Name',
  'TITLE:Your Professional Title',
  'TEL;TYPE=CELL,VOICE:+1234567890',          // Your phone number
  'EMAIL;TYPE=WORK:your.email@example.com',    // Your email
  'ADR;TYPE=HOME:;;City;State;Zip;Country',   // Your address
  'URL:https://linkedin.com/in/yourusername', // Your portfolio or LinkedIn URL
  'END:VCARD'
].join('\r\n');
```
*   Update the filename to match yours (e.g., change `'engr-shuvo-das.vcf'` to `'your-name.vcf'`).

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

Since the project uses purely static front-end code, you can host it for free on GitHub Pages:

1.  Push the repository code to your GitHub account.
2.  Navigate to your repository page on GitHub.
3.  Go to **Settings** -> **Pages** (under the Code and automation section).
4.  Under **Build and deployment**, set the source to **Deploy from a branch**.
5.  Select your main branch (e.g. `main`) and the root folder `/`, then click **Save**.
6.  Your site will be live at `https://<your-github-username>.github.io/Idento-Digital-Business-Card/` within a minute!

---

## 🔒 Performance & Accessibility

*   **Responsive Images:** Image assets are loaded with optimal sizes and configured with `loading="eager"` or `loading="lazy"` according to position.
*   **Accessible Markup:** Utilizes semantic HTML tags (`<header>`, `<main>`, `<article>`, `<nav>`, `<footer>`) and explicit accessibility labels (`aria-label`, `aria-hidden`) for screen readers.
*   **Performance First:** The WebGL/Canvas canvas animations are optimized using active resource management in a `requestAnimationFrame` render loop, reducing GPU/CPU battery drain.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Designed and crafted with ❤️ by [Engr Shuvo Das](https://github.com/engrshuvodas).*