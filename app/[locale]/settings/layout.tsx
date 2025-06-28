import Link from "next/link";
import styles from "./AccountSidebar.module.css"
import { Bell, Image, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode}) {
    return <div className="m-5 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Settings</h1>
                <div className="flex md:flex-row flex-col gap-10 ">
                    <nav className="md:max-w-[200px] flex md:flex-col flex-row gap-0 border-2 border-black bg-secondary h-fit">
                        <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/account"><User /> Account</Link>
                        <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/notifications"><Bell /> Notifications</Link>
                        <Link className="flex flex-row gap-2 items-center py-3 md:px-5 px-2 hover:bg-white/20 hover:border-t-white/20 hover:border-b-black/20 border-2 border-transparent" href="/settings/profile"><Image /> Profile</Link>
                    </nav>
                    {children}
                </div>
            </div>
}