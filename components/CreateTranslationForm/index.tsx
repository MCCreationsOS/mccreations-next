import { Globe } from "react-feather";
import IconButton from "../Buttons/IconButton";
import { CollectionNames, IContentDoc, Locales } from "@/app/api/types";
import {Popup} from "../Popup/Popup";
import Select from "../FormInputs/Select";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import RichTextInput from "../FormInputs/RichText";
import { useState } from "react";
import { updateTranslation } from "@/app/api/content";
import {useTranslations} from 'next-intl';
import { Link } from "@/app/api/navigation";
import SecondaryButton from "../Buttons/SecondaryButton";
import { FormInput } from "../FormInputs";

export default function CreateTranslationForm({content, type}: {content: IContentDoc, type: CollectionNames}) {
    const [title, setTitle] = useState(content.title)
    const [shortDescription, setShortDescription] = useState(content.shortDescription)
    const [description, setDescription] = useState(content.description)
    const t = useTranslations()

    const makeTranslation = () => {
        const availableLocales = Locales
        Popup.createPopup({title: t('Content.translate', {title: content.title}), canClose: true, content: <FormComponent id="makeTranslation" onSave={(data) => {
            console.log(data)
            let lang = data[0]
            let translation: {[key: string]: {description: string, shortDescription: string, title: string, approved: boolean}} = {
            }
            translation[lang] = {
                title: data[1],
                shortDescription: data[2],
                description: FormInput.getFormInput<string>('translate_map_desc')?.submit() + "",
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
            }} description={<Link href="/translate">{t('Translate.language_missing')}</Link>} />
            <Text name={t('Content.Edit.title')} value={title}/>
            <Text name={t('Content.Edit.short_description')} value={shortDescription}/>
            <RichTextInput id="translate_map_desc" name={t('Content.Edit.description')} value={description}/>
        </FormComponent>})
    }

    if(content.extraFeatures?.translations.use === false) return undefined
    return (
        <SecondaryButton onClick={makeTranslation}>{t('Content.translate_button', {type: (content.type) ? content.type.substring(0, 1).toUpperCase() + content.type.substring(1): ""})}</SecondaryButton>
    )
}