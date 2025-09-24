import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidIP(ip: string | null): ip is string {
  if (!ip) return false;

  if(ip === '::1') return true;

  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;

  return ip.split('.').every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}
