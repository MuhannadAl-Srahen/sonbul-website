/**
 * Turns raw client logo files into the WebP marks the carousel expects.
 *
 *   node scripts/import-logos.mjs <folder> [--write]
 *
 * Drop whatever the client sends into a folder, named after the company, and run this.
 * PNG, JPG, WebP and SVG all work. Each becomes `<name>.webp` in public/assets/companies
 * at the same 184x92 box the existing 32 sit in, letterboxed rather than cropped so a
 * wordmark is never clipped, and with transparency preserved.
 *
 * The filename you give it becomes the id used in src/data/clientLogos.ts, so name the
 * files in lower case with hyphens: "nestle-purelife.png", not "Nestle Pure Life.PNG".
 *
 * It only writes with --write. Without it you get a report and nothing changes.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = (await import(pathToFileURL(path.join(ROOT, 'node_modules/sharp/dist/index.mjs')).href)).default;

const OUT = path.join(ROOT, 'public/assets/companies');
// Matches the box the existing marks were built to.
const BOX = { width: 184, height: 92 };

const src = process.argv[2];
const WRITE = process.argv.includes('--write');

if (!src) {
  console.error('Give the folder holding the raw logo files, for example:\n');
  console.error('  node scripts/import-logos.mjs website-renovation-files/new-logos\n');
  process.exit(1);
}
const dir = path.resolve(ROOT, src);
if (!existsSync(dir)) {
  console.error(`No such folder: ${dir}`);
  process.exit(1);
}

const files = (await readdir(dir)).filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f));
if (!files.length) {
  console.error(`No image files in ${dir}. Expected png, jpg, webp or svg.`);
  process.exit(1);
}

const ids = [];
for (const file of files) {
  const id = path
    .basename(file, path.extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const raw = await readFile(path.join(dir, file));
  // `density` matters for SVG: rasterising at the default 72dpi makes a soft mark.
  const img = sharp(raw, { density: 384 });

  const out = await img
    .trim({ threshold: 10 })
    .resize({ ...BOX, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();

  const target = path.join(OUT, `${id}.webp`);
  const existed = existsSync(target);
  if (WRITE) await sharp(out).toFile(target);

  ids.push(id);
  console.log(
    `  ${file.padEnd(34)} -> ${(id + '.webp').padEnd(26)} ${String(Math.round(out.length / 1024)).padStart(3)} KB` +
      (existed ? '  (overwrites an existing mark)' : ''),
  );
}

console.log(`\n${files.length} logo(s) ${WRITE ? 'written to' : 'would be written to'} public/assets/companies`);
if (!WRITE) console.log('Dry run. Pass --write to generate.');

console.log('\nAdd these ids to ALL_LOGOS in src/data/clientLogos.ts:\n');
console.log('  ' + ids.map((i) => `'${i}'`).join(', ') + ',');
