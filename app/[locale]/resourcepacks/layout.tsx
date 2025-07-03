import { Suspense } from 'react'
import Footer from '@/components/Footer/Footer'
import { Metadata } from 'next'
import Loading from './loading'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    metadataBase: new URL('https://mccreations.net'),
    title: t("Pages.Resourcepacks.Metadata.title"),
    description: t("Pages.Resourcepacks.Metadata.description"),
    twitter: {
      title: t("Pages.Resourcepacks.Metadata.title"),
      description: t("Pages.Resourcepacks.Metadata.description"),
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: t("Pages.Resourcepacks.Metadata.title"),
      description: t("Pages.Resourcepacks.Metadata.description"),
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/resourcepacks"
    },
    keywords: [t("Pages.Resourcepacks.Metadata.Keywords.minecraft"), t("Pages.Resourcepacks.Metadata.Keywords.games"), t("Pages.Resourcepacks.Metadata.Keywords.gaming"), t("Pages.Resourcepacks.Metadata.Keywords.minecraft_resourcepack"), t("Pages.Resourcepacks.Metadata.Keywords.minecraft_creations"), t("Pages.Resourcepacks.Metadata.Keywords.minecraft_version"), t("Pages.Resourcepacks.Metadata.Keywords.mods"), t("Pages.Resourcepacks.Metadata.Keywords.minecraft_mods"), t("Pages.Resourcepacks.Metadata.Keywords.minecraft_hd")],
    publisher: "MCCreations"
  }
}
 
export default function ResourcepacksLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
 return (
    <>
          <Suspense fallback={<Loading />}>
              {children}
          </Suspense>
    </>
  )
}
