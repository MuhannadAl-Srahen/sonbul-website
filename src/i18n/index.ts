import { useState } from 'react';
import i18next from 'i18next';
import { en, ar } from './dictionaries';
import type { Lang } from './types';

export type { Lang } from './types';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

/**
 * Each page/island gets its own fixed-language i18next instance — language
 * is a build-time constant derived from the URL (/ar/... vs /...), not
 * runtime-detected. Deliberately NOT using react-i18next's context/hook
 * machinery here: Astro renders each client-hydrated island as its own
 * independent SSR pass, and nesting an <I18nextProvider> around a child in
 * a .astro file does not reliably propagate React context across that
 * boundary — components silently fell back to react-i18next's shared
 * global-default instance instead, which produced wrong/swapped-language
 * output depending on whatever page had most recently initialized an
 * instance elsewhere in the same build. Every component instead calls
 * useLocale(lang) directly and uses the plain i18next instance's own
 * .t()/.language, with no shared/global state involved at all.
 */
export function createLocaleInstance(lang: Lang) {
  const instance = i18next.createInstance();
  instance.init({
    resources,
    lng: lang,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: { escapeValue: false },
  });
  return instance;
}

/** One instance per component mount, created once and reused across re-renders. */
export function useLocale(lang: Lang) {
  const [instance] = useState(() => createLocaleInstance(lang));
  return instance;
}

export { localizedHref, stripLocale } from './href';
