import ProxyKeyFull from '@/components/proxy-key-full';
import { getProxyKeyFromDB } from '@/lib/server/keys';
import type { GetProxyKeyResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { uuid: string };
}

export default async function Page({ params }: PageProps) {
  let initial: GetProxyKeyResponse | null = null;
  let serverError: string | null = null;

  const { uuid } = await params;

  try {
    initial = await getProxyKeyFromDB(uuid);
  } catch (e: any) {
    serverError = e?.message || 'Failed to load key';
  }

  return <div
    className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh p-8 pb-20 gap-16 sm:p-20">
    <main className="flex flex-col gap-2 row-start-2 items-center">
      <ProxyKeyFull uuid={uuid} initial={initial} serverError={serverError} />
    </main>
  </div>;
}
