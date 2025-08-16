import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'
import Loading from './loading'
import { getTranslations } from 'next-intl/server'
export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const t = await getTranslations("Pages.Maps.Metadata")
  return {
    metadataBase: new URL('https://mccreations.net'),
    title: t("title"),
    description: t("description"),
    keywords: [t("Keywords.minecraft"), t("Keywords.games"), t("Keywords.gaming"), t("Keywords.minecraft_map"), t("Keywords.minecraft_creations"), t("Keywords.minecraft_version", {minecraft_version: "1.21.8"}), t("Keywords.maps"), t("Keywords.minecraft_games"), t("Keywords.download"), t("Keywords.minecraft_adventure"), t("Keywords.minecraft_parkour"), t("Keywords.minecraft_pvp"), t("Keywords.minecraft_skyblock"), t("Keywords.minecraft_survival"), t("Keywords.minecraft_creative"), t("Keywords.minecraft_minigames")],
    publisher: "MCCreations",
    twitter: {
      title: t("title"),
      description: t("description"),
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/maps"
    }
  }
}
 
export default async function MapsLayout(props: { params: Promise<{ locale: string }>, children: React.ReactNode}) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  return (
     <>
           <Suspense fallback={<Loading />}>
               {children}
           </Suspense>
     </>
   )
}
