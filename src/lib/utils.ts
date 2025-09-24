import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {isIP} from 'net';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidIP(ip: string | null): ip is string {
  return !!ip && isIP(ip) !== 0;
}

export function extractClientIp(h: Headers): string | null {
  const xff = h.get('x-forwarded-for');
  if (xff) {
    for (const part of xff.split(',').map(s => s.trim())) {
      if (isValidIP(part)) return part;
    }
  }
  const xri = h.get('x-real-ip');
  if (xri && isValidIP(xri)) return xri;
  return null;
}
