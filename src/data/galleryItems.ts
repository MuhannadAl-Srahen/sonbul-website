/**
 * The gallery page's view of the photo library.
 *
 * All metadata now lives in media.ts — this file only owns display order. Kept as a
 * separate module because the ordering rule (round-robin across categories) is a gallery
 * concern, not a property of the photos.
 */
import { GALLERY_CATEGORIES, media, type GalleryCategory, type MediaItem } from './media';

export { GALLERY_CATEGORIES };
export type { GalleryCategory };

export type GalleryItem = MediaItem;

/**
 * Round-robin across categories so the unfiltered "All" view opens on a mix of trucks,
 * camps and catering rather than 26 consecutive fleet shots. Filtering preserves this
 * relative order.
 */
function interleave(groups: GalleryItem[][]): GalleryItem[] {
  const out: GalleryItem[] = [];
  const longest = Math.max(...groups.map((g) => g.length));
  for (let i = 0; i < longest; i++) {
    for (const group of groups) {
      if (group[i]) out.push(group[i]);
    }
  }
  return out;
}

export const galleryItems: GalleryItem[] = interleave(
  GALLERY_CATEGORIES.map((category) => {
    const inCategory = media.filter((m) => m.category === category);
    // Videos lead their category so the play badge is visible without paging.
    return [
      ...inCategory.filter((m) => m.kind === 'video'),
      ...inCategory.filter((m) => m.kind === 'photo'),
    ];
  }),
);
