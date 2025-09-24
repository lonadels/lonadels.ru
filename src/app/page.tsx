'use client';

import {Button} from '@/components/ui/button';
import {useCallback, useRef, useState} from 'react';
import {If, Then} from 'react-if';
import {Loader2Icon} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {toast} from 'sonner';
import {Textarea} from '@/components/ui/textarea';
import {ProxyKey} from '@prisma/client';

export default function Home() {

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = useCallback(() => {
    setLoading(true);
    fetch('/api/createProxyKey', {
      method: 'POST',
    })
      .then(async res => {
        const data: ProxyKey = await res.json();
        setKey(data.accessUrl);
        setOpen(true);
      })
      .catch(() => {
        toast.error('Ошибка', {
          description: 'Не удалось получить VPN-ключ',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTextareaClick = useCallback(() => {
    textareaRef.current?.select();
  }, []);

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button onClick={handleButtonClick} aria-busy={loading} disabled={loading}>
          <If condition={loading}>
            <Then>
              <Loader2Icon className="animate-spin"/>
            </Then>
          </If>
          Получить VPN-ключ
        </Button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ваш VPN-ключ</AlertDialogTitle>
              <AlertDialogDescription>
                <Textarea value={key ?? ''} readOnly style={{wordBreak: 'break-word'}} onClick={handleTextareaClick}
                          ref={textareaRef}/>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Закрыть</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
