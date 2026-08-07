/**
 * Appends new photos to the gallery library without rebuilding it.
 *
 *   node scripts/import-media.mjs [--write]
 *
 * build-media.mjs rebuilds every derivative from the full media-src archive and deletes
 * each category folder first. That archive is gitignored and no longer on disk, so it
 * cannot be used to add a photo any more. This script is the additive path: it reads
 * originals from an incoming folder, writes the next free numbered derivatives into the
 * category folders, and touches nothing that already exists.
 *
 * Same output contract as build-media.mjs, so the two are indistinguishable downstream:
 *   <cat>-NN-thumb.webp  600x600 cover crop for the grid tile
 *   <cat>-NN.webp        long edge <= 1600 for the lightbox
 *
 * PLAN is the record of which incoming file became which derivative. Indices are 1-based
 * positions in the sorted listing of each folder. Re-running with the same PLAN and the
 * same sources reproduces the same files.
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = (await import(pathToFileURL(path.join(ROOT, 'node_modules/sharp/dist/index.mjs')).href)).default;

const INCOMING = path.join(ROOT, 'website-renovation-files/New-pictures');
const OUT_GALLERY = path.join(ROOT, 'public/assets/gallery');
const THUMB = 600;
const FULL_MAX = 1600;
const WRITE = process.argv.includes('--write');

/**
 * One entry per incoming folder, reviewed on a contact sheet before being written down.
 *
 * `skip` lists indices that are already in the library or repeat another incoming shot,
 * with the reason, so a later reviewer does not "helpfully" add them back.
 * `assign` maps a category to the indices that belong in it, and `tags` maps an index to
 * what the photo actually shows. Anything not in `assign` or `skip` is an error.
 */
const PLAN = [
  {
    folder: 'Adnoc Images',
    baseTags: ['adnoc'],
    skip: {
      7: 'already in the library as catering-09',
      11: 'already in the library as projects-08, differently cropped',
      24: 'already in the library as camps-18, differently cropped',
    },
    assign: {
      catering: [1, 2, 3, 4, 5, 6, 8, 12, 14, 16, 22, 23, 25],
      camps: [9, 10, 13, 15, 17, 18, 19, 20, 21, 26],
    },
    tags: {
      1: ['kitchen'], 2: ['kitchen'], 3: ['dining'], 4: ['warehouse'], 5: ['warehouse'],
      6: ['kitchen', 'crew'], 8: ['dining'], 9: ['site'], 10: ['site'], 12: ['dining'],
      13: ['recreation'], 14: ['dining'], 15: ['accommodation'], 16: ['kitchen'],
      17: ['site'], 18: ['accommodation'], 19: ['site'], 20: ['recreation'],
      21: ['recreation'], 22: ['dining'], 23: ['dining'], 25: ['warehouse'], 26: ['site'],
    },
  },
  {
    folder: 'Argas - Acommodation and Laundries',
    baseTags: ['argas', 'al-jaffr'],
    skip: {},
    assign: {
      camps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22],
      catering: [19],
    },
    tags: {
      1: ['accommodation'], 2: ['accommodation'], 3: ['accommodation'], 4: ['ablutions'],
      5: ['laundry'], 6: ['laundry'], 7: ['site'], 8: ['accommodation'], 9: ['crew'],
      10: ['laundry'], 11: ['ablutions'], 12: ['ablutions'], 13: ['ablutions'],
      14: ['crew'], 15: ['site'], 16: ['site'], 17: ['crew'], 18: ['laundry'],
      19: ['dining'], 20: ['accommodation'], 21: ['site'], 22: ['hygiene'],
    },
  },
  {
    // The RO plant and the switchgear are site infrastructure, so they belong with the
    // camps set. `equipment` on this site means heavy plant, forklifts and cranes.
    folder: 'Argas - Maintenance & RO station',
    baseTags: ['argas', 'al-jaffr'],
    skip: {},
    assign: {
      camps: [1, 2, 3, 4, 5, 6, 7, 8, 10],
      catering: [9],
    },
    tags: {
      1: ['site'], 2: ['site'], 3: ['site'], 4: ['site'], 5: ['site'], 6: ['site'],
      7: ['site'], 8: ['site'], 9: ['kitchen'], 10: ['site'],
    },
  },
  {
    folder: 'Argas - Serviices - Food and water',
    baseTags: ['argas', 'al-jaffr'],
    skip: { 15: 'same kitchen crew as 12, taken seconds apart' },
    assign: {
      catering: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37,
      ],
      camps: [36],
    },
    tags: {
      1: ['warehouse'], 2: ['kitchen'], 3: ['kitchen'], 4: ['kitchen'], 5: ['warehouse'],
      6: ['warehouse'], 7: ['warehouse'], 8: ['warehouse'], 9: ['kitchen'], 10: ['dining'],
      11: ['kitchen'], 12: ['kitchen', 'crew'], 13: ['dining'], 14: ['dining'],
      16: ['kitchen'], 17: ['dining'], 18: ['dining'], 19: ['dining'], 20: ['dining'],
      21: ['dining'], 22: ['dining'], 23: ['dining'], 24: ['dining'], 25: ['dining'],
      26: ['dining'], 27: ['kitchen'], 28: ['dining'], 29: ['dining'], 30: ['dining'],
      31: ['dining'], 32: ['kitchen'], 33: ['dining'], 34: ['dining'], 35: ['dining'],
      36: ['recreation'], 37: ['dining'],
    },
  },
];

