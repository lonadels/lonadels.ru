import {NextResponse} from 'next/server';
import {headers} from 'next/headers';
import {createProxyKeyForIp} from './service';
import {HttpError} from '@/lib/httpError';
import {extractClientIp} from '@/lib/utils';
import {CreateProxyKeyResponse} from '@/lib/types';

const WINDOW_MS = 60_000;
const LIMIT = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = buckets.get(ip);
  if (!record || record.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(ip, {count: 1, resetAt});
    return {allowed: true, remaining: LIMIT - 1, resetAt};
  }
  if (record.count >= LIMIT) {
    return {allowed: false, remaining: 0, resetAt: record.resetAt};
  }
  record.count += 1;
  buckets.set(ip, record);
  return {allowed: true, remaining: LIMIT - record.count, resetAt: record.resetAt};
}

export async function POST() {
  const headersList = await headers();
  const ip = extractClientIp(headersList);

  if (ip) {
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        {message: 'Too many requests'},
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(LIMIT),
            'X-RateLimit-Remaining': String(rl.remaining),
            'X-RateLimit-Reset': String(Math.floor(rl.resetAt / 1000)),
          },
        },
      );
    }
  }

  try {
    const proxyKey = await createProxyKeyForIp(ip);
    return NextResponse.json({accessUrl: proxyKey.accessUrl} satisfies CreateProxyKeyResponse, {status: 200});
  } catch (e) {
    const status = (e instanceof HttpError) ? e.status : 500;
    const message = (e instanceof HttpError) ? e?.message : 'Internal Server Error';
    return NextResponse.json({message}, {status});
  }
}
