'use client'

import SecondaryButton from "@/components/Buttons/SecondaryButton";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";
import Menu from "@/components/Menu/Menu";
import { Popup } from "@/components/Popup/Popup";
import { Link } from "@/app/api/navigation";
import { useTranslations } from "next-intl";
import { Locales } from "@/app/api/types";


export default function Page() {
    const t = useTranslations()

    return (
        <>
            <Menu selectedPage="" />
            <div className="centered_content">
                <h1>{t('Translate.title')}</h1>
                <p>{t.rich('Translate.help', { link: (chunks) => <Link href="https://youtu.be/rtxLdKN3WCM">{chunks}</Link>})}</p>
                {Locales.map((lang) => (
                    <SecondaryButton key={lang} onClick={() => {
                        window.location.href = `/translate/${lang}`
                    }}>{lang}</SecondaryButton>
                ))}
                <SecondaryButton onClick={() => {
                    Popup.createPopup({
                        title: t('Translate.AddLanguage.title'),
                        canClose: true,
                        useBackground: true,
                        content: <FormComponent id="add_language" onSave={(inputs) => {
                            window.location.href = `/translate/${inputs[0]}`
                        }}>
                            <Text name={t('Translate.language')} placeholder={t('Translate.AddLanguage.language_placeholder')} description={t.rich('Translate.AddLanguage.language_description', {link: (chunks) => <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">{chunks}</Link>, link2: (chunks) => <Link href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">{chunks}</Link>})}/>
                        </FormComponent>
                    })
                }}>{t('Translate.AddLanguage.title')}</SecondaryButton>
            </div>
        </>
    )
}