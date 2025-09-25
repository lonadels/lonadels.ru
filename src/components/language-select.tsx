'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {LOCALE_LABELS, SUPPORTED, type Locale} from '@/i18n/locales';
import {useLocale} from 'next-intl';
import {useCallback, useMemo} from 'react';

export default function LanguageSelect() {
  const locale = useLocale() as Locale;

  const items = useMemo(() => SUPPORTED.map((code) => ({
    code,
    label: LOCALE_LABELS[code],
  })), []);

  const handleChange = useCallback((value: string) => {
    const v = (value as Locale);
    try {
      const maxAge = 60 * 60 * 24 * 365;
      document.cookie = `locale=${v}; path=/; max-age=${maxAge}`;
    } finally {
      window.location.reload();
    }
  }, []);

  return (

    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {items.map((it) => (
          <SelectItem key={it.code} value={it.code}>
            {it.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
