import Link from "next/link";
import styles from "./AccountSidebar.module.css"
import { Bell, Image, User } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{locale: string}>}) {
    const {locale} = await params;
    const t = await getTranslations({locale: locale})
    return <div className="m-5 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{t('Pages.Settings.title')}</h1>
                <div className="flex md:flex-row flex-col gap-10 ">
                    <nav className="md:max-w-[200px] flex md:flex-col flex-row gap-0 border-2 border-black bg-secondary h-fit">
                        <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/account"><User /> {t('Pages.Settings.account_menu_item')}</Link>
                        {/* <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/notifications"><Bell /> {t('Pages.Settings.notifications_menu_item')}</Link> */}
                        <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/profile"><Image /> {t('Pages.Settings.profile_menu_item')}</Link>
                    </nav>
                    {children}
                </div>
            </div>
}