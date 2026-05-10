# Cerebro Software — Tech Stack

## Philosophy

No framework. Every Cerebro client site is plain HTML, CSS, and JavaScript. Reasons:
- Zero build tooling — no Webpack, Vite, bundlers, or node_modules to manage
- Fastest possible cold-start on Vercel (pure static)
- Easier to hand off: any developer can read and edit it
- Longevity: no dependency rot, no major-version migrations
- Full control over every byte — critical for cinematic performance animation

## Core Stack

| Layer | Choice | Version |
|-------|--------|---------|
| Markup | Vanilla HTML5 | — |
| Styles | Vanilla CSS (custom properties + clamp) | — |
| Logic | Vanilla JS (ES2020 modules via IIFE pattern) | — |
| 3D / particles | Three.js | r128 |
| Animation | GSAP + ScrollTrigger | 3.11.4 |
| Hosting | Vercel | — |
| Email | Resend API | — |
| Fonts | Google Fonts | — |

## CDN Links (copy-paste exact versions)

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- Before </body> — order matters -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
<script src="preloader.js"></script>
<script src="brain.js"></script>
<script src="footer-cluster.js"></script>
<script src="cursor.js"></script>
<script src="main.js"></script>
```

Script load order is strict: Three.js → GSAP → ScrollTrigger → site modules (each module is an IIFE that expects globals from the prior script).

## File Structure

```
project-root/
├── index.html
├── style.css
├── main.js
├── brain.js          (Three.js particle brain — if used)
├── preloader.js      (loading screen)
├── cursor.js         (custom cursor — desktop only)
├── footer-cluster.js (2D canvas particle footer)
├── vercel.json
└── api/
    └── contact.js    (Vercel serverless — Resend email)
```

**Flat root** — no `css/` or `js/` subfolders. Simpler `<link>` and `<script>` paths, easier file management, no confusion when Vercel deploys.

## Hosting: Vercel

Vercel auto-detects a static site with no framework. Any file inside `api/` becomes a serverless function (Node.js runtime). No `package.json` needed for the static site itself — only if you add npm dependencies to serverless functions (rare; Resend calls use native `fetch`).

Deployment: push to GitHub → Vercel auto-deploys on every commit to `main`.

### vercel.json (minimal)

```json
{
  "functions": {
    "api/*.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

## Email: Resend

- Sign up at resend.com, verify the client's sending domain (e.g. `cerebro.gr`)
- Add `RESEND_API_KEY` to Vercel dashboard → Settings → Environment Variables
- See `CEREBRO-CONTACT-FORM.md` for the full serverless function pattern
- Until domain is verified, use `from: 'onboarding@resend.dev'` for testing

## Fonts

- **Hanken Grotesk** — display font, weights 700/800/900. Used for all headlines, the brand wordmark, and navigation links in the mobile overlay.
- **Inter** — body font, weights 400/500. Used for body copy, labels, eyebrows, captions, form fields.

Both loaded via Google Fonts with `display=swap` to prevent FOIT.

CSS variable mapping:
```css
--ff-display: 'Hanken Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif;
--ff-body:    'Inter', system-ui, sans-serif;
```
