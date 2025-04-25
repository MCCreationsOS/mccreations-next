import Menu from "@/components/Menu/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL('https://mccreations.net'),
    title: "Sign In | MCCreations",
    description: "Sign in to your account on MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
    twitter: {
      title: "Sign In | MCCreations",
      description: "Sign in to your account on MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
      card: "summary_large_image",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ]
    },
    openGraph: {
      title: "Sign In | MCCreations",
      description: "Sign in to your account on MCCreations to upload your Minecraft Maps, Data Packs, Resource Packs, and more!",
      images: [
        "https://mccreations.net/defaultBanner.png"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/signin"
    }
  }

export default function SignInLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}