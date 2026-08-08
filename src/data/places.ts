/**
 * Where the group works, as real coordinates.
 *
 * Kept as longitude and latitude rather than as SVG pixels so a position can be
 * corrected by looking a place up, without anyone having to reverse a projection.
 * PlacesMap projects them at render.
 *
 * `precision` is honest about how confident each position is. The towns and the port are
 * settled places. The border posts are placed on the frontier at roughly the right point
 * along it, which is right at the scale of a whole country but is not survey data, and
 * the client should be asked before anyone treats the map as one.
 */
export type PlaceKind = 'office' | 'project' | 'crossing' | 'port';

export interface Place {
  id: string;
  kind: PlaceKind;
  lon: number;
  lat: number;
  /** Where the label sits relative to the dot, to keep labels from colliding. */
  anchor: 'start' | 'end' | 'middle';
  dx: number;
  dy: number;
  precision: 'known' | 'approximate';
}

export const PLACES: Place[] = [
  // Head office, and the address already published on the contact page.
  { id: 'sahab', kind: 'office', lon: 36.0, lat: 31.87, anchor: 'end', dx: -10, dy: 4, precision: 'known' },

  // Project sites. Azraq carries both programmes: ARGAS surveyed it, ADNOC drilled it.
  { id: 'azraq', kind: 'project', lon: 36.82, lat: 31.83, anchor: 'start', dx: 10, dy: -6, precision: 'known' },
  // Om Lahem, in Ma'an. The same place the site had been calling Al-Jaffr.
  { id: 'omLahem', kind: 'project', lon: 36.2, lat: 30.28, anchor: 'start', dx: 10, dy: 4, precision: 'known' },

  // Border crossings.
  { id: 'jaber', kind: 'crossing', lon: 36.19, lat: 32.66, anchor: 'middle', dx: 0, dy: -12, precision: 'known' },
  { id: 'karamah', kind: 'crossing', lon: 38.97, lat: 32.53, anchor: 'end', dx: -10, dy: -6, precision: 'known' },
  { id: 'omari', kind: 'crossing', lon: 37.6, lat: 30.6, anchor: 'start', dx: 10, dy: 4, precision: 'approximate' },

  // The port, where the sea freight this company hauls inland arrives.
  { id: 'aqaba', kind: 'port', lon: 35.0, lat: 29.53, anchor: 'start', dx: 10, dy: 6, precision: 'known' },
];

/**
 * Jordan's outline, as longitude and latitude, clockwise from the north-west.
 *
 * A deliberate simplification: most of Jordan's frontier is straight treaty lines, so a
 * polygon reads correctly at this size. The west side follows the Jordan valley, the
 * Dead Sea and Wadi Araba down to Aqaba; the north-east is the panhandle that reaches
 * towards the Syria and Iraq tripoints.
 */
export const JORDAN_OUTLINE: [number, number][] = [
  [35.55, 32.72],
  [36.2, 32.68],
  [36.83, 32.32],
  [37.2, 32.36],
  [38.2, 32.9],
  [38.79, 33.38],
  [39.05, 32.85],
  [39.29, 32.15],
  [38.0, 30.9],
  [37.2, 30.15],
  [37.0, 29.9],
  [36.2, 29.55],
  [35.3, 29.35],
  [34.96, 29.36],
  [35.0, 29.55],
  [35.15, 30.1],
  [35.3, 30.7],
  [35.42, 31.1],
  [35.47, 31.48],
  [35.55, 31.78],
  [35.53, 32.1],
  [35.57, 32.4],
];

/** Bounds the projection works in, with a little air around the country. */
export const BOUNDS = { minLon: 34.8, maxLon: 39.5, minLat: 29.1, maxLat: 33.6 };
