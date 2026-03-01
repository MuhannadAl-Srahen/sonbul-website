# Abu Sonbul Arab Transporters — Website

Modern, bilingual (English + Arabic with full RTL) marketing site for Abu Sonbul Arab Transporters.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS** with logo color palette
- **Framer Motion** for smooth scroll animations
- **react-i18next** for bilingual content (EN / AR + RTL)
- **react-router-dom** for client routing
- **yet-another-react-lightbox** for the gallery viewer
- **Lucide** icons

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # produces dist/
npm run preview      # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── layout/      # Header, Footer, Layout
│   ├── ui/          # Reveal, PageHero, StatCounter
│   └── util/        # ScrollToTop, SEO helper
├── i18n/
│   └── locales/     # en.json, ar.json — ALL editable content
├── pages/           # Home, About, Services, Logistics, Gallery, Team, Contact
└── App.tsx          # Routes
public/
├── assets/          # Logos + gallery images
├── web.config       # IIS SPA rewrite
├── .htaccess        # Apache SPA rewrite
├── robots.txt
└── sitemap.xml
```

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) — uploads to abusonbul-transporters.com via FTP.

## Editing common things

| What | Where |
| --- | --- |
| Page text (EN) | `src/i18n/locales/en.json` |
| Page text (AR) | `src/i18n/locales/ar.json` |
| Colors / fonts | `tailwind.config.js` |
| Team members | `src/pages/Team.tsx` |
| Gallery images | drop in `public/assets/gallery/<cat>/` then add to `src/pages/Gallery.tsx` |
| Contact info | both locale JSON files + `src/components/layout/Footer.tsx` |
