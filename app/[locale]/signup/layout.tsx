import { I18nProviderClient } from "@/locales/client";
import Menu from "@/components/Menu/Menu";
import { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://mccreations.net'),
    title: "Sign Up | MCCreations",
    description: "Sign up to MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
    twitter: {
      title: "Sign Up | MCCreations",
      description: "Sign up to MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: "Sign Up | MCCreations",
      description: "Sign up to MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/signin"
    }
  }

export default function SignUpLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
    return (
        <I18nProviderClient locale={locale}>
        <Menu selectedPage="/" />
            {children}
        </I18nProviderClient>
    )
}