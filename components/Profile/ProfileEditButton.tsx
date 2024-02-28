'use client'

import { IUser } from "@/app/types"
import PopupComponent, { Popup } from "@/components/Popup/Popup";
import FormComponent, { IFormInput } from "@/components/Form/Form";
import { Edit } from "react-feather"
import styles from './ProfileStyle.module.css'
import { updateProfile } from "@/app/api/auth";

export default function ProfileEditButton({creator}: {creator: IUser}) {
    let token = sessionStorage.getItem('jwt')
    let storedCreatorStr = sessionStorage.getItem('creator')
    let storedCreator: IUser | undefined;
    if(storedCreatorStr) {
        try {
            storedCreator = JSON.parse(storedCreatorStr);
        } catch (e) {

        }
    }

    const saveCreator = (inputs: IFormInput[]) => {
        updateProfile(token!, inputs[0].value, inputs[1].value, undefined, inputs[2].value)
    }

    if(token && storedCreator?.handle === creator.handle) {
        return (
            <>
            <button className={styles.profile_edit} onClick={() => {
                Popup.createPopup(
                <FormComponent inputs={[
                    {name: "Change Banner", type: "image", value: creator.bannerURL}, 
                    {name: "Change Icon", type: "image", value: creator.iconURL}, 
                    {name: "About", type: "text", value: creator.about}
                ]} onSave={saveCreator} />, "Update Profile")}}>
                    <Edit />
            </button>
            </>
        )
    } else {
        return <></>
    }
}