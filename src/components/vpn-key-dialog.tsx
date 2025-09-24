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
import type {DialogProps} from '@/lib/types';
import {createOverlay} from '@/lib/overlay';

const dialog = createOverlay<DialogProps>(
  ({open, onOpenChange, accessUrl}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ваш VPN-ключ</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                value={accessUrl}
                readOnly
                style={{wordBreak: 'break-word'}}
                onClick={() => textareaRef.current?.select()}
                ref={textareaRef}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Закрыть</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
  {accessUrl: ''},
);


export default dialog;
