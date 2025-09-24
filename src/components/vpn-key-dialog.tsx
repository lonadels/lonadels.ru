'use client';

import React, {useRef} from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {toast} from 'sonner';
import type {DialogProps} from '@/lib/types';
import {createOverlay} from '@/lib/overlay';

const dialog = createOverlay<DialogProps>(
  ({open, onOpenChange, accessUrl}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(accessUrl);
        toast.success('Скопировано', { description: 'Ключ для подключения скопирован в буфер обмена' });
      } catch {
        toast.error('Не удалось скопировать');
      }
    };

    const descId = 'vpn-key-help';

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ваш VPN-ключ</AlertDialogTitle>
            <AlertDialogDescription id={descId}>
              <Textarea
                value={accessUrl}
                readOnly
                aria-label="VPN ключ"
                aria-describedby={descId}
                style={{wordBreak: 'break-word'}}
                onClick={() => textareaRef.current?.select()}
                ref={textareaRef}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button type="button" variant="secondary" onClick={handleCopy} aria-label="Скопировать VPN-ключ">
              Скопировать
            </Button>
            <AlertDialogAction aria-label="Закрыть диалог">Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
  {accessUrl: ''},
);


export default dialog;
