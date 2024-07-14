import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'
import { I18nProviderClient } from '@/locales/client'

export const metadata: Metadata = {
  metadataBase: new URL('https://next.mccreations.net'),
  title: "Download Data Packs | MCCreations",
  description: "Download the latest verified Data Packs on MCCreations! Data Packs are the vanilla equivalent of mods for Minecraft. They can add new features, change the way the game is played, and more!",
  twitter: {
    title: "Download Data Packs | MCCreations",
    description: "Download the latest verified Data Packs on MCCreations!",
    card: "summary_large_image",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ]
  },
  openGraph: {
    title: "Download Data Packs | MCCreations",
    description: "Download the latest verified Data Packs on MCCreations!",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://next.mccreations.net/datapacks"
  }
}
 
export default function DatapacksLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
  return (
     <I18nProviderClient locale={locale}>
           <Suspense>
               {children}
           </Suspense>
     </I18nProviderClient>
   )
 }
