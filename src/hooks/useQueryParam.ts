import { useSyncExternalStore } from 'react';

// Navigation is always a full page load, so the query string never changes under us.
const subscribe = () => () => {};

/**
 * A query-string parameter, read without a hydration mismatch.
 *
 * Reading `window.location.search` during render would make the client's first paint
 * disagree with the pre-rendered HTML; reading it in an effect works but costs a second
 * render pass. useSyncExternalStore is the sanctioned middle: the server snapshot is
 * null, so SSR and hydration agree, and React swaps in the real value straight after.
 */
export function useQueryParam(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
}
