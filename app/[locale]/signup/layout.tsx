import Menu from "@/components/Menu/Navbar";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params;
    const t = await getTranslations({locale: locale})
    return {
      metadataBase: new URL('https://mccreations.net'),
      title: t('Pages.SignUp.Metadata.title'),
      description: t('Pages.SignUp.Metadata.description'),
      twitter: {
        title: t('Pages.SignUp.Metadata.title'),
        description: t('Pages.SignUp.Metadata.description'),
        card: "summary_large_image",
        images: [
          "https://mccreations.net/defaultBanner.png"
        ]
      },
      openGraph: {
        title: t('Pages.SignUp.Metadata.title'),
        description: t('Pages.SignUp.Metadata.description'),
        images: [
          "https://mccreations.net/defaultBanner.png"
        ],
        siteName: "MCCreations",
        type: "website",
        url: "https://mccreations.net/signin"
      },
      keywords: [t('Pages.SignUp.Metadata.Keywords.minecraft'), t('Pages.SignUp.Metadata.Keywords.games'), t('Pages.SignUp.Metadata.Keywords.gaming'), t('Pages.SignUp.Metadata.Keywords.minecraft_map'), t('Pages.SignUp.Metadata.Keywords.minecraft_creations'), t('Pages.SignUp.Metadata.Keywords.minecraft_version', {minecraft_version: "1.21.8"}), t('Pages.SignUp.Metadata.Keywords.maps'), t('Pages.SignUp.Metadata.Keywords.minecraft_games'), t('Pages.SignUp.Metadata.Keywords.download')],
      publisher: "MCCreations"
    }
}

export default async function SignUpLayout(props: { params: Promise<{ locale: string }>, children: React.ReactNode}) {
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