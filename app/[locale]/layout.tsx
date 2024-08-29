import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import Footer from '@/components/Footer/Footer'
import PopupMessageComponent from '@/components/PopupMessage/PopupMessage'
import PopupComponent from '@/components/Popup/Popup'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import { Provider } from '@/components/translateProvider'
import { GoogleAdSense } from 'next-google-adsense-betterer'


export const metadata: Metadata = {
  metadataBase: new URL('https://mccreations.net'),
  title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
  description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
  twitter: {
    title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
    description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
    card: "summary_large_image",
    images: [
      "https://mccreations.net/defaultBanner.png"
    ]
  },
  openGraph: {
    title: "MCCreations | The greatest Minecraft Maps from the Minecraft Community",
    description: "MCCreations is an unofficial fan site where you can find the latest and greatest Minecaft maps, datapacks and resourcepacks!",
    images: [
      "https://mccreations.net/defaultBanner.png"
    ],
    siteName: "MCCreations",
    type: "website",
    url: "https://mccreations.net"
  }
}
 
export default function RootLayout({params: { locale }, children}: {params: {locale: string}, children: React.ReactNode}) {
 return (
    
      <Provider locale={locale}>
        <GoogleAdSense publisherId='pub-5425604215170333' />
        <PopupMessageComponent />
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
        <Footer></Footer>
        <PopupComponent />
        <Analytics />
      </Provider>
  )
}
