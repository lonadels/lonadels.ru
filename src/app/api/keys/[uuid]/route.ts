import {NextResponse} from 'next/server';
import {ApiErrorResponse, GetProxyKeyResponse} from '@/lib/types';
import { getProxyKeyFromDB } from '@/lib/server/keys';

interface Params {
  params: Promise<{ uuid: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { uuid } = await params;

  try {
    const data = await getProxyKeyFromDB(uuid);
    return NextResponse.json(data satisfies GetProxyKeyResponse, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Invalid proxy key uuid' } satisfies ApiErrorResponse, { status: 400 });
  }
}
