import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  /**
   * The live origin unless a deployment overrides it.
   *
   * Canonicals, hreflang, og:image and the sitemap are all built from this. A preview
   * build served from another host with this left alone would tell crawlers that every
   * one of its pages really lives on the production domain, and would publish a sitemap
   * full of production URLs. Preview hosts set SITE_URL to their own origin; production
   * sets nothing and is unaffected.
   */
  site: process.env.SITE_URL || 'https://www.abusonbul-transporters.com',
  output: 'static',
  // Matches the directory-style output and the canonicals the sitemap already emits, so
  // internal links stop resolving through a redirect to a different URL than the canonical.
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ar: 'ar' },
      },
      // The 22 team profiles are 44 of the ~98 URLs. Left at the default they would eat
      // crawl budget from the company pages, which are what the site is trying to rank.
      serialize(item) {
        const path =
          new URL(item.url).pathname.replace(/^\/ar(?=\/|$)/, '').replace(/\/$/, '') || '/';
        if (path === '/') item.priority = 1.0;
        else if (/^\/(transport|project-services|logistics)$/.test(path)) item.priority = 0.9;
        else if (path.startsWith('/team/')) item.priority = 0.3;
        else item.priority = 0.7;
        return item;
      },
    }),
  ],
  vite: {
    build: {
      chunkSizeWarningLimit: 800,
    },
  },
});
