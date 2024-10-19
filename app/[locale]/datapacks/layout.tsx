import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'
import Loading from './loading'

export const metadata: Metadata = {
  metadataBase: new URL('https://mccreations.net'),
  title: "Download Data Packs | MCCreations",
  description: "Download the latest verified Data Packs on MCCreations! Data Packs are the vanilla equivalent of mods for Minecraft. They can add new features, change the way the game is played, and more!",
  twitter: {
    title: "Download Data Packs | MCCreations",
    description: "Download the latest verified Data Packs on MCCreations!",
    card: "summary_large_image",
    images: [
      "https://mccreations.net/defaultBanner.png"
    ]
  },
  openGraph: {
    title: "Download Data Packs | MCCreations",
    description: "Download the latest verified Data Packs on MCCreations!",
    images: [
      "https://mccreations.net/defaultBanner.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://mccreations.net/datapacks"
  }
}
 
export default function DatapacksLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
  return (
     <>
           <Suspense fallback={<Loading />}>
               {children}
           </Suspense>
     </>
   )
 }
