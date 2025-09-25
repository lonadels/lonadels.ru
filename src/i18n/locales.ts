import type {Locale as DateFnsLocale} from 'date-fns';
import {ar, de, enUS, es, fr, hi, id, it, ja, ko, pl, pt, ru, tr, uk, uz, vi, zhCN} from 'date-fns/locale';

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

export const DATE_FNS_LOCALES: Record<string, DateFnsLocale> = {
  en: enUS,
  ru,
  fr,
  uk,
  uz,
  de,
  pl,
  zh: zhCN,
  ja,
  ko,
  es,
  ar,
  pt,
  id,
  hi,
  tr,
  vi,
  it,
};

export function getDateFnsLocale(locale?: string): DateFnsLocale {
  if (!locale) return enUS;
  return DATE_FNS_LOCALES[locale] ?? enUS;
}


export function getDateTimeConnector(locale?: string): string | undefined {
  switch (locale) {
    case 'ru':
      return 'в';
    case 'en':
      return 'at';
    case 'fr':
      return 'à';
    case 'uk':
      return 'о';
    case 'uz':
      return 'soat';
    case 'de':
      return 'um';
    case 'pl':
      return 'o';
    case 'zh':
      return '在';
    case 'ja':
      return 'に';
    case 'ko':
      return '에';
    case 'es':
      return 'a las';
    case 'ar':
      return 'في';
    case 'pt':
      return 'às';
    case 'id':
      return 'pukul';
    case 'hi':
      return 'पर';
    case 'tr':
      return 'saat';
    case 'vi':
      return 'lúc';
    case 'it':
      return 'alle';
    default:
      return undefined;
  }
}
