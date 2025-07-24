import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en-US", 'ja-JP', 'ko-KR', 'fr-FR', 'hi-IN', 'ru-RU', 'zh-CN', 'zh-TW'],
 localePrefix: 'always',
  // Used when no locale matches
  defaultLocale: 'en-US'
});