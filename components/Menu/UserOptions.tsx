'use client'

import { useEffect, useState, } from "react"
import Image from "next/image"
import { IUser, UserTypes } from "@/app/api/types"
import { Bell, LogIn, LogOut, Settings, Table, User, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUser } from "@/app/api/auth"
import { useTranslations } from "next-intl";
import { useUser, useToken } from "@/app/api/hooks/users";
import { useIsClient } from "usehooks-ts";
import { useNotifications } from "@/app/api/hooks/notifications"
import { Button } from "../ui/button"
import { Link } from "@/i18n/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const isClient = useIsClient()
    const {user, setUser, isLoading} = useUser()
    const {token, setToken} = useToken()
    const [isOpen, setIsOpen] = useState(false)
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
        return <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('Components.Navbar.UserOptions.account')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="border-2 border-white/15">
                    <DropdownMenuItem>
                        <Link href="/signin" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full">
                                <LogIn /> {t("Components.Navbar.UserOptions.sign_in")}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full">
                                <UserPlus /> {t("Components.Navbar.UserOptions.sign_up")}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('Components.Navbar.UserOptions.account')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="border-2 border-white/15 p-0">
                    <DropdownMenuItem className="px-2 pt-2 pb-0">
                        <Link href={`/creator/${user.handle}`} className="w-full flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <Image className="icon rounded-full w-8 h-8 object-cover" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt="User Icon" width={40} height={40}/>
                            <p className="display_name">{user.username}</p>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem className="p-0 justify-start">
                        <Link href="/dashboard/notifications" className="w-full" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                <Bell /> {t("Components.Navbar.UserOptions.notifications")}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 justify-start">
                        <Link href={`/creator/${user.handle}`} className="w-full" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                <User /> {t('Components.Navbar.UserOptions.profile')}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 justify-start">
                        <Link href="/dashboard" className="w-full" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                <Table /> {t("Components.Navbar.UserOptions.dashboard")}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 justify-start">
                        <Link href="/settings" className="w-full" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings /> {t("Components.Navbar.UserOptions.settings")}
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 justify-start">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                            signOut()
                            setIsOpen(false)
                        }}>
                            <LogOut /> {t("Components.Navbar.UserOptions.sign_out")}
                        </Button>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}