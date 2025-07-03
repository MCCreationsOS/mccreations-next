import {redirect} from 'next/navigation'
import {setRequestLocale} from 'next-intl/server'

export default async function RootNotFound() {
  setRequestLocale("en-US")
  
  // Redirect to the localized 404 page
  redirect(`/en-US/not_found`)
}