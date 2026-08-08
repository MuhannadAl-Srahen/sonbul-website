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

/**
 * Clears the background by flooding inward from the edges.
 *
 * The slider sits on tinted surfaces and thirty of the existing thirty-two marks are
 * transparent, so a logo that arrives as a JPEG on white would show as a pale rectangle
 * among them. Simply making every white pixel transparent is not the answer: it would
 * punch through Nestle's white lettering and the gaps inside the CAT wordmark. Only
 * background reachable from the edge is removed, so anything enclosed by the artwork
 * survives.
 *
 * It runs twice. One pass clears whatever colour the border actually is, which for a
 * logo that arrives matted on black is the frame; the second clears the white sheet
 * underneath that the frame was hiding.
 */
function clearBackground(data, w, h, tolerance = 38) {
  const near = (i, r, g, b) =>
    Math.abs(data[i] - r) <= tolerance &&
    Math.abs(data[i + 1] - g) <= tolerance &&
    Math.abs(data[i + 2] - b) <= tolerance;

  for (const seed of ['edge', 'white']) {
    // Sample the colour to clear from the first pixel still opaque at a corner.
    let sr = 255, sg = 255, sb = 255;
    if (seed === 'edge') {
      const corners = [0, (w - 1) * 4, (h - 1) * w * 4, (h * w - 1) * 4];
      const opaque = corners.find((c) => data[c + 3] > 0);
      if (opaque === undefined) continue;
      [sr, sg, sb] = [data[opaque], data[opaque + 1], data[opaque + 2]];
    }

    const queue = [];
    const seen = new Uint8Array(w * h);
    const visit = (px, py) => {
      if (px < 0 || py < 0 || px >= w || py >= h) return;
      const p = py * w + px;
      if (seen[p]) return;
      const i = p * 4;
      // Already cleared pixels are passable, so the flood reaches under a cleared frame.
      if (data[i + 3] !== 0 && !near(i, sr, sg, sb)) return;
      seen[p] = 1;
      data[i + 3] = 0;
      queue.push(p);
    };

    for (let x = 0; x < w; x++) { visit(x, 0); visit(x, h - 1); }
    for (let y = 0; y < h; y++) { visit(0, y); visit(w - 1, y); }

    while (queue.length) {
      const p = queue.pop();
      const px = p % w;
      const py = (p - px) / w;
      visit(px + 1, py);
      visit(px - 1, py);
      visit(px, py + 1);
      visit(px, py - 1);
    }
  }
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
  const { data, info } = await sharp(raw, { density: 384 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  clearBackground(data, info.width, info.height);

  const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
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
