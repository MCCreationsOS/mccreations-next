'use client'

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { IUser, UserTypes } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { Bell, LogOut, Settings, Table, User, UserPlus } from "react-feather"
import { useRouter } from "next/navigation"
import { getUser, useUserStore } from "@/app/api/auth"
import HollowButton from "../Buttons/HollowButton"
import { useTranslations } from "next-intl";
import DropDown, { DropDownItem } from "../FormInputs/RichText/DropDown";
import { useUser } from "@/app/api/hooks/users";

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const {user, setUser, isLoading} = useUser()
    const router = useRouter();
    let t = useTranslations();

    useEffect(() => {
        if(!user || !user._id) {
            const storedUser = localStorage?.getItem('user')
            if(storedUser) {
                let user = JSON.parse(storedUser) as IUser
                getUser(localStorage?.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage?.setItem('user', JSON.stringify(user))
                    } else {
                        localStorage?.removeItem('jwt')
                        localStorage?.removeItem('user')
                    }
                })
                setUser(user)
            } else {
                getUser(localStorage?.getItem('jwt') + "").then((user) => {
                    if(user) {
                        setUser(user)
                        localStorage?.setItem('user', JSON.stringify(user))
                    } else {
                        localStorage?.removeItem('jwt')
                        localStorage?.removeItem('user')
                    }
                })
            }
        }
    }, [])

    if(!user || !user._id || user.username === "" || isLoading) {
        return (
            <div className="user_menu">
                <Link className="sign_in_button" href="/signin"><HollowButton>{t('Navigation.UserOptions.sign_in')}</HollowButton></Link>
                <Link className="sign_in_icon" href="/signup"><UserPlus /></Link>
            </div>
        )
    }

    return (
        <DropDown className="option_dropdown user_menu" buttonClassName="user_menu" buttonLabel={<div className="icon_container"><Image className="icon" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt="User Icon" width={40} height={40} />{user.notifications && user.notifications.length > 0 && user.notifications.filter((notification) => !notification.read).length > 0 && <div className="notification_indicator"></div>}</div>} useButtonWidth={false}>
            <DropDownItem className="option_button no-flex break-line" onClick={() => {router.push("/creator/"+user.handle)}}>
                <p className="display_name">{user.username}</p>
                <p className="email">{user.email}</p>
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() => {router.push("/dashboard/notifications")}}>
                <Bell /> {t("Navigation.UserOptions.notifications")} {user.notifications && user.notifications.length > 0 && user.notifications.filter((notification) => !notification.read).length > 0 && <div className="notification_count">{(user.notifications.filter((notification) => !notification.read).length < 10) ? user.notifications.filter((notification) => !notification.read).length : "9+"}</div>}
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() => {router.push("/creator/"+user.handle)}}>
                <User /> {t('Navigation.UserOptions.profile')}
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() => {router.push("/dashboard")}}>
                <Table /> {t("Navigation.UserOptions.dashboard")}
            </DropDownItem>
            {user.type === UserTypes.Admin && <DropDownItem className="option_button" onClick={() => {router.push("/admin_dashboard")}}>
                <Table /> {t("Navigation.UserOptions.admin")}
            </DropDownItem>}
            <DropDownItem className="option_button" onClick={() => {router.push("/settings")}}>
                <Settings /> {t("Navigation.UserOptions.settings")}
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() => {localStorage?.removeItem('jwt'); localStorage?.removeItem('user'); setUser({_id: "", username: "", email: "", type: UserTypes.Account })}}>
                <LogOut /> {t("Navigation.UserOptions.sign_out")}
            </DropDownItem>
        </DropDown>
    )
}