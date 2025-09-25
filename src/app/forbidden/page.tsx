import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {ShieldAlert} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {useTranslations} from 'next-intl';
import {Metadata} from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('errorPages');
  return { title: t('forbidden.title') };
}

export default function ForbiddenPage() {
  const t = useTranslations('errorPages');
  return (
    <div className="font-sans grid place-content-center min-h-svh p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t('forbidden.title')}</h1>
          <p className="text-muted-foreground">{t('forbidden.description')}</p>
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
