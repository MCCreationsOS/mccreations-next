import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://next.mccreations.net'),
  title: "Download Minecraft Maps | MCCreations",
  description: "Download the latest verified Minecraft Maps on MCCreations!",
  twitter: {
    title: "Download Minecraft Maps | MCCreations",
    description: "Download the latest verified Minecraft Maps on MCCreations!",
    card: "summary_large_image",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ]
  },
  openGraph: {
    title: "Download Minecraft Maps | MCCreations",
    description: "Download the latest verified Minecraft Maps on MCCreations!",
    images: [
      "https://next.mccreations.net/defaultBanner.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://next.mccreations.net/maps"
  }
}
 
export default function MapsLayout({ children }: {children: React.ReactNode}) {
 return (
        <Suspense>
            {children}
        </Suspense>
  )
}
