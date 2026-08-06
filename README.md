# Abu Sonbul Group — Website

Bilingual (English + Arabic, full RTL) marketing site for the Abu Sonbul Group: three
Jordanian companies under one owner.

| Company | Route | What it does |
|---|---|---|
| Abu Sonbul Arab Transporters | `/transport` | Cross-border trucking, Jordan ⇄ Saudi Arabia |
| Raed Abu Sonbul & Partner | `/project-services` | Manpower, camps, catering, equipment for remote sites |
| Abu Sonbul For Logistic Services | `/logistics` | Cargo handling and clearance at Jordan's border crossings |

`/` is the group hub. `/about`, `/services`, `/gallery`, `/team` and `/contact` are
group-level and shared. 99 pages in total, every one of them static.

## Stack

- **Astro 7**, `output: 'static'`, `trailingSlash: 'always'`
- **React 19** islands — only where something is genuinely interactive
- **Tailwind CSS 3**
- **i18next** for copy, with language as a build-time constant rather than runtime state
- **EmailJS** for the contact form
- `yet-another-react-lightbox` for the gallery, **lucide** for icons

## Quick start

```bash
npm install
cp .env.example .env     # fill in the EmailJS values, or the build will fail
npm run dev              # http://localhost:4321
npm run build            # astro check, then lint, then build
npm run preview
```

`npm run build` runs `astro check`, then `npm run lint`, then the build. Lint is
ESLint plus two data-integrity checks that cannot live in the app:

- `scripts/check-media.mjs` — every row of the photo manifest resolves to a file that
  exists, and no photo on disk is missing from the manifest
- `scripts/check-i18n-parity.mjs` — English and Arabic key trees are identical, no two
  namespace files declare the same top-level key, and every locale file is actually
  imported in `dictionaries.ts`

## Where things live

| To change | Edit |
|---|---|
| Any user-facing text | `src/i18n/locales/{en,ar}/*.json` — always both |
| A company's name, slug, nav, client logos | `src/data/companies.ts` |
| A company's hero, icons, colours, service links | `src/components/pages/companyChrome.ts` |
| Which photos a page shows | `src/data/media.ts` (tags), then any `PhotoStrip` query |
| Team members | `src/data/teamProfiles.ts` — this drives `getStaticPaths` |
| Border crossings / project case studies | `src/data/crossings.ts`, `src/data/projects.ts` |
| Phone, email, address, opening hours | `src/config/site.ts` |
| Redirects | `vercel.json`, `public/.htaccess` **and** `public/web.config` — all three |

## Things worth knowing before you edit

**Copy lives in two files at once.** Every string exists in `en/` and `ar/`. The parity
check fails the build if they drift, which is deliberate — a missing Arabic key renders
as the raw key path, not as English.

**Each locale file owns whole top-level keys.** `dictionaries.ts` shallow-spreads them,
so two files declaring `nav` would silently drop one.

**Slugs come from TypeScript, never from translated arrays.** A route keyed on an array
position changes its URL the moment a translator reorders the content.

**`src/data/companies.ts` must stay free of React and lucide** so `.astro` frontmatter can
import it without pulling the icon library into the server graph. Icons live in
`src/components/ui/companyIcons.ts`.

**Tailwind opacity modifiers must be on the scale** (`/5`, `/10`, `/20`…). `/6`, `/8` and
`/72` compile to nothing at all, with no warning. Use `/[0.06]` if you need an off-scale
value.

**`.rtl-flip` composes with other transforms** because it is written as Tailwind's own
transform chain. Do not simplify it back to `transform: scaleX(-1)` — that silently
cancels `rotate-*` and `translate-*` on the same element.

**Do not put `hero-img` on a photo containing signage or livery.** It mirrors the image in
RTL, which reverses any text baked into it.

## Deployment

Vercel, static output. `vercel.json` carries the redirects and security headers.
`public/.htaccess` and `public/web.config` mirror them for Apache and IIS and are copied
into `dist/` verbatim — if you add a redirect, add it in all three.

The three `PUBLIC_EMAILJS_*` variables must be set in the host's environment. They are
asserted at module scope, so a build without them fails loudly rather than shipping a
form that silently never sends.

## Open items

`website-renovation-files/INVENTED-FIGURES.md` lists the statistics on the site that were
written as filler during the restructure and still need real numbers.
