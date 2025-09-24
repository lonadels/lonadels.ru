import {cookies, headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

// Single source of truth for supported locales
export const SUPPORTED = [
  'ru', 'en', 'fr', 'uk', 'uz', 'de', 'pl', 'zh', 'ja', 'ko',
  'es', 'ar', 'pt', 'id', 'hi', 'tr', 'vi', 'it'
] as const;

export type Locale = typeof SUPPORTED[number];

function detectFromAcceptLanguage(accept: string): Locale {
  if (!accept) return 'ru';
  // Parse primary language subtags in order of preference
  const parts = accept
    .split(',')
    .map(s => s.trim().split(';')[0]) // strip quality
    .map(tag => tag.toLowerCase());

  for (const tag of parts) {
    const primary = tag.split('-')[0];
    // Direct match first
    if ((SUPPORTED as readonly string[]).includes(primary)) return primary as Locale;
    // Map common aliases if needed (none currently)
  }
  return 'ru';
}

function coerceLocale(value: string | undefined, fallback: Locale): Locale {
  if (!value) return fallback;
  const v = value.toLowerCase();
  return ((SUPPORTED as readonly string[]).includes(v) ? (v as Locale) : fallback);
}

export default getRequestConfig(async () => {
  const h = await headers();
  const accept = h.get('accept-language')?.toLowerCase() || '';
  const initialLocale = detectFromAcceptLanguage(accept);

  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;
  const locale = coerceLocale(cookieLocale, initialLocale);

  const messages = await import(`../../messages/${locale}.json`).then(m => m.default);

  return {
    locale,
    messages
  };
});
