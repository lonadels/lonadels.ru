// In-memory, per-IP fixed-window rate limiter with configurable windows.
// NOTE: This is per instance and resets on server restarts/deploys.

export type RateLimitsConfig = Record<number, number>; // { windowMs: limit }

export type RateLimitCheck = {
  allowed: boolean;
  remaining: number; // remaining for the limiting (or smallest) window
  resetAt: number;   // epoch ms when the limiting/smallest window resets
  limit: number;     // limit of the limiting/smallest window
};

type Window = { count: number; resetAt: number };

type Bucket = Map<number, Window>; // key: windowMs

function initWindow(now: number, windowMs: number): Window {
  return { count: 0, resetAt: now + windowMs };
}

function ensureFreshWindow(w: Window | undefined, now: number, windowMs: number): Window {
  if (!w || w.resetAt <= now) return initWindow(now, windowMs);
  return w;
}

export function createRateLimiter(limits: RateLimitsConfig) {
  // Normalize and sort windows ascending (smallest window first)
  const windows = Object.keys(limits)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

  if (windows.length === 0) {
    throw new Error('createRateLimiter: at least one window must be provided');
  }

  const limitsByWindow = new Map<number, number>();
  for (const w of windows) limitsByWindow.set(w, limits[w]!);

  const buckets = new Map<string, Bucket>(); // per IP

  function check(ip: string | null | undefined): RateLimitCheck {
    // If we cannot identify the caller, treat as allowed (or could reject). Here: allow.
    if (!ip) {
      const smallest = windows[0];
      const now = Date.now();
      return { allowed: true, remaining: limitsByWindow.get(smallest)! - 1, resetAt: now + smallest, limit: limitsByWindow.get(smallest)! };
    }

    const now = Date.now();

    let bucket = buckets.get(ip);
    if (!bucket) {
      bucket = new Map<number, Window>();
      for (const w of windows) {
        bucket.set(w, initWindow(now, w));
      }
    } else {
      for (const w of windows) {
        bucket.set(w, ensureFreshWindow(bucket.get(w), now, w));
      }
    }

    // Check without incrementing first to decide allowance atomically
    const exceeded = windows.filter((w) => {
      const win = bucket!.get(w)!;
      const limit = limitsByWindow.get(w)!;
      return win.count >= limit;
    });

    if (exceeded.length > 0) {
      // Report the smallest exceeded window
      const w = exceeded[0];
      const win = bucket.get(w)!;
      const limit = limitsByWindow.get(w)!;
      buckets.set(ip, bucket);
      return { allowed: false, remaining: 0, resetAt: win.resetAt, limit };
    }

    // Allowed -> increment all windows
    for (const w of windows) {
      const win = bucket.get(w)!;
      win.count += 1;
      bucket.set(w, win);
    }
    buckets.set(ip, bucket);

    // Report the remaining for the smallest window by default
    const smallest = windows[0];
    const smallestWin = bucket.get(smallest)!;
    const smallestLimit = limitsByWindow.get(smallest)!;
    const remaining = Math.max(0, smallestLimit - smallestWin.count);
    return { allowed: true, remaining, resetAt: smallestWin.resetAt, limit: smallestLimit };
  }

  return { check };
}
