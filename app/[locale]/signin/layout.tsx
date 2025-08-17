import Menu from "@/components/Menu/Navbar";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params;
    const t = await getTranslations({locale: locale})
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
      keywords: [t('Pages.SignIn.Metadata.Keywords.minecraft'), t('Pages.SignIn.Metadata.Keywords.games'), t('Pages.SignIn.Metadata.Keywords.gaming'), t('Pages.SignIn.Metadata.Keywords.minecraft_map'), t('Pages.SignIn.Metadata.Keywords.minecraft_creations'), t('Pages.SignIn.Metadata.Keywords.minecraft_version', {minecraft_version: "1.21.8"}), t('Pages.SignIn.Metadata.Keywords.maps'), t('Pages.SignIn.Metadata.Keywords.minecraft_games'), t('Pages.SignIn.Metadata.Keywords.download')],
      publisher: "MCCreations"
    }
}

export default async function SignInLayout(props: { params: Promise<{ locale: string }>, children: React.ReactNode}) {
  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  return (
      <>
          {children}
      </>
  )
}