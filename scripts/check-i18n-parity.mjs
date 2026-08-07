/**
 * Guards the split locale files.
 *
 * Two failure modes this catches, both of which render as wrong text rather than as an
 * error at runtime:
 *   1. en and ar drifting out of key-for-key parity, so one language silently falls back.
 *   2. Two namespace files in the same language declaring the same top-level key,
 *      dictionaries.ts shallow-spreads them, so one would be dropped without a word.
 *
 * Run via `npm run lint`.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, not URL.pathname: the latter is percent-encoded, so a checkout under a
// path containing a space would resolve to "My%20Projects" and die with ENOENT.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = join(ROOT, 'src', 'i18n', 'locales');
const LANGS = ['en', 'ar'];

const errors = [];

/** Every key path in an object, so "same shape" can be compared as a flat set. */
function keyPaths(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

const merged = {};

// Files on disk are not automatically loaded: dictionaries.ts spreads an explicit list of
// imports. A namespace added to locales/ but not to that list would pass every other check
// here while every t() against it rendered the raw key.
const dictSrc = readFileSync(join(ROOT, 'src', 'i18n', 'dictionaries.ts'), 'utf8');
const wired = new Set([...dictSrc.matchAll(/\.\/locales\/(\w+)\/([\w-]+)\.json/g)].map((m) => `${m[1]}/${m[2]}`));

for (const lang of LANGS) {
  const dir = join(LOCALES, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) errors.push(`${lang}/ has no locale files`);

  for (const file of files) {
    const key = `${lang}/${file.replace(/\.json$/, '')}`;
    if (!wired.has(key)) {
      errors.push(`${key}.json is not imported in src/i18n/dictionaries.ts, so its copy never loads`);
    }
  }

  const owner = {};
  const tree = {};

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch (e) {
      errors.push(`${lang}/${file} is not valid JSON: ${e.message}`);
      continue;
    }
    for (const key of Object.keys(parsed)) {
      if (owner[key]) {
        errors.push(
          `top-level key "${key}" is declared in both ${lang}/${owner[key]} and ${lang}/${file}, and the spread in dictionaries.ts would drop one`,
        );
      }
      owner[key] = file;
      tree[key] = parsed[key];
    }
  }

  merged[lang] = tree;
}

if (merged.en && merged.ar) {
  const enKeys = new Set(keyPaths(merged.en));
  const arKeys = new Set(keyPaths(merged.ar));

  for (const k of enKeys) if (!arKeys.has(k)) errors.push(`missing in ar: ${k}`);
  for (const k of arKeys) if (!enKeys.has(k)) errors.push(`missing in en: ${k}`);
}

if (errors.length) {
  console.error(`\n[check-i18n-parity] ${errors.length} problem(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(
  `[check-i18n-parity] ok: ${Object.keys(merged.en).length} namespaces, en/ar key trees match`,
);
