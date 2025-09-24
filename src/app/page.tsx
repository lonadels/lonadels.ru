'use client';

import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { Else, If, Then } from 'react-if';
import { GlobeLock, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { createProxyKey } from '@/lib/api';
import type { ApiErrorResponse } from '@/lib/types';
import VpnKeyDialog from '@/components/vpn-key-dialog';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleButtonClick = useCallback(() => {
    setLoading(true);
    createProxyKey()
      .then((data) => {
        VpnKeyDialog.update({ accessUrl: data.accessUrl });
        VpnKeyDialog.open();
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          const status = e.response?.status;
          const body = e.response?.data as ApiErrorResponse | undefined;
          const message = (body && (body.message || body.error)) || 'Произошла ошибка';

          switch (status) {
            case 400:
              if (message === 'Please, disable VPN first') {
                toast.warning('Пожалуйста, отключитесь от VPN');
              } else {
                toast.warning('Некорректный запрос', { description: message });
              }
              break;
            case 401:
              toast.error('Не авторизовано', { description: message });
              break;
            default:
              toast.error('Ошибка сервера', { description: message });
          }
        } else {
          toast.error('Ошибка', { description: 'Не удалось получить VPN-ключ' });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh p-8 pb-20 gap-16 sm:p-20">
      <VpnKeyDialog.Viewport />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button variant={'outline'} onClick={handleButtonClick} aria-busy={loading} disabled={loading}>
          <If condition={loading}>
            <Then>
              <Loader2Icon className="animate-spin" />
            </Then>
            <Else>
              <GlobeLock />
            </Else>
          </If>
          Получить VPN-ключ
        </Button>

      </main>
    </div>
  );
}
