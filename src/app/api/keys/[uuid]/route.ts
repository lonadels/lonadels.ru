import {NextResponse} from 'next/server';
import {findProxyKeyByUuid} from '@/app/api/keys/repository';
import {ApiErrorResponse, GetProxyKeyResponse} from '@/lib/types';

interface Params {
  params: Promise<{ uuid: string }>;
}

export async function GET(request: Request,
                          {params}: Params) {

  const {uuid} = await params;
  const proxyKey = await findProxyKeyByUuid(uuid);

  if(!proxyKey)
    return NextResponse.json({ message: 'Invalid proxy key uuid' } satisfies ApiErrorResponse, {status: 400})

  return NextResponse.json({accessUrl: proxyKey.accessUrl, createdAt: proxyKey.createdAt} satisfies GetProxyKeyResponse, {status: 200});
}
