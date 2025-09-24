import {NextResponse} from 'next/server';
import {headers} from 'next/headers';
import {createProxyKeyForIp} from './service';
import {HttpError} from '@/lib/httpError';

export async function POST() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for');

  try {
    const proxyKey = await createProxyKeyForIp(ip);
    return NextResponse.json(proxyKey, {status: 200});
  } catch (e) {
    const status = (e instanceof HttpError) ? e.status : 500;
    const message = (e instanceof HttpError) ? e?.message : 'Internal Server Error';
    return NextResponse.json({message}, {status});
  }
}
