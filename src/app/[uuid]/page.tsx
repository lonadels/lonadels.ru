import React from 'react';
import ProxyKeyFull from '@/components/proxy-key-full';

interface Params {
  params: Promise<{ uuid: string }>;
}

export default async function Page({params}: Params) {
  const {uuid} = await params;

  return <div
    className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-svh p-8 pb-20 gap-16 sm:p-20">
    <main className="flex flex-col gap-2 row-start-2 items-center">
      <ProxyKeyFull uuid={uuid}/>
    </main>
  </div>;
}
