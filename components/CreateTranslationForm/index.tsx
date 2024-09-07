import { Globe } from "react-feather";
import IconButton from "../Buttons/IconButton";
import { CollectionNames, IContentDoc, Locales } from "@/app/api/types";
import {Popup} from "../Popup/Popup";
import Select from "../FormInputs/Select";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import RichTextInput, { RichTextManager } from "../FormInputs/RichText";
import { useState } from "react";
import { updateTranslation } from "@/app/api/content";
import { useI18n } from "@/locales/client";
import Link from "next/link";
import SecondaryButton from "../Buttons/SecondaryButton";

export default function CreateTranslationForm({content, type}: {content: IContentDoc, type: CollectionNames}) {
    const [title, setTitle] = useState(content.title)
    const [shortDescription, setShortDescription] = useState(content.shortDescription)
    const [description, setDescription] = useState(content.description)
    const t = useI18n();

    const makeTranslation = () => {
        const availableLocales = Locales
        Popup.createPopup({title: "Create a New Translation", canClose: true, content: <FormComponent id="makeTranslation" onSave={(data) => {
            console.log(data)
            let lang = data[0]
            let translation: {[key: string]: {description: string, shortDescription: string, title: string, approved: boolean}} = {
            }
            translation[lang] = {
                title: data[1],
                shortDescription: data[2],
                description: RichTextManager.getRichText('translate_map_desc')?.getValue() + "",
                approved: false
            }
            updateTranslation(content.slug, type, translation, sessionStorage.getItem('jwt'))
            }}>
            <Select name="Language" options={availableLocales.map(lang => {return {name: lang, value: lang}})} onChange={(v: string) => {
                if(content.translations && Object.keys(content.translations).includes(v)) {
                    let translation = content.translations[v]
                    setTitle(translation.title)
                    setShortDescription(translation.shortDescription)
                    setDescription(translation.description)
                } else if (v === 'en-US') {
                    setTitle(content.title)
                    setShortDescription(content.shortDescription)
                    setDescription(content.description)
                }
            }} description={<Link href="/translate">{t('content.edit.translations.missing_language')}</Link>} />
            <Text name={t('content.create.title')} value={title}/>
            <Text name={t('content.create.short_description')} value={shortDescription}/>
            <RichTextInput id="translate_map_desc" name={t('content.edit.general.description')} value={description}/>
        </FormComponent>})
    }

    if(content.extraFeatures?.translations === false) return undefined
    return (
        <SecondaryButton onClick={makeTranslation}>Translate {(content.type) ? content.type.substring(0, 1).toUpperCase() + content.type.substring(1): ""} Page</SecondaryButton>
    )
}