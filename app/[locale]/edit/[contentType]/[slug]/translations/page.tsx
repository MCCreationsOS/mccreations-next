'use client'

import { convertToCollection, updateTranslation } from "@/app/api/content"
import { useCreation } from "@/app/api/hooks/creations"
import { ContentTypes, Locales, Translation, UserTypes } from "@/app/api/types"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useTranslations } from "next-intl"
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { Popup } from "@/components/Popup/Popup"
import FormComponent from "@/components/Form/Form"
import { mutate } from "swr"
import Select from "@/components/FormInputs/Select"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import WarningButton from "@/components/Buttons/WarningButton"
import Link from "next/link"
import styles from "../edit.module.css"
import { FormInput } from "@/components/FormInputs"
import Text from "@/components/FormInputs/Text"
import RichTextInput from "@/components/FormInputs/RichText"
import Checkbox from "@/components/FormInputs/Checkbox"
import { useUser } from "@/app/api/hooks/users"
import { useRouter } from "next/navigation"

export default function Translations({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    const { creation, isLoading } = useCreation(params.slug, contentType)
    const {user} = useUser(true)
    const t = useTranslations()
    const router = useRouter()

    if((creation && 'error' in creation)) {
        return <div className="centered_content">
            <h1>Something went wrong!</h1>
            <p>{creation?.error}</p>
        </div>
    } else if(isLoading) {
        return <div className="centered_content">
            <h1>Loading...</h1>
        </div>
    }

    if(!user || (!creation?.creators.some(creator => creator.handle === user.handle) || creation.owner !== user._id) && user.type !== UserTypes.Admin) {
        router.push("/signin?redirect=/edit/" + contentType + "/" + params.slug)
        return <div className="centered_content">
            <h1>You are not allowed to edit this content</h1>
        </div>
    }
    return <>
            <SecondaryButton onClick={() => {
                Popup.createPopup({title: t('Content.Edit.add_translation'), content: <FormComponent id="add_translation" onSave={(inputs) => {
                    let newCreation = {
                        ...creation
                    }
                    if(!newCreation.translations) {
                        newCreation.translations = {}
                    }
                    newCreation.translations[inputs[0]] = {
                        title: "",
                        shortDescription: "",
                        description: "",
                        approved: false
                    }
                    mutate(newCreation)
                    Popup.close();
                }}>
                    <Select name={t('Content.Edit.translation_languages')} options={Locales.map(lang => {return {name: lang, value: lang}})} description={<Link href="/translate">{t('Content.Edit.translation_languages_description')}</Link>}/>
                </FormComponent>})
            }}>{t('Content.Edit.add_translation')}</SecondaryButton>
            <div className={styles.translations}>
            {creation.translations && Object.keys(creation.translations).map((lang) => {
                return <div className={styles.translation}><FormComponent id={lang} onSave={(inputs) => {
                    let translation: Translation = {
                    }
                    translation[lang] = {
                        title: inputs[0],
                        shortDescription: inputs[1],
                        description: FormInput.getFormInput(`edit_translation_${lang}`)?.submit() + "",
                        approved: (inputs[3] === "true") ? true : false
                    }
                    updateTranslation(creation.slug, collectionName, translation, localStorage?.getItem('jwt')).then((d) => {
                        if('error' in d) {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, d.error))
                        } else {
                            let newCreation = {
                                ...creation
                            }
                            if(!newCreation.translations) {
                                newCreation.translations = {}
                            }
                            newCreation.translations[lang] = translation[lang]
                            mutate(newCreation)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.translation_saved')))
                        }
                    })
                }} options={{extraButtons: (<WarningButton onClick={() => {
                    let newCreation = {
                        ...creation
                    }
                    delete newCreation.translations![lang]
                    mutate(newCreation)
                }}>{t('Content.Edit.delete_translation')}</WarningButton>)}}>
                    <h2>{lang}</h2>
                    <Text name={t('Content.Edit.title')} value={creation.translations![lang].title}/>
                    <Text name={t('Content.Edit.short_description')} value={creation.translations![lang].shortDescription}/>
                    <RichTextInput id={`edit_translation_${lang}`} name={t('Content.Edit.description')} value={creation.translations![lang].description}/>
                    <Checkbox name={t('Content.Edit.translation_approved')} value={`${creation.translations![lang].approved}`}/>
                </FormComponent></div>
            })}
            </div>
        </>
}