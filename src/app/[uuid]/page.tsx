import ProxyKeyFull from '@/components/proxy-key-full';
import { getProxyKeyFromDB } from '@/lib/server/keys';
import type { GetProxyKeyResponse } from '@/lib/types';
import { notFound } from 'next/navigation';
import HowToUse from '@/components/how-to-use';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function Page({ params }: PageProps) {
  const { uuid } = await params;

  let initial: GetProxyKeyResponse | null = null;
  try {
    initial = await getProxyKeyFromDB(uuid);
  } catch {
    notFound();
  }

  return <div
    className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh p-8 pb-20 gap-16 sm:p-20">
    <main className="flex flex-col gap-2 row-start-2 items-center">
      <ProxyKeyFull uuid={uuid} initial={initial} />
    </main>
  </div>;
}
