export const SUPPORTED = [
  'ru', 'en', 'fr', 'uk', 'uz', 'de', 'pl', 'zh', 'ja', 'ko',
  'es', 'ar', 'pt', 'id', 'hi', 'tr', 'vi', 'it'
] as const;

export type Locale = typeof SUPPORTED[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  fr: 'Français',
  uk: 'Українська',
  uz: "O‘zbek",
  de: 'Deutsch',
  pl: 'Polski',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  ar: 'العربية',
  pt: 'Português',
  id: 'Bahasa Indonesia',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  it: 'Italiano',
};
