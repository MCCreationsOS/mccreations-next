import { createI18nServer } from 'next-international/server'
 
export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } = createI18nServer({
  'en-US': () => import('./langs/en_US'),
  'zh-CN': () => import('./langs/zh_CN'),
})