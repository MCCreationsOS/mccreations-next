import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://next.mccreations.net'),
  title: "Download Minecraft Maps | MCCreations",
  description: "Download the latest verified Minecraft Maps on MCCreations! Minecraft Maps are custom worlds created by the community. They can be anything from an adventure map to a parkour map to a minigame and more!",
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
