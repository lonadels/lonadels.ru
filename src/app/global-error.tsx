'use client';

import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {OctagonAlert} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<'ru' | 'en'>('ru');

  useEffect(() => {
    const fromCookie = getCookie('locale');
    if (fromCookie && ['ru', 'en'].includes(fromCookie)) {
      setLocale(fromCookie as 'ru' | 'en');
    }
  }, []);

  const dict = useMemo(() => ({
    ru: {
      title: 'Критическая ошибка',
      defaultDesc: 'Что-то сломалось. Попробуйте обновить страницу.',
      retry: 'Повторить',
      home: 'На главную'
    },
    en: {
      title: 'Critical error',
      defaultDesc: 'Something broke. Try reloading the page.',
      retry: 'Retry',
      home: 'Home'
    },
  } as const), []);

  const t = dict[locale] || dict.ru;

  return (
    <html>
      <body>
        <div className="font-sans grid place-content-center min-h-svh p-8">
          <div className="max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <OctagonAlert className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">{t.title}</h1>
              {error?.message ? (
                <p className="text-muted-foreground break-words">{error.message}</p>
              ) : (
                <p className="text-muted-foreground">{t.defaultDesc}</p>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <Button onClick={() => reset()} variant="default">{t.retry}</Button>
              <Button asChild variant="outline">
                <Link href="/">{t.home}</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
