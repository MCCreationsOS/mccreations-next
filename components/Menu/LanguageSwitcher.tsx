"use client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown, Globe, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function LanguageSwitcher() {
    const t = useTranslations();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild><Button variant="secondary"><span>{t("Components.Navbar.LanguageSwitcher.current_language")}</span><ChevronDown /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="en-US" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">English</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="zh-CN" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">简体中文</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="zh-TW" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">繁體中文</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="hi-IN" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">हिंदी</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="fr-FR" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Français</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="ja-JP" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">日本語</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="ko-KR" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">한국어</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="ru-RU" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Русский (Россия)</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href={pathname} locale="nl-NL" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Nederlands</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/translate" className="w-full" onClick={() => setOpen(false)}><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start"><Plus />{t("Components.Navbar.LanguageSwitcher.help_translate")}</Button></Link></DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}