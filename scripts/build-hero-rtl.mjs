/**
 * Builds the RTL counterpart of the truck hero.
 *
 *   node scripts/build-hero-rtl.mjs
 *
 * The hero text sits on the left in English and on the right in Arabic, but the cab is
 * on the right of the photo, so in Arabic the copy lands straight on top of it. Simply
 * mirroring the photo in CSS fixes the composition and reverses "ABU SONBUL" and "IVECO"
 * with it, which is worse than the problem.
 *
 * So the whole frame is mirrored, and then each patch of lettering is pasted back from
 * the unmirrored original at its new position. The result reads correctly and puts the
 * cab on the left, clear of the Arabic copy.
 *
 * Every patch sits on locally uniform bodywork: flat red door, or the black grille plate
 * whose slats are horizontal and so survive a horizontal flip unchanged.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = (await import(pathToFileURL(path.join(ROOT, 'node_modules/sharp/dist/index.mjs')).href)).default;

const SRC = path.join(ROOT, 'public/assets/hero/hero.webp');
const OUT = path.join(ROOT, 'public/assets/hero/hero-rtl.webp');

/**
 * Lettering to keep readable, in original-image coordinates.
 *
 * `lo` is the luminance that separates a glyph from the panel behind it, used only to
 * measure the panel's own colour. `dark` marks the one patch whose lettering is darker
 * than its panel rather than lighter, so the test flips.
 */
const TEXT = [
  { name: 'cab door "ABU SONBUL / Transport & logistics"', left: 978, top: 448, width: 116, height: 54, lo: 105 },
  { name: 'cab door fleet number "206"', left: 1074, top: 500, width: 50, height: 32, lo: 105 },
  { name: 'grille "IVECO"', left: 1296, top: 524, width: 134, height: 50, lo: 70 },
  { name: 'grille plate "ABU SONBUL"', left: 1288, top: 570, width: 146, height: 34, lo: 70 },
  // Illegible at any real viewing size, but it is lettering and it would be backwards.
  { name: 'trailer legend "TRAILER CO., INC. / MAX LOAD"', left: 846, top: 547, width: 76, height: 38, lo: 110, dark: true },
];

const { width, height } = await sharp(SRC).metadata();

const lum = (d, i) => 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];

/** Mean colour of the panel a patch sits on, ignoring the glyphs themselves. */
function panelMean(data, lo, dark) {
  const sum = [0, 0, 0];
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    const isGlyph = dark ? lum(data, i) < lo : lum(data, i) >= lo;
    if (isGlyph) continue;
    sum[0] += data[i];
    sum[1] += data[i + 1];
    sum[2] += data[i + 2];
    n++;
  }
  return n ? sum.map((s) => s / n) : [0, 0, 0];
}

const FEATHER = 6;
const flopped = await sharp(SRC).flop().toBuffer();
const patches = [];

for (const t of TEXT) {
  if (t.left + t.width > width || t.top + t.height > height)
    throw new Error(`patch "${t.name}" falls outside the ${width}x${height} frame`);

  // A pixel at x lands at width-1-x once mirrored, so the rect starts at width-left-w.
  const destLeft = width - t.left - t.width;

  const src = (
    await sharp(SRC).extract(t).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  ).data;
  const dest = (
    await sharp(flopped)
      .extract({ left: destLeft, top: t.top, width: t.width, height: t.height })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
  ).data;

  /*
   * The whole rectangle is pasted, not just the glyphs. Masking to the glyphs alone left
   * the mirrored lettering underneath still showing, so the two read on top of each
   * other. Covering the rectangle hides it, at the cost of bringing the panel's original
   * shading into a mirrored frame, which showed as a faint box.
   *
   * So the patch is shifted onto the tone of the panel it is landing on, measured from
   * the non-glyph pixels of both, and its edges are faded. What is left is the lettering
   * the right way round on bodywork that matches its surroundings.
   */
  const from = panelMean(src, t.lo, t.dark);
  const to = panelMean(dest, t.lo, t.dark);
  const shift = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];

  for (let i = 0; i < src.length; i += 4) {
    for (let c = 0; c < 3; c++) src[i + c] = Math.max(0, Math.min(255, Math.round(src[i + c] + shift[c])));
    const x = (i / 4) % t.width;
    const y = Math.floor(i / 4 / t.width);
    const d = Math.min(x, y, t.width - 1 - x, t.height - 1 - y);
    src[i + 3] = d >= FEATHER ? 255 : Math.round((d / FEATHER) * 255);
  }

  patches.push({
    input: await sharp(src, { raw: { width: t.width, height: t.height, channels: 4 } })
      .png()
      .toBuffer(),
    left: destLeft,
    top: t.top,
  });
  console.log(
    `  keeping upright: ${t.name}  (tone shift ${shift.map((s) => s.toFixed(1)).join(', ')})`,
  );
}

const info = await sharp(flopped).composite(patches).webp({ quality: 72 }).toFile(OUT);
console.log(`\n${path.relative(ROOT, OUT)}  ${width}x${height}  ${(info.size / 1024).toFixed(0)} KB`);
