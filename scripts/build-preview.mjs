/**
 * Builds the site for a client-preview host.
 *
 *   npm run build:preview -- https://abo-sonbol-preview.pages.dev
 *
 * The preview is a second copy of the whole site under a second set of URLs. Built with
 * the normal command it would carry production canonicals, production hreflang and a
 * sitemap full of production URLs, which is a duplicate competing with the live site. So
 * this sets the origin to the preview host and forces every page to noindex.
 *
 * It exists as a script because the two variables have to be set for the build and the
 * syntax for that differs between PowerShell and sh. Getting it wrong does not fail: it
 * quietly produces a preview that tells crawlers it is the real site.
 */
import { spawnSync } from 'node:child_process';

const url = (process.argv[2] ?? process.env.SITE_URL ?? '').trim().replace(/\/$/, '');

if (!url) {
  console.error('Give the preview origin, for example:\n');
  console.error('  npm run build:preview -- https://abo-sonbol-preview.pages.dev\n');
  process.exit(1);
}
if (!/^https?:\/\/[^/]+$/.test(url)) {
  console.error(`"${url}" is not an origin. Expected scheme and host only, no path.`);
  process.exit(1);
}

console.log(`Building for ${url} (noindex)\n`);

// One string rather than a command plus args: `shell` is needed because npm is a .cmd on
// Windows and will not spawn without one, and passing a separate args array alongside it
// is deprecated, since those args would be concatenated into the shell line unescaped.
const run = spawnSync('npm run build', {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SITE_URL: url, PUBLIC_PREVIEW: '1' },
});

if (run.status !== 0) process.exit(run.status ?? 1);

console.log(`\nBuilt to dist/ for ${url}`);
console.log('Deploy it with:\n');
console.log(`  npx wrangler pages deploy dist --project-name=${new URL(url).hostname.split('.')[0]}`);
