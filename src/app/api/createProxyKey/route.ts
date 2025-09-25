import {NextResponse} from 'next/server';
import {headers} from 'next/headers';
import {createProxyKeyForIp} from './service';
import {HttpError} from '@/lib/httpError';
import {extractClientIp} from '@/lib/utils';
import {CreateProxyKeyResponse} from '@/lib/types';

import {createRateLimiter} from '@/lib/rateLimit';

// Default rate limits per IP for this endpoint. You can reuse the limiter elsewhere with other configs.
const limiter = createRateLimiter({
  60_000: 5,            // per minute
  21_600_000: 20,       // per 6 hours
  86_400_000: 50,       // per 24 hours
});

export async function POST() {
  const headersList = await headers();
  const ip = extractClientIp(headersList);

  if (ip) {
    const rl = limiter.check(ip);
    if (!rl.allowed) {
      const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        {message: 'Too many requests'},
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(rl.limit),
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
