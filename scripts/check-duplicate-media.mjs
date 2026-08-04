/**
 * Reports visually duplicate images shipped in public/assets.
 *
 *   node scripts/check-duplicate-media.mjs [maxDistance]
 *
 * Compares a 64-bit dHash (9x8 grayscale, horizontal gradient) of every image and prints any
 * pair within `maxDistance` Hamming distance — so it catches re-encodes, resizes and crops that
 * a checksum would miss. Exits 1 if anything is found, so it can gate a build.
 *
 * Thumbnails are compared against thumbnails only; a photo and its own -thumb derivative are
 * expected to match and are skipped.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = (await import(pathToFileURL(path.join(ROOT, 'node_modules/sharp/dist/index.mjs')).href)).default;

const ASSETS = path.join(ROOT, 'public/assets');
const MAX_DISTANCE = Number(process.argv[2] ?? 10);
// Client logos are small flat marks that collide constantly on a perceptual hash.
const SKIP = /[\\/](companies|logo)[\\/]/;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name) && !SKIP.test(p)) out.push(p);
  }
  return out;
}

async function dhash(file) {
  const buf = await sharp(file).grayscale().resize(9, 8, { fit: 'fill' }).raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits = (bits << 1n) | (buf[y * 9 + x] > buf[y * 9 + x + 1] ? 1n : 0n);
    }
  }
  return bits;
}

const hamming = (a, b) => {
  let v = a ^ b;
  let d = 0;
  while (v) { d += Number(v & 1n); v >>= 1n; }
  return d;
};

const files = await walk(ASSETS);
const records = [];
for (const file of files) {
  records.push({
    file: path.relative(ROOT, file),
    isThumb: file.includes('-thumb.'),
    hash: await dhash(file),
    kb: Math.round((await stat(file)).size / 1024),
  });
}

const pairs = [];
for (let i = 0; i < records.length; i++) {
  for (let j = i + 1; j < records.length; j++) {
    const a = records[i];
    const b = records[j];
    // A full-size image and its own thumbnail are the same picture by design.
    if (a.isThumb !== b.isThumb) continue;
    const d = hamming(a.hash, b.hash);
    if (d <= MAX_DISTANCE) pairs.push({ d, a, b });
  }
}

pairs.sort((x, y) => x.d - y.d);
for (const { d, a, b } of pairs) {
  console.log(`d=${String(d).padStart(2)}  ${a.file} (${a.kb} KB)\n      ${b.file} (${b.kb} KB)`);
}

console.log(
  `\n${records.length} images checked, ${pairs.length} duplicate pair(s) at Hamming <= ${MAX_DISTANCE}`,
);
process.exit(pairs.length ? 1 : 0);
