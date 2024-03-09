'use client'

import { FilePreview, IUser } from "@/app/types";
import { X } from "react-feather";
import Dropzone from "./ImageDropzone/ImageDropzone";
import { useState } from "react";
import { updateProfile } from "@/app/api/auth";

export default function EditProfile({visible, creator, update, close}: {visible: boolean, creator: IUser, update(creator: IUser): void, close(): void}) {
    const [banner, setBanner] = useState(creator.bannerURL)
    const [icon, setIcon] = useState(creator.iconURL)
    const [about, setAbout] = useState(creator.about)
    
    const saveProfile = () => {
        let token = sessionStorage.getItem('jwt')
        updateProfile(token!, banner, icon, undefined, about)
        update({
            ...creator,
            about: about
        });
    }
    
    if(!visible) {
        return (
            <>
            </>
        )
    }
    return (
        <>
        <div className="popup_background"></div>
            <div className="centered_content popup small" style={{top: "5%"}}>
                <div className="titlebar">
                    <h3 className='label title'>Update Profile</h3>
                    <div className="close" onClick={close}><X /></div>
                </div>
                <form>
                    <div className='field'>
                        <h4 className="label">Change Banner</h4>
                        <Dropzone imageSet={setBanner} presetImage={creator.bannerURL}/>
                    </div>
                    <div className="field">
                        <h4 className="label">Change Icon</h4>
                        <Dropzone imageSet={setIcon} presetImage={creator.iconURL}/>
                    </div>
                    <div className="field">
                        <h4 className="label">About</h4>
                        <textarea className="input" onChange={(e) => {setAbout(e.target.value)}} defaultValue={creator.about}></textarea>
                    </div>
                    <button type="button" className="main_button" onClick={saveProfile}>Save</button>
                </form>
            </div>
        </>
    )
}