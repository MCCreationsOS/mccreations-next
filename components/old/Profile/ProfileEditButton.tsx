'use client'

import { IUser } from "@/app/api/types"
import { Popup } from "@/components/Popup/Popup";
import FormComponent from "@/components/Form/Form";
import { Edit } from "lucide-react"
import styles from './ProfileStyle.module.css'
import { updateProfile } from "@/app/api/auth";
import ImageInput from "../FormInputs/ImageDropzone";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import {useTranslations} from 'next-intl';
import { useToken, useUser } from "@/app/api/hooks/users";

export default function ProfileEditButton({creator}: {creator: IUser}) {
    const { token, setToken } = useToken()
    const {user, setUser} = useUser()
    const t = useTranslations()

    const saveCreator = (inputs: string[]) => {
        const banner = JSON.parse(inputs[0])[0].url
        const icon = JSON.parse(inputs[1])[0].url
        updateProfile(token!, banner, icon, undefined, inputs[2])
        setUser({
            ...user!,
            bannerURL: banner,
            iconURL: icon,
            about: ""
        })
        Popup.close();
        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Creator.Edit.saved')))
    }

    if(token && user?.handle === creator.handle) {
        return (
            <>
            <button className={styles.profile_edit} onClick={() => {
                Popup.createPopup({
                    content: <FormComponent id="updateProfile" onSave={saveCreator}>
                    <ImageInput name={t('Creator.Edit.banner')} value={JSON.stringify([{url: creator.bannerURL}])} />
                    <ImageInput name={t('Creator.Edit.logo')} value={JSON.stringify([{url: creator.bannerURL}])} />
                </FormComponent>, 
                title: t('Creator.Edit.title')
                })}}>
                    <Edit />
            </button>
            </>
        )
    } else {
        return <></>
    }
}