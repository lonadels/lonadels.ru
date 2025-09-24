'use client';

import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {ru} from './locales/ru';
import {en} from './locales/en';

export type Locale = 'ru' | 'en';

type Dict = typeof ru & typeof en; // structure should match

const dictionaries: Record<Locale, Dict> = {
  ru: ru as Dict,
  en: en as Dict,
};

function getPreferredLocaleFromNavigator(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const lang = navigator.language?.toLowerCase() || '';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('en')) return 'en';
  return null;
}

export type I18nContextValue = {
  locale: Locale;
  t: (path: string, params?: Record<string, string | number>) => string;
  setLocale: (loc: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
}

function format(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

export function I18nProvider({children, initialLocale = 'ru'}: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Client-side adjust if browser prefers a different supported locale
  useEffect(() => {
    const preferred = getPreferredLocaleFromNavigator();
    if (preferred && preferred !== locale) {
      setLocale(preferred);
      // also update document lang attr
      if (typeof document !== 'undefined') {
        document.documentElement.lang = preferred;
      }
    }
    // we run only once on mount to avoid flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dict = useMemo(() => dictionaries[locale], [locale]);

  const t = useMemo(() => {
    return (path: string, params?: Record<string, string | number>) => {
      const value = getByPath(dict, path);
      if (typeof value === 'string') return format(value, params);
      return String(value ?? path);
    };
  }, [dict]);

  const value: I18nContextValue = useMemo(() => ({locale, t, setLocale}), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
