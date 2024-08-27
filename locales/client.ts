"use client"
import { createI18nClient } from 'next-international/client'
 
export const { useI18n, useScopedI18n, I18nProviderClient, useCurrentLocale, useChangeLocale } = createI18nClient({
  'en-US': () => import('./langs/en_US'),
  'zh-CN': () => import('./langs/zh_CN'),
  'ru-RU': () => import('./langs/ru_RU'),
//   fr: () => import('./fr')
})