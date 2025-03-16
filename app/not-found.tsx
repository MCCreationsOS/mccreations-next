import {redirect} from 'next/navigation'
import {getLocale} from 'next-intl/server'

export default async function RootNotFound() {
  // Get the current locale
  const locale = await getLocale()
  
  // Redirect to the localized 404 page
  redirect(`/${locale}/not_found`)
}