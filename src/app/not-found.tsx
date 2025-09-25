import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {SearchX} from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function NotFound() {
  const t = useTranslations('errorPages');
  return (
    <div className="font-sans grid place-content-center min-h-svh p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <SearchX className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t('notFound.title')}</h1>
          <p className="text-muted-foreground">{t('notFound.description')}</p>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">{t('home')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
