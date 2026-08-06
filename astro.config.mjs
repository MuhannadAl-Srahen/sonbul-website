import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.abusonbul-transporters.com',
  output: 'static',
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
