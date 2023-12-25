'use client'

import { getCreator } from "@/app/api/community"
import Menu from "@/components/Menu"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import Image from "next/image"
import styles from './CreatorPage.module.css'
import ContentGrid from "@/components/ContentGrid"
import { fetchMaps } from "@/app/api/content"
import Link from "next/link"
import { getUser, updateProfile } from "@/app/api/auth"
import { useEffect, useState } from "react"
import { IUser, UserTypes } from "@/app/types"
import { Edit } from "react-feather"
import EditProfile from "@/components/EditProfile"
import defaultLogo from 'public/defaultLogo.png'
import defaultBanner from 'public/defaultBanner.png'
import PopupFormComponent, { PopupForm } from "@/components/PopupForm/PopupForm"

export default async function ProfilePage({params}: {params: Params}) {
    const [creator, setCreator] = useState<IUser>({type: 0, username: "", email: ""})
    const [content, setContent] = useState([])
    const [canEdit, setCanEdit] = useState(false)
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        let token = sessionStorage.getItem('jwt')
        const getData = async () => {
            let c = await getCreator(params.creator)
            setCreator(c)
            let m = await fetchMaps({search:c.username, limit: 20}, false)
            setContent(m.documents)
            if(token)
                if((await getUser(undefined, token))?.handle === c.handle)
                    setCanEdit(true)
        }
        getData();
    }, [])

    const closeEditProfile = () => {
        setEditing(false)
    }

    const saveCreator = () => {
        let token = sessionStorage.getItem('jwt')
        updateProfile(token!, PopupForm.inputs[0].value, PopupForm.inputs[1].value, undefined, PopupForm.inputs[2].value)
        setCreator({
            ...creator,
            bannerURL: PopupForm.inputs[0].value,
            iconURL: PopupForm.inputs[1].value,
            about: PopupForm.inputs[2].value
        });
    }


    
    return (
        <>
        <Menu selectedPage="" />
        <div className={styles.profile_page}>
            <div className={styles.profile_card}>
                {(canEdit) ? <button className={styles.profile_edit} onClick={() => {PopupForm.openForm("Edit Profile", [{name: "Change Banner", type: "image", defaultValue: creator.bannerURL}, {name: "Change Icon", type: "image", defaultValue: creator.iconURL}, {name: "About", type: "text", defaultValue: creator.about}], saveCreator)}}><Edit /></button>: <></>}
                <Image className={styles.banner} width={1920} height={540} src={(creator.bannerURL) ? creator.bannerURL : defaultBanner} alt={`${creator.username}'s banner image`}></Image>
                <svg className={styles.icon_container} width={400} height={140} viewBox="0 0 400 140">
                    <circle fill="#272727" r="50" cx="50" cy="50"></circle>
                    <foreignObject width={400} height={90} x="5" y="5">
                        <div className={styles.icon_content}>
                            <Image style={{borderRadius: "50%"}} width={90} height={90} src={(creator.iconURL) ? creator.iconURL : defaultLogo} alt="" />
                            <div className={styles.creator_info}>
                                <h2>{creator.username}</h2>
                                <p>@{creator.handle}</p>
                            </div>
                        </div>
                    </foreignObject>
                </svg>
                <div className={styles.profile_content}>
                    <div className={styles.profile_section}>
                        {creator.about}
                    </div>
                    {((creator.socialLinks && Object.keys(creator.socialLinks).length > 0))? 
                    <div className={styles.profile_section}>
                        {creator.socialLinks.map((link: any) => {
                            return <Link href="link.link">{link.name}</Link>
                        })}
                    </div> : 
                    <></>}
                </div>
            </div>
            {(content) ? <ContentGrid content={content} cards="three"/>: <></>}
        </div>
        <PopupFormComponent></PopupFormComponent>
        {/* <EditProfile visible={editing} creator={creator} update={saveCreator} close={closeEditProfile}/> */}
        {/* <Image className={styles.banner_background} width={1920} height={1080} src={creator.bannerURL || ""} alt=""></Image>
                <div className={styles.banner_foreground}>
                    <div className={styles.banner_container}>
                        <Image className={styles.banner} width={1920} height={540} src={creator.bannerURL || ""} alt={`${creator.username}'s banner image`}></Image>
                        <svg className={styles.icon_container} width={400} height={140} viewBox="0 0 400 140">
                            <circle fill="#171717" r="70" cx="70" cy="70"></circle>
                            <foreignObject width={400} height={120} x="10" y="10">
                                <div className={styles.icon_content}>
                                    <Image style={{borderRadius: "50%"}} width={120} height={120} src={creator.iconURL || ""} alt="" />
                                    <div className={styles.creator_info}>
                                        <h2>{creator.username}</h2>
                                        <p>@{creator.handle}</p>
                                    </div>
                                </div>
                            </foreignObject>
                        </svg>
                    </div>
                </div>
            <div>
                {((creator.about && creator.about.length > 0) || (creator.socialLinks && Object.keys(creator.socialLinks).length > 0)) ? <div className={styles.info_section}>
                    <div className={styles.about_section}>
                        <h2 className={styles.about_header}>About</h2>
                        {creator.about}
                    </div>
                    {((creator.socialLinks && Object.keys(creator.socialLinks).length > 0))? <div className={styles.link_section}>
                        <h2 className={styles.about_header}>Links</h2>
                        {creator.socialLinks.map((link: any) => {
                            return <Link href="link.link">{link.name}</Link>
                        })}
                    </div> : <></>}
                    
                </div>: <></>}
                <h2 className={styles.section_header}>Content</h2>
                {(content) ? <ContentGrid content={content}/>: <></>}
            </div> */}
        </>
    )
}