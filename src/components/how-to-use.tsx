'use client';
import * as React from 'react';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {useMediaQuery} from 'usehooks-ts';

export default function HowToUse() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const triggerButton = <Button variant="link">Как использовать</Button>;
  const title = 'Инструкция';
  const description = (
    <div className="space-y-3 text-left">
      <ol className="list-decimal list-inside space-y-2 leading-relaxed">
        <li>
          Загрузите и установите{' '}
          <a
            href="https://s3.amazonaws.com/outline-vpn/ru/get-started/index.html#step-3"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-primary"
          >
            клиент Outline
          </a>
          .
        </li>
        <li>
          Нажмите
          {' '}
          <span className="font-medium">Добавить сервер</span>
          {' '}
          в приложении Outline.
        </li>
        <li>
          Введите ключ доступа, полученный после нажатия кнопки «Получить VPN‑ключ» на этом сайте.
        </li>
      </ol>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {triggerButton}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
