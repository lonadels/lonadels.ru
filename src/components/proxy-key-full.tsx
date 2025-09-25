'use client';

import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {createProxyKey, getProxyKey} from '@/lib/api';
import {useCallback, useEffect, useRef, useState} from 'react';
import {type ApiErrorResponse, GetProxyKeyResponse} from '@/lib/types';
import {useLocale, useTranslations} from 'next-intl';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {format} from 'date-fns';
import {getDateFnsLocale, getDateTimeConnector} from '@/i18n/locales';
import {AlertCircleIcon, Copy, GlobeLock, LoaderCircle} from 'lucide-react';
import {Alert, AlertDescription, AlertTitle} from './ui/alert';
import axios from 'axios';

interface ProxyKeyFullProps {
  uuid: string;
  initial?: GetProxyKeyResponse | null;
  serverError?: string | null;
}

export default function ProxyKeyFull({uuid, initial = null, serverError = null}: ProxyKeyFullProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = useTranslations();
  const currentLocale = useLocale();
  const dfLocale = getDateFnsLocale(currentLocale);
  const connector = getDateTimeConnector(currentLocale);

  const [proxyKey, setProxyKey] = useState<GetProxyKeyResponse | null>(initial);
  const [error, setError] = useState<string | null>(serverError || null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
      if (initial || serverError) return;

      getProxyKey(uuid)
        .then(data => {
          setProxyKey(data);
        })
        .catch(error => {
          console.error(error);
          setError(error.message);
        });
    },
    [uuid, initial, serverError],
  );

  const handleGetNew = useCallback(() => {
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
  }, [router, t]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(proxyKey?.accessUrl || '');
      toast.success(t('toasts.copied.title'), {description: t('toasts.copied.description')});
    } catch {
      console.error('Failed to copy text: ', proxyKey?.accessUrl);
      toast.error(t('toasts.copyFailed'));
    }
  }, [proxyKey?.accessUrl, t]);

  if(error) return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{t('alerts.errors.title')}</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
      </AlertDescription>
    </Alert>
  )

  if (!proxyKey) {
    return (
      <div className="flex items-center justify-center py-10" aria-busy="true" aria-live="polite">
        <LoaderCircle className="animate-spin w-6 h-6 text-foreground"/>
        <span className="sr-only">{t('common.loading')}...</span>
      </div>
    );
  }

  return <div className={'flex flex-col justify-center gap-2'}>
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-center sm:text-start">
      <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('fullKeyPage.title')}
      </h2>
      <span className="text-sm sm:text-xl font-semibold text-muted-foreground whitespace-nowrap">
        {connector
          ? `${format(new Date(proxyKey.createdAt), 'P', {locale: dfLocale})} ${connector} ${format(new Date(proxyKey.createdAt), 'p', {locale: dfLocale})}`
          : format(new Date(proxyKey.createdAt), 'Pp', {locale: dfLocale})}
      </span>
    </div>
    <Textarea
      value={proxyKey.accessUrl}
      placeholder={t('fullKeyPage.textareaAria')}
      className={'resize-none w-full'}
      readOnly
      aria-label={t('fullKeyPage.textareaAria')}
      aria-describedby={'vpn-key-help'}
      style={{wordBreak: 'break-word'}}
      onClick={() => textareaRef.current?.select()}
      ref={textareaRef}
    />
    <div className={'flex flex-col sm:flex-row gap-2 sm:justify-end'}>
      <Button disabled={loading} aria-busy={loading} aria-disabled={loading} onClick={handleGetNew} variant={'outline'} aria-label={t('common.backAria')}>
        {loading ? <LoaderCircle className="animate-spin w-6 h-6"/> : <GlobeLock className="w-6 h-6"/>}
        {t('home.getNewKey')}
      </Button>
      <Button onClick={handleCopy} aria-label={t('fullKeyPage.copyAria')}>
        <Copy className="w-6 h-6"/>
        {t('common.copy')}
      </Button>
    </div>
  </div>;
}
