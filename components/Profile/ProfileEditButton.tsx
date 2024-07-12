'use client'

import { IUser } from "@/app/api/types"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent from "@/components/Form/Form";
import { Edit } from "react-feather"
import styles from './ProfileStyle.module.css'
import { updateProfile } from "@/app/api/auth";
import ImageInput from "../FormInputs/ImageDropzone";
import Text from "../FormInputs/Text";
import { useI18n } from "@/locales/client";

export default function ProfileEditButton({creator}: {creator: IUser}) {
    let token = sessionStorage.getItem('jwt')
    let storedCreatorStr = sessionStorage.getItem('creator')
    let storedCreator: IUser | undefined;
    const t = useI18n();
    if(storedCreatorStr) {
        try {
            storedCreator = JSON.parse(storedCreatorStr);
        } catch (e) {

        }
    }

    const saveCreator = (inputs: string[]) => {
        updateProfile(token!, inputs[0], inputs[1], undefined, inputs[2])
    }

    if(token && storedCreator?.handle === creator.handle) {
        return (
            <>
            <button className={styles.profile_edit} onClick={() => {
                Popup.createPopup({
                    content: <FormComponent id="updateProfile" onSave={saveCreator}>
                    <ImageInput name={t('creator.update_profile.banner')} value={creator.bannerURL} />
                    <ImageInput name={t('creator.update_profile.logo')} value={creator.iconURL} />
                    <Text name={t('creator.update_profile.about')} value={creator.about} />    
                </FormComponent>, 
                title: t('creator.update_profile')
                })}}>
                    <Edit />
            </button>
            </>
        )
    } else {
        return <></>
    }
}