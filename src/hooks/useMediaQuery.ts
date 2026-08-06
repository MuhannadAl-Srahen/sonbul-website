import { useSyncExternalStore } from 'react';

/**
 * Matches a media query without a hydration mismatch.
 *
 * The server has no viewport, so the server snapshot is always false and the real value
 * arrives immediately after hydration. Reading matchMedia during render would make the
 * first client paint disagree with the pre-rendered HTML.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * True only for devices that can genuinely hover — a mouse or trackpad.
 *
 * Touch screens report no hover, and emulating it there gives the "first tap opens, second
 * tap follows the link" behaviour that makes hover menus feel broken on a phone.
 */
export const useCanHover = () => useMediaQuery('(hover: hover) and (pointer: fine)');
