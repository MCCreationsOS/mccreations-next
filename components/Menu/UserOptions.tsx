'use client'

import { useEffect, } from "react"
import Image from "next/image"
import { IUser, UserTypes } from "@/app/api/types"
import { Bell, LogOut, Settings, Table, User } from "react-feather"
import { useRouter } from "next/navigation"
import { getUser } from "@/app/api/auth"
import HollowButton from "../Buttons/HollowButton"
import { useTranslations } from "next-intl";
import DropDown, { DropDownItem } from "../FormInputs/RichText/DropDown";
import { useUser, useToken } from "@/app/api/hooks/users";
import { useIsClient } from "usehooks-ts";
import { useNotifications } from "@/app/api/hooks/notifications"

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const isClient = useIsClient()
    const {user, setUser, isLoading} = useUser()
    const {notifications} = useNotifications(0)
    const {token, setToken} = useToken()
    const router = useRouter();
    let t = useTranslations();

    useEffect(() => {
        if(!user || !user._id) {
            getUser(token).then((user) => {
                if(user && user._id !== "") {
                    setUser(user)
                } else {
                    setToken("")
                    setUser({_id: "", username: "", email: "", type: UserTypes.Account })
                }
            })
        }
    }, [])

    const signOut = () => {
        setToken("")
        setUser({_id: "", username: "", email: "", type: UserTypes.Account })
    }

    if(!isClient) {
        return null
    }

    if(!user || !user._id || user.username === "" || isLoading) {
        return <HollowButton onClick={() => {router.push("/signin")}}>{t("Navigation.UserOptions.sign_in")}</HollowButton>
    }

    return (
        <DropDown className="option_dropdown user_menu" buttonClassName="user_menu" buttonLabel={<div className="icon_container"><Image className="icon" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt="User Icon" width={40} height={40} />{notifications && notifications.length > 0 && notifications.filter((notification) => !notification.read).length > 0 && <div className="notification_indicator"></div>}</div>} useButtonWidth={false}>
            <DropDownItem className="option_button no-flex break-line" onClick={() => {router.push("/creator/"+user.handle)}}>
                <p className="display_name">{user.username}</p>
                <p className="email">{user.email}</p>
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() => {router.push("/dashboard/notifications")}}>
                <Bell /> {t("Navigation.UserOptions.notifications")} {notifications && notifications.length > 0 && notifications.filter((notification) => !notification.read).length > 0 && <div className="notification_count">{(notifications.filter((notification) => !notification.read).length < 10) ? notifications.filter((notification) => !notification.read).length : "9+"}</div>}
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
            <DropDownItem className="option_button" onClick={signOut}>
                <LogOut /> {t("Navigation.UserOptions.sign_out")}
            </DropDownItem>
        </DropDown>
    )
}