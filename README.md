# Rickey — Minimal Portfolio (React + Tailwind)

Black–and–white, sleek starter with smooth scrolling and scrollspy.

## Quick start

```bash
npm install
npm run dev
```

Edit placeholder content in `src/data/content.js`. Put your real domain in `public/CNAME` if you use a custom domain on GitHub Pages.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push to a GitHub repo with default branch `main`.
2. In your repo settings: **Pages → Build and deployment → Source: GitHub Actions**.
3. If using a **custom domain**, set it in repo **Pages → Custom domain** and edit `public/CNAME`.
4. On every push to `main`, the site will be built and deployed.

> If you are *not* using a custom domain and deploy to a project page like `username.github.io/repo`, update `vite.config.js`:
> ```js
> export default defineConfig({ base: '/<repo-name>/' })
> ```

## Notes

- Typography: **Inter** (headings bold, body regular).
- Color: strictly **black & white** (no accents).
- Smooth scrolling + active section highlight (scrollspy).
- Three icon-only buttons in the top nav: LinkedIn, GitHub, Email.
