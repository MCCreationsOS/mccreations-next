'use client'

import SecondaryButton from "@/components/Buttons/SecondaryButton";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";
import Menu from "@/components/Menu/Menu";
import { Popup } from "@/components/Popup/Popup";
import { Metadata } from "next";
import Link from "next/link";

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

export default function Page() {
    const languages = [
        "en_US",
        "zh_CN",
        'ru_RU'
    ]

    return (
        <>
            <Menu selectedPage="" />
            <div className="centered_content">
                <h1>Languages</h1>
                <p><Link href="https://youtu.be/rtxLdKN3WCM">For help, click here</Link></p>
                {languages.map((lang) => (
                    <SecondaryButton key={lang} onClick={() => {
                        window.location.href = `/translate/${lang}`
                    }}>{lang}</SecondaryButton>
                ))}
                <SecondaryButton onClick={() => {
                    Popup.createPopup({
                        title: "Add A Language",
                        canClose: true,
                        useBackground: true,
                        content: <FormComponent id="add_language" onSave={(inputs) => {
                            window.location.href = `/translate/${inputs[0]}`
                        }}>
                            <Text name="Language" description={<>An <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">ISO 639 language code</Link> follow by an <Link href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">ISO 3166-1 Region Code</Link>. If you can't find your language, make something up :p</>}/>
                        </FormComponent>
                    })
                }}>Add Language</SecondaryButton>
            </div>
        </>
    )
}