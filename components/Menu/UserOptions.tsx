'use client'

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { IUser, UserTypes } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { LogOut, Settings, Table, User, UserPlus } from "react-feather"
import { useRouter } from "next/navigation"
import { getUser, useUserStore } from "@/app/api/auth"
import HollowButton from "../Buttons/HollowButton"
import { useTranslations } from "next-intl";

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const user = useUserStore() as IUser
    const setUser = useUserStore((state) => state.setUser)
    const logout = useUserStore((state) => state.logout)
    const [showOptions, setShowOptions] = useState(false)
    const router = useRouter();
    let t = useTranslations();

    useEffect(() => {
        if(!user._id) {
            const storedUser = localStorage.getItem('user')
            if(storedUser) {
                let user = JSON.parse(storedUser) as IUser
                getUser(localStorage.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage.setItem('user', JSON.stringify(user))
                    } else {
                        localStorage.removeItem('jwt')
                        localStorage.removeItem('user')
                    }
                })
                setUser(user)
            } else {
                getUser(localStorage.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage.setItem('user', JSON.stringify(user))
                    } else {
                        localStorage.removeItem('jwt')
                        localStorage.removeItem('user')
                    }
                })
            }
        }
    }, [])

    if(!user._id) {
        return (
            <div className="user_menu">
                <Link className="sign_in_button" href="/signin"><HollowButton>{t('Navigation.UserOptions.sign_in')}</HollowButton></Link>
                <Link className="sign_in_icon" href="/signup"><UserPlus /></Link>
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
                    <User /> {t('Navigation.UserOptions.profile')}
                </div>
                <div className="option icon" onClick={() => {router.push("/dashboard")}}>
                    <Table /> {t("Navigation.UserOptions.dashboard")}
                </div>
                {user.type === UserTypes.Admin && <div className="option icon" onClick={() => {router.push("/admin_dashboard")}}>
                    <Table /> {t("Navigation.UserOptions.admin")}
                </div>}
                <div className="option icon" onClick={() => {router.push("/account")}}>
                    <Settings /> {t("Navigation.UserOptions.settings")}
                </div>
                <div className="option icon" onClick={() => {localStorage.removeItem('jwt'); localStorage.removeItem('user'); logout()}}>
                    <LogOut /> {t("Navigation.UserOptions.sign_out")}
                </div>
            </div>
        </div>
    )
}