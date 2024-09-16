'use client'

import { IUser } from "@/app/api/types"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent from "@/components/Form/Form";
import { Edit } from "react-feather"
import styles from './ProfileStyle.module.css'
import { updateProfile } from "@/app/api/auth";
import ImageInput from "../FormInputs/ImageDropzone";
import Text from "../FormInputs/Text";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import {useTranslations} from 'next-intl';

export default function ProfileEditButton({creator}: {creator: IUser}) {
    let token = sessionStorage.getItem('jwt')
    let storedCreatorStr = sessionStorage.getItem('creator')
    let storedCreator: IUser | undefined;
    const t = useTranslations()
    if(storedCreatorStr) {
        try {
            storedCreator = JSON.parse(storedCreatorStr);
        } catch (e) {

        }
    }

    const saveCreator = (inputs: string[]) => {
        console.log(inputs)
        const banner = JSON.parse(inputs[0])[0].url
        const icon = JSON.parse(inputs[1])[0].url
        updateProfile(token!, banner, icon, undefined, inputs[2])
        Popup.close();
        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Creator.Edit.saved')))
    }

    if(token && storedCreator?.handle === creator.handle) {
        return (
            <>
            <button className={styles.profile_edit} onClick={() => {
                Popup.createPopup({
                    content: <FormComponent id="updateProfile" onSave={saveCreator}>
                    <ImageInput name={t('Creator.Edit.banner')} value={JSON.stringify([{url: creator.bannerURL}])} />
                    <ImageInput name={t('Creator.Edit.logo')} value={JSON.stringify([{url: creator.bannerURL}])} />
                    <Text name={t('Creator.Edit.about')} value={creator.about} />    
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