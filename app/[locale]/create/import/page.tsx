"use client"

import { createEmptyCreation, importContent } from "@/app/api/content"
import { useToken } from "@/app/api/hooks/users"
import { IContentDoc } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import Select from "@/components/FormInputs/Select"
import Text from '@/components/FormInputs/Text'
import { Popup } from "@/components/Popup/Popup"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useSessionStorage } from "usehooks-ts"

export default function Import() {
    const {token} = useToken()
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const router = useRouter()
    const t = useTranslations();

    const onMapImport = async (link?: string, type?: string) => {
        if(link && type) {
            let token = localStorage?.getItem('jwt')
            let res = await importContent(link, type, token)
            if(res.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, res.error))
            } else if(res.content) {
                if(res.key) {
                    sessionStorage.setItem('temp_key', res.key)
                }
                Popup.close()
                setCreation({...creation, ...res.content})
                router.push(`/create/details`)
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.ImportForm.missing_link')))
        }
    }

    return <>
        <FormComponent id={"importForm"}
        onSave={(inputs) => {
            onMapImport(inputs[1], inputs[0])
        }}  options={{saveButtonContent:t('Create.next')}}>
            <Select name={t('Navigation.ImportForm.type')} defaultValue="Maps" options={[{name: t('map', { count: 1 }), value: 'Maps'}, {name: t('datapack', {count: 1}), value: "datapacks"}, {name: t('resourcepack', {count: 1}), value: 'resourcepacks'}]} />
            <Text type="text" name={t('Navigation.ImportForm.link')} placeholder={t('Navigation.ImportForm.link_placeholder')} description={t('Create.Import.Link.description')} />
        </FormComponent>
    </>
}