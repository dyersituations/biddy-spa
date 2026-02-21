# Biddy SPA

## Commands

- `npm run dev`: start the Vite dev server.
- `npm run typecheck`: run TypeScript project checks.
- `npm run build`: generate SEO files, typecheck, build client + SSR bundle, and pre-render the homepage into `dist/index.html`.
- `npm run preview`: preview the production build.
- `npm run lint`: run ESLint.

## SEO Build Flow

- `scripts/generate-seo-files.mjs` creates `public/robots.txt` and `public/sitemap.xml`.
- `vite build --ssr src/entry-server.tsx` builds the server render entry.
- `scripts/prerender.mjs` renders `<App />` to HTML and injects it into `dist/index.html`.

## Configuration

- Canonical site URL is hardcoded to `https://biddyonthebench.com`.
- SEO generation always writes an indexable `robots.txt` and `sitemap.xml`.
