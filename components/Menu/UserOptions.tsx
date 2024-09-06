'use client'

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { IUser, UserTypes } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { LogOut, Settings, Table, User } from "react-feather"
import { useRouter } from "next/navigation"
import { getUser } from "@/app/api/auth"
import HollowButton from "../Buttons/HollowButton"
import { useTranslations } from "next-intl";

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const [user, setUser] = useState({} as IUser)
    const [showOptions, setShowOptions] = useState(false)
    const router = useRouter();
    let t = useTranslations();

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                let user = await getUser(undefined, token)
                if(user) {
                    setUser(user);
                }
            }
        }
        getData();
    }, [])

    if(!user._id) {
        return (
            <div className="user_menu">
                <Link href="/signin"><HollowButton>{t('nav.item.user_options.sign_in')}</HollowButton></Link>
            </div>
        )
    }

    return (
        <div className="user_menu" onClick={() => {setShowOptions(!showOptions)}}>
            <Image className="icon" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt="User Icon" width={40} height={40} />
            <div className="options" style={{display: (showOptions) ? "block": "none"}}>
                <div className="option">
                    <p className="display_name">{user.username}</p>
                    <p className="email">{user.email}</p>
                </div>
                <hr></hr>
                <div className="option icon" onClick={() => {router.push("/creator/"+user.handle)}}>
                    <User /> {t('nav.item.user_options.profile')}
                </div>
                <div className="option icon" onClick={() => {router.push("/dashboard")}}>
                    <Table /> {t("nav.item.user_options.dashboard")}
                </div>
                {user.type === UserTypes.Admin && <div className="option icon" onClick={() => {router.push("/admin_dashboard")}}>
                    <Table /> {t("nav.item.user_options.admin")}
                </div>}
                <div className="option icon" onClick={() => {router.push("/account")}}>
                    <Settings /> {t("nav.item.user_options.settings")}
                </div>
                <div className="option icon" onClick={() => {sessionStorage.removeItem('jwt'); location.reload()}}>
                    <LogOut /> {t("nav.item.user_options.sign_out")}
                </div>
            </div>
        </div>
    )
}