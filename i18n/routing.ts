import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en-US", 'zh-CN', 'ru-RU', 'fr-FR', 'de-DE', 'es-ES', 'ja-JP', 'ko-KR'],
 localePrefix: 'always',
  // Used when no locale matches
  defaultLocale: 'en-US'
});