/**
 * Verifies that every row in src/data/media.ts points at files that actually exist, and
 * that no file on disk is missing from the manifest.
 *
 * media.ts is bundled for the browser so it cannot touch the filesystem; this is the
 * half of the guard that needs `fs`. Run via `npm run lint`.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const GALLERY = join(ROOT, 'public', 'assets', 'gallery');

const src = readFileSync(join(ROOT, 'src', 'data', 'media.ts'), 'utf8');

// The SEED array is plain object literals, so the ids can be read without executing TS.
const seedBlock = src.slice(src.indexOf('const SEED'), src.indexOf('const dirOf'));
const ids = [...seedBlock.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);

const errors = [];

if (!ids.length) errors.push('could not parse any ids out of the SEED array');

const claimed = new Set();
for (const id of ids) {
  const dir = id.replace(/-\d+$/, '');
  for (const file of [`${id}.webp`, `${id}-thumb.webp`]) {
    const path = join(GALLERY, dir, file);
    if (!existsSync(path)) errors.push(`missing file for manifest row ${id}: ${path}`);
  }
  claimed.add(`${dir}/${id}`);
}

for (const dir of readdirSync(GALLERY, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const file of readdirSync(join(GALLERY, dir.name))) {
    if (!file.endsWith('.webp') || file.includes('-thumb')) continue;
    const id = file.replace(/\.webp$/, '');
    if (!claimed.has(`${dir.name}/${id}`)) {
      errors.push(`photo on disk is missing from the manifest: ${dir.name}/${file}`);
    }
  }
}

if (errors.length) {
  console.error(`\n[check-media] ${errors.length} problem(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(`[check-media] ok — ${ids.length} photos, manifest and disk agree`);
