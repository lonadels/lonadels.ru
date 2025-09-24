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
import {useI18n} from '@/lib/i18n';

export default function HowToUse() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { t } = useI18n();

  const triggerButton = <Button variant="link">{t('howToUse.trigger')}</Button>;
  const title = t('howToUse.title');
  const description = (
    <div className="space-y-3 text-left">
      <ol className="list-decimal list-inside space-y-2 leading-relaxed">
        <li>
          {t('howToUse.steps.one.textBefore')} {' '}
          <a
            href={t('howToUse.steps.one.linkHref')}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-primary"
          >
            {t('howToUse.steps.one.linkText')}
          </a>
          .
        </li>
        <li>
          {t('howToUse.steps.two.beforeBold')}
          {' '}
          <span className="font-medium">{t('howToUse.steps.two.bold')}</span>
          {' '}
          {t('howToUse.steps.two.afterBold')}
        </li>
        <li>
          {t('howToUse.steps.three')}
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
            <Button variant="outline">{t('common.close')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
