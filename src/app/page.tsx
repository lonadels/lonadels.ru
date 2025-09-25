'use client';

import {Button} from '@/components/ui/button';
import {useCallback, useState} from 'react';
import {GlobeLock, LoaderCircle} from 'lucide-react';
import {toast} from 'sonner';
import axios from 'axios';
import {createProxyKey} from '@/lib/api';
import type {ApiErrorResponse} from '@/lib/types';
import HowToUse from '@/components/how-to-use';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';

export default function Home() {
  const t = useTranslations();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const handleButtonClick = useCallback(() => {
    setLoading(true);
    createProxyKey()
      .then((data) => {
        router.push(`/${data.uuid}`);
      })
      .catch((e) => {
        setLoading(false);
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          const body = e.response?.data as ApiErrorResponse | undefined;
          const message = (body && (body.message || body.error)) || t('toasts.errors.default');

          switch (status) {
            case 400:
              toast.warning(t('toasts.errors.badRequest'), {description: message});
              break;
            case 401:
              toast.error(t('toasts.errors.unauthorized'), {description: message});
              break;
            case 403:
              toast.warning(t('toasts.errors.disconnectVpn'));
              break;
            case 429:
              toast.warning(t('toasts.errors.tooMany'), {
                description: t('toasts.errors.tryLater'),
              });
              break;
            default:
              toast.error(t('toasts.errors.server'), {description: message});
          }
        } else {
          toast.error(t('toasts.errors.generic'), {description: t('toasts.errors.failedToGetKey')});
        }
      });
  }, [t, router]);

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-2 row-start-2 items-center">
        <Button variant={'outline'} onClick={handleButtonClick} aria-busy={loading} aria-disabled={loading} disabled={loading}
                size="lg" className={'font-semibold gap-2'}>
          {loading ? <LoaderCircle className="animate-spin w-6 h-6"/> : <GlobeLock className="w-6 h-6"/>}
          {t('home.getKey')}
        </Button>
        <HowToUse/>
      </main>
    </div>
  );
}
