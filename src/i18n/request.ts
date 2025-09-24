import {cookies, headers} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

export type Locale = 'ru' | 'en';

export default getRequestConfig(async () => {
  const h = await headers();
  const accept = h.get('accept-language')?.toLowerCase() || '';
  const initialLocale: Locale = accept.startsWith('en') ? 'en' : 'ru';

  const store = await cookies();
  const locale = store.get('locale')?.value || initialLocale;

  const messages = await import(`../../messages/${locale}.json`).then(m => m.default);

  return {
    locale,
    messages
  };
});
