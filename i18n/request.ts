import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

type Messages = {[key: string]: string | Messages}

/**
 * Fills in anything a translation is missing with the English text, so a key that hasn't been
 * translated yet shows English instead of the raw key (or an error).
 */
function withFallback(messages: Messages, fallback: Messages): Messages {
  const result: Messages = {...fallback}
  for (const [key, value] of Object.entries(messages)) {
    const base = fallback[key]
    result[key] = typeof value === 'object' && typeof base === 'object'
      ? withFallback(value, base)
      : value
  }
  return result
}

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../locales/${locale}.json`)).default as Messages
  if (locale === routing.defaultLocale) {
    return {locale, messages}
  }

  const fallback = (await import(`../locales/${routing.defaultLocale}.json`)).default as Messages
  return {
    locale,
    messages: withFallback(messages, fallback)
  };
});
