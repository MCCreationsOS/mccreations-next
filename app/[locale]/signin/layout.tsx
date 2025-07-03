import Menu from "@/components/Menu/Navbar";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations()
    return {
      metadataBase: new URL('https://mccreations.net'),
      title: t('Pages.SignIn.Metadata.title'),
      description: t('Pages.SignIn.Metadata.description'),
      twitter: {
        title: t('Pages.SignIn.Metadata.title'),
        description: t('Pages.SignIn.Metadata.description'),
        card: "summary_large_image",
        images: [
          "https://mccreations.net/defaultBanner.png"
        ]
      },
      openGraph: {
        title: t('Pages.SignIn.Metadata.title'),
        description: t('Pages.SignIn.Metadata.description'),
        images: [
          "https://mccreations.net/defaultBanner.png"
        ],
        siteName: "MCCreations",
        type: "website",
        url: "https://mccreations.net/signin"
      },
      keywords: [t('Pages.SignIn.Metadata.Keywords.minecraft'), t('Pages.SignIn.Metadata.Keywords.games'), t('Pages.SignIn.Metadata.Keywords.gaming'), t('Pages.SignIn.Metadata.Keywords.minecraft_map'), t('Pages.SignIn.Metadata.Keywords.minecraft_creations'), t('Pages.SignIn.Metadata.Keywords.minecraft_version'), t('Pages.SignIn.Metadata.Keywords.maps'), t('Pages.SignIn.Metadata.Keywords.minecraft_games'), t('Pages.SignIn.Metadata.Keywords.download')],
      publisher: "MCCreations"
    }
}

export default function SignInLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}