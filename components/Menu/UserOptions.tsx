'use client'

import { useEffect, useState, } from "react"
import Image from "next/image"
import { UserTypes } from "@/app/api/types"
import { Bell, LogIn, LogOut, Settings, Table, User, UserPlus } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl";
import { useUser, useToken } from "@/app/api/hooks/users";
import { useIsClient } from "usehooks-ts";
import { useNotifications } from "@/app/api/hooks/notifications"
import { Button } from "../ui/button"
import { Link, useRouter } from "@/i18n/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

/** Pages that only make sense signed in; signing out on one of these goes back home */
const PROTECTED_PREFIXES = ["dashboard", "settings", "feed", "edit"]

/**
 * The user options menu displayed on the far right of the menu
 */
export default function UserOptions() {
    const isClient = useIsClient()
    const {user, setUser, isLoading} = useUser()
    const {token, setToken} = useToken()
    const {notifications} = useNotifications(0)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    const pathname = usePathname()
    const t = useTranslations();

    // Stop trying to use a dead token
    useEffect(() => {
        if(token && !isLoading && !user) {
            setToken("")
        }
    }, [token, isLoading, user, setToken])

    const signOut = () => {
        setToken("")
        setUser({_id: "", username: "", email: "", type: UserTypes.Account })
        if(PROTECTED_PREFIXES.includes(pathname.split("/")[2] ?? "")) {
            router.push("/")
        }
    }

    if(!isClient) {
        return null
    }

    const unread = notifications?.filter((n) => !n.read).length ?? 0

    const trigger = (
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="flex items-center gap-2 relative">
                <User className="h-5 w-5" />
                <span className="sr-only">{t('Components.Navbar.UserOptions.account')}</span>
                {user && unread > 0 && <>
                    <span className="absolute top-0 -right-1 w-3 h-3 bg-red-500 border-2 border-black" aria-hidden="true"></span>
                    <span className="sr-only">{t('Components.Navbar.UserOptions.unread', {count: unread})}</span>
                </>}
            </Button>
        </DropdownMenuTrigger>
    )

    if(!user || !user._id || user.username === "") {
        return <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            {trigger}
            <DropdownMenuContent>
                <div className="border-2 border-white/15">
                    <DropdownMenuItem asChild>
                        <Link href="/signin" className="w-full flex items-center gap-2"><LogIn /> {t("Components.Navbar.UserOptions.sign_in")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/signup" className="w-full flex items-center gap-2"><UserPlus /> {t("Components.Navbar.UserOptions.sign_up")}</Link>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            {trigger}
            <DropdownMenuContent>
                <div className="border-2 border-white/15 p-0">
                    <DropdownMenuItem asChild className="px-2 pt-2 pb-2">
                        <Link href={`/creator/${user.handle}`} className="w-full flex items-center gap-2">
                            <Image className="icon rounded-full w-8 h-8 object-cover" src={(user.iconURL) ? user.iconURL : "/defaultLogo.png"} alt={t('Components.Navbar.UserOptions.icon_alt')} width={40} height={40}/>
                            <p className="display_name">{user.username}</p>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/notifications" className="w-full flex items-center gap-2">
                            <Bell /> {t("Components.Navbar.UserOptions.notifications")}
                            {unread > 0 && <span className="ml-auto text-xs bg-red-500 text-white px-1.5">{unread}</span>}
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/creator/${user.handle}`} className="w-full flex items-center gap-2"><User /> {t('Components.Navbar.UserOptions.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="w-full flex items-center gap-2"><Table /> {t("Components.Navbar.UserOptions.dashboard")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="w-full flex items-center gap-2"><Settings /> {t("Components.Navbar.UserOptions.settings")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={signOut} className="flex items-center gap-2">
                        <LogOut /> {t("Components.Navbar.UserOptions.sign_out")}
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
