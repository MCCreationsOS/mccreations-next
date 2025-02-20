"use client"

import { createEmptyCreation, createNewContent } from "@/app/api/content"
import { useToken } from "@/app/api/hooks/users"
import { ContentTypes, IContentDoc } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import Select from "@/components/FormInputs/Select"
import Text from "@/components/FormInputs/Text"
import { Popup } from "@/components/Popup/Popup"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useSessionStorage } from "usehooks-ts"

export default function CreateBasicInfo() {
    const {token} = useToken()
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const router = useRouter()
    const t = useTranslations()

    const onMapCreate = (title?: string, type?: ContentTypes, shortDescription?: string) => {
        if(!title) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_title')))
        if(!type) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_type')))
        if(!shortDescription) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_short_description')))

        setCreation({...creation, title: title!, type: type!, shortDescription: shortDescription!, slug: encodeURIComponent(title!.toLowerCase().replace(/ /g, "-"))})
    
        createNewContent(title!, type!, shortDescription!, token).then((key) => {
            if(key && 'key' in key) {
                sessionStorage.setItem('temp_key', key.key)
            }
            setCreation({...creation, ...key.creation})
            console.log(key)
            if('error' in key) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, key.error))
            }
        })
        router.push("/create/details")
    }

    return <>
        <FormComponent id={"createForm"} onSave={(inputs) => {
            onMapCreate(inputs[0], inputs[1] as ContentTypes, inputs[2])
        }} options={{saveButtonContent:t('Create.next')}}>
            <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={creation.title}/>
            <Select name={t('Navigation.CreateForm.type')} defaultValue="map" options={[{name: t('map', { count: 1 }), value: 'map'}, {name: t('datapack', {count: 1}), value: "datapack"}, {name: t('resourcepack', {count: 1}), value: 'resourcepack'}]} value={creation.type}/>
            <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={creation.shortDescription}/>
        </FormComponent>
    </>
}