import {redirect} from 'next/navigation'
import {unstable_setRequestLocale} from 'next-intl/server'

export default async function RootNotFound() {
  unstable_setRequestLocale("en-US")
  
  // Redirect to the localized 404 page
  redirect(`/en-US/not_found`)
}