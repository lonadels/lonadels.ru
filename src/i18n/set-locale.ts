'use server';

import {cookies} from 'next/headers';
import type {Locale} from './locales';

/**
 * Sets the UI locale cookie. Can be used from Server Actions or Route Handlers.
 * The value is validated against supported locales by server-side detection logic.
 */
export async function setLocale(locale: Locale) {
  const store = await cookies();
  // 1 year
  store.set('locale', locale, {path: '/', maxAge: 60 * 60 * 24 * 365});
}
