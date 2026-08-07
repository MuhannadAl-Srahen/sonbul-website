/**
 * Builds the optimized media library in public/assets from the originals in media-src/.
 *
 * media-src/ is gitignored. Only the derivatives this script writes are committed. Re-run it
 * after adding a source image and updating the CATEGORIES map below.
 *
 *   node scripts/build-media.mjs
 *
 * Every gallery photo produces two WebP derivatives:
 *   <cat>-NN-thumb.webp  600x600 cover crop, for the aspect-square grid tile
 *   <cat>-NN.webp        long edge <= 1600, for the lightbox
 */
import { mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// sharp ships only dist/index.mjs, so a bare specifier will not resolve from this script's folder.
const sharp = (await import(pathToFileURL(path.join(ROOT, 'node_modules/sharp/dist/index.mjs')).href)).default;

const SRC = path.join(ROOT, 'media-src');
const PHOTOS = path.join(SRC, 'photos');
const OUT_GALLERY = path.join(ROOT, 'public/assets/gallery');

const THUMB = 600;
const FULL_MAX = 1600;

/**
 * Category -> ordered source filenames. Every image was reviewed by eye; the order here
 * determines the NN suffix and the display order within a category.
 */
const CATEGORIES = {
  transport: [
    'photo3.jpeg', 'photo7.jpeg', 'photo8.jpeg', 'photo10.jpeg', 'photo14.jpeg', 'photo17.jpeg',
    'photo18.jpeg', 'photo21.jpeg', 'photo26.jpeg', 'photo27.jpeg', 'photo29.jpeg', 'photo30.jpeg',
    'photo31.jpeg', 'photo34.jpeg', 'photo35.jpeg', 'photo36.jpeg', 'photo37.jpeg', 'photo38.jpeg',
    'photo39.jpeg', 'photo40.jpeg', 'photo41.jpeg', 'photo43.jpeg', 'photo46.jpeg',
    'equipment-1.jpg', 'equipment-2.jpg', 'project-1.webp',
  ],
  equipment: [
    'photo6.jpeg', 'photo9.jpeg', 'photo13.jpeg', 'photo15.jpeg', 'photo20.jpeg', 'photo22.jpeg',
    'photo23.jpeg', 'photo24.jpeg', 'photo28.jpeg', 'photo44.jpeg', 'photo51.jpeg',
  ],
  camps: [
    'photo1.jpeg', 'photo4.jpeg', 'photo16.jpeg', 'photo25.jpeg', 'photo42.jpeg', 'photo47.jpeg',
    'photo48.jpeg', 'photo49.jpeg', 'photo50.jpeg', 'photo53.jpeg', 'photo54.jpeg', 'photo55.jpeg',
    'photo56.jpeg',
    'slide-0009.jpg', 'slide-0010.jpg', 'slide-0011.jpg', 'slide-0012.jpg', 'slide-0020.jpg',
    'slide-0021.jpg', 'slide-0024.jpg',
  ],
  catering: [
    'photo2.jpeg', 'photo11.jpeg', 'photo19.jpeg',
    'slide-0013.jpg', 'slide-0014.jpg', 'slide-0015.jpg', 'slide-0016.jpg', 'slide-0022.jpg',
    'slide-0025.jpg', 'slide-0026.jpg', 'slide-0027.jpg', 'slide-0028.jpg',
  ],
  projects: [
    'photo5.jpeg', 'photo12.jpeg', 'photo32.jpeg', 'photo52.jpeg', 'photo57.jpeg',
    'slide-0017.jpg', 'slide-0018.jpg', 'slide-0019.jpg', 'slide-0023.jpg',
  ],
};

/** photo23 is a phone screenshot, so trim the status bar off the top before resizing. */
const PRE_CROP = {
  'photo23.jpeg': { top: 60 },
};

async function load(file) {
  let img = sharp(path.join(PHOTOS, file)).rotate(); // honour EXIF orientation, then drop it
  const crop = PRE_CROP[file];
  if (crop) {
    const { width, height } = await img.metadata();
    img = sharp(await img.toBuffer()).extract({
      left: 0, top: crop.top, width, height: height - crop.top,
    });
  }
  return img;
}

let built = 0;
let bytes = 0;

for (const [category, files] of Object.entries(CATEGORIES)) {
  const dir = path.join(OUT_GALLERY, category);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  for (const [i, file] of files.entries()) {
    if (!existsSync(path.join(PHOTOS, file))) throw new Error(`missing source: ${file}`);
    const name = `${category}-${String(i + 1).padStart(2, '0')}`;

    const thumb = await (await load(file))
      .resize(THUMB, THUMB, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 70 })
      .toFile(path.join(dir, `${name}-thumb.webp`));

    const full = await (await load(file))
      .resize(FULL_MAX, FULL_MAX, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(dir, `${name}.webp`));

    built += 2;
    bytes += thumb.size + full.size;
  }
  console.log(`  ${category.padEnd(10)} ${String(files.length).padStart(2)} photos`);
}

// --- one-off assets -------------------------------------------------------

await mkdir(path.join(ROOT, 'public/assets/people'), { recursive: true });
const portrait = await sharp(path.join(SRC, 'founder.png'))
  .rotate()
  .flatten({ background: '#ffffff' })
  .resize(900, 900, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(path.join(ROOT, 'public/assets/people/raed-abu-sonbul.webp'));
console.log(`  portrait   ${(portrait.size / 1024).toFixed(0)} KB`);

const gig = await sharp(path.join(SRC, 'GIG.png'))
  .trim()
  .resize({ height: 80, fit: 'inside', withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(ROOT, 'public/assets/companies/gig.png'));
console.log(`  gig logo   ${(gig.size / 1024).toFixed(1)} KB`);

// --- video posters --------------------------------------------------------
// ffmpeg extracts `<name>-frame.png` into media-src/video (rotation already applied); this turns
// each into a full-size poster plus a square grid thumbnail matching the photo tiles.
const videoDir = path.join(SRC, 'video');
const posterOut = path.join(ROOT, 'public/assets/video');
const frames = existsSync(videoDir) ? (await readdir(videoDir)).filter((f) => f.endsWith('-frame.png')) : [];
if (frames.length) {
  await mkdir(posterOut, { recursive: true });
  for (const frame of frames) {
    const base = frame.replace('-frame.png', '');
    const src = path.join(videoDir, frame);

    const poster = await sharp(src)
      .resize(1280, 1280, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(path.join(posterOut, `${base}-poster.webp`));

    const thumb = await sharp(src)
      .resize(THUMB, THUMB, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 70 })
      .toFile(path.join(posterOut, `${base}-thumb.webp`));

    console.log(
      `  video      ${base} poster ${(poster.size / 1024).toFixed(0)} KB, thumb ${(thumb.size / 1024).toFixed(0)} KB`,
    );
  }
}

console.log(`\n${built} gallery files, ${(bytes / 1024 / 1024).toFixed(2)} MB total`);
