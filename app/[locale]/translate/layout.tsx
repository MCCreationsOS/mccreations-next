import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
    const t = await getTranslations()
    return {
      metadataBase: new URL('https://mccreations.net'),
      title: t('Pages.Translate.Metadata.title'),
      description: t('Pages.Translate.Metadata.description'),
      twitter: {
        title: t('Pages.Translate.Metadata.title'),
        description: t('Pages.Translate.Metadata.description'),
        card: "summary_large_image",
        images: [
          "https://mccreations.net/defaultBanner.png"
        ]
      },
      openGraph: {
        title: t('Pages.Translate.Metadata.title'),
        description: t('Pages.Translate.Metadata.description'),
        images: [
          "https://mccreations.net/defaultBanner.png"
        ],
        siteName: "MCCreations",
        type: "website",
        url: "/translate"
      },
      keywords: [t('Pages.Translate.Metadata.Keywords.minecraft'), t('Pages.Translate.Metadata.Keywords.games'), t('Pages.Translate.Metadata.Keywords.gaming'), t('Pages.Translate.Metadata.Keywords.minecraft_map'), t('Pages.Translate.Metadata.Keywords.minecraft_creations'), t('Pages.Translate.Metadata.Keywords.minecraft_version'), t('Pages.Translate.Metadata.Keywords.maps'), t('Pages.Translate.Metadata.Keywords.minecraft_games'), t('Pages.Translate.Metadata.Keywords.download')],
      publisher: "MCCreations"
    }
}

export default function Layout({ children }: {children: React.ReactNode}) {
    return children
}