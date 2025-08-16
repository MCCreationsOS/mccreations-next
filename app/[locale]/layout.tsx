import type { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import Footer from '@/components/Footer/Footer'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import {NextIntlClientProvider} from 'next-intl';
import { getLocale, getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import '@/app/globals.css'
import Menu from '@/components/Menu/Navbar'
import ServiceWorkerManager from '@/components/ServiceWorkerManager'
import { Toaster } from '@/components/ui/sonner'
import { routing } from '@/i18n/routing'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    metadataBase: new URL('https://mccreations.net'),
    title: t('Pages.Home.Metadata.title'),
    description: t('Pages.Home.Metadata.description'),
    twitter: {
      title: t('Pages.Home.Metadata.title'),
      description: t('Pages.Home.Metadata.description'),
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: t('Pages.Home.Metadata.title'),
      description: t('Pages.Home.Metadata.description'),
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net"
    },
    keywords: [t('Pages.Home.Metadata.Keywords.minecraft'), t('Pages.Home.Metadata.Keywords.games'), t('Pages.Home.Metadata.Keywords.gaming'), t('Pages.Home.Metadata.Keywords.minecraft_map'), t('Pages.Home.Metadata.Keywords.minecraft_creations'), t('Pages.Home.Metadata.Keywords.minecraft_version', {minecraft_version: '1.21.8'}), t('Pages.Home.Metadata.Keywords.maps'), t('Pages.Home.Metadata.Keywords.minecraft_games'), t('Pages.Home.Metadata.Keywords.download')],
    publisher: "MCCreations"
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale: locale
  }))
}
 
export default async function RootLayout(props: {params: Promise<{locale: string}>, children: React.ReactNode}) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  setRequestLocale(locale)
  return (

   <html lang={locale}>
       <head>
         <meta property="og:image:width" content="2500"></meta>
         <meta property="og:image:height" content="1408"></meta>
         <meta property="og:url" content="https://www.mccreations.net"></meta>
         <link rel="preconnect" href="https://fonts.googleapis.com"></link>
         <link rel="preconnect" href="https://fonts.gstatic.com"></link>
         <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Oxygen:wght@300;400;700&family=Paytone+One&display=swap" rel="stylesheet"></link>
       </head>
       <body id="view">
         <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5425604215170333" crossOrigin="anonymous"></Script>
         <NextIntlClientProvider>
           <Menu />
           <Suspense fallback={<Loading />}>
               {children}
           </Suspense>
           <Footer></Footer>
           <Toaster />
           <Analytics />
           <ServiceWorkerManager />
         </NextIntlClientProvider>
       </body>
       </html>
   )
}
