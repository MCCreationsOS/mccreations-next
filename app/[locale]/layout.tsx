import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import Footer from '@/components/Footer/Footer'
import PopupMessageComponent from '@/components/PopupMessage/PopupMessage'
import PopupComponent from '@/components/Popup/Popup'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import {NextIntlClientProvider} from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server'


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
 
export default async function RootLayout({params: { locale }, children}: {params: {locale: string}, children: React.ReactNode}) {
  const messages = await getMessages();
  const l = await getLocale();
 return (

  <html lang={l}>
      <head>
        <meta property="og:image:width" content="2500"></meta>
        <meta property="og:image:height" content="1408"></meta>
        <meta property="og:url" content="https://www.mccreations.net"></meta>
      </head>
      <body id="view">
        <NextIntlClientProvider messages={messages}>
          <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5425604215170333" crossOrigin="anonymous"></Script>
          <PopupMessageComponent />
          <Suspense fallback={<Loading />}>
              {children}
          </Suspense>
          <Footer></Footer>
          <PopupComponent />
          <Analytics />
        </NextIntlClientProvider>
      </body>
      </html>
  )
}
