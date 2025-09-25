'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {LOCALE_LABELS, SUPPORTED, type Locale} from '@/i18n/locales';
import {useLocale} from 'next-intl';
import {useCallback, useEffect, useMemo, useState} from 'react';

export default function LanguageSelect() {
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      setMounted(false);
      window.location.reload();
    }
  }, []);

  const isKnownLocale = SUPPORTED.includes(locale as Locale);
  if (!mounted || !isKnownLocale || items.length === 0) {
    return <Skeleton className="h-9 w-[180px]" />;
  }

  return (
    <Select key={locale} value={locale as Locale} onValueChange={handleChange}>
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
