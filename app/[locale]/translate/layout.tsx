import { Metadata } from "next"

export const metadata: Metadata = {
    metadataBase: new URL('https://mccreations.net'),
    title: "Translate | MCCreations",
    description: "Help translate MCCreations into your language and help bring the Minecraft community around the globe together!",
    twitter: {
      title: "Translate | MCCreations",
      description: "Help translate MCCreations into your language and help bring the Minecraft community around the globe together!",
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: "Translate | MCCreations",
      description: "Help translate MCCreations into your language and help bring the Minecraft community around the globe together!",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/translate"
    }
  }

export default function Layout({ children }: {children: React.ReactNode}) {
    return {children}
}