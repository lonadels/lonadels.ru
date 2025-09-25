'use client';

import React, {useRef} from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
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
import {useTranslations} from 'next-intl';

const dialog = createOverlay<DialogProps>(
  ({open, onOpenChange, accessUrl}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const t = useTranslations();

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(accessUrl);
        toast.success(t('toasts.copied.title'), { description: t('toasts.copied.description') });
      } catch {
        toast.error(t('toasts.copyFailed'));
      }
    };

    const descId = 'vpn-key-help';

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription id={descId}>
              <Textarea
                value={accessUrl}
                readOnly
                aria-label={t('dialog.textareaAria')}
                aria-describedby={descId}
                style={{wordBreak: 'break-word'}}
                onClick={() => textareaRef.current?.select()}
                ref={textareaRef}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={'flex flex-col'}>
            <AlertDialogCancel aria-label={t('dialog.closeAria')}>{t('common.close')}</AlertDialogCancel>
            <Button type="button" variant="default" onClick={handleCopy} aria-label={t('dialog.copyAria')}>
              {t('common.copy')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
  {accessUrl: ''},
);


export default dialog;