/**
 * Where each category stood before this import, so numbering continues from there.
 *
 * Fixed rather than measured off the current contents. Reading the highest existing
 * index at runtime made the script append a second full copy of every photo when it was
 * run twice, because by then its own output was what it measured. With the baseline
 * pinned, a re-run rewrites exactly the same names and is a no-op.
 */
const BASELINE = { transport: 26, equipment: 11, camps: 20, catering: 12, projects: 9 };

const next = {};
const rows = [];
let written = 0;
let bytes = 0;
let sourceBytes = 0;

for (const entry of PLAN) {
  const dir = path.join(INCOMING, entry.folder);
  if (!existsSync(dir)) throw new Error(`missing incoming folder: ${entry.folder}`);
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

  // Every file must be either assigned or explicitly skipped, so nothing is lost silently.
  const assigned = new Map();
  for (const [category, indices] of Object.entries(entry.assign))
    for (const i of indices) {
      if (assigned.has(i)) throw new Error(`${entry.folder}: index ${i} assigned twice`);
      assigned.set(i, category);
    }
  for (let i = 1; i <= files.length; i++)
    if (!assigned.has(i) && !(i in entry.skip))
      throw new Error(`${entry.folder}: index ${i} (${files[i - 1]}) is neither assigned nor skipped`);
  for (const i of assigned.keys())
    if (i > files.length) throw new Error(`${entry.folder}: index ${i} is past the end (${files.length} files)`);

  for (let i = 1; i <= files.length; i++) {
    const category = assigned.get(i);
    if (!category) continue;
    const src = path.join(dir, files[i - 1]);

    next[category] ??= BASELINE[category] ?? 0;
    const n = ++next[category];
    const name = `${category}-${String(n).padStart(2, '0')}`;
    const outDir = path.join(OUT_GALLERY, category);

    sourceBytes += (await stat(src)).size;
    const tags = [...entry.baseTags, ...(entry.tags[i] ?? [])];
    rows.push(`  { id: '${name}', tags: [${tags.map((t) => `'${t}'`).join(', ')}] },`);

    if (!WRITE) continue;
    await mkdir(outDir, { recursive: true });
    // .rotate() with no argument applies the EXIF orientation and then drops the tag, so
    // the pixels are upright for every consumer. Phone photos are routinely sideways.
    const load = () => sharp(src).rotate();

    const thumb = await load()
      .resize(THUMB, THUMB, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 70 })
      .toFile(path.join(outDir, `${name}-thumb.webp`));
    const full = await load()
      .resize(FULL_MAX, FULL_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(outDir, `${name}.webp`));

    written += 2;
    bytes += thumb.size + full.size;
  }

  const skipped = Object.entries(entry.skip);
  console.log(
    `  ${entry.folder}: ${files.length - skipped.length} imported, ${skipped.length} skipped`,
  );
  for (const [i, why] of skipped) console.log(`      skip ${i} (${files[i - 1]}): ${why}`);
}

console.log(`\nnext free index per category: ${JSON.stringify(next)}`);
if (WRITE) {
  console.log(`${written} files written, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `sources were ${(sourceBytes / 1024 / 1024).toFixed(2)} MB, ` +
      `derivatives are ${(bytes / 1024 / 1024).toFixed(2)} MB`,
  );
} else {
  console.log('dry run, nothing written. Pass --write to generate.');
}

console.log('\n--- rows for src/data/media.ts ---');
console.log(rows.join('\n'));
