import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {Locales} from '@/app/api/types';
import { getLanguage } from '@/app/api/translation';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!Locales.includes(locale as any)) notFound();
 
  return {
    messages: (await getLanguage(locale))
  };
});