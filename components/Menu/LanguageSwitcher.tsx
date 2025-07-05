
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown, Globe, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function LanguageSwitcher() {
    const router = useRouter();
    const currentLocale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);


    const saveNewLanguage = (inputs: string[]) => {}

    return (
        <DropdownMenu>
            <DropdownMenuTrigger><Button variant="secondary"><span>{t("Components.Navbar.LanguageSwitcher.current_language")}</span><ChevronDown /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                    <DropdownMenuItem className="p-0"><Link href="/" locale="en-US" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">English</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="zh-CN" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">简体中文</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="fr-FR" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Français</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="de-DE" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Deutsch</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="es-ES" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Español</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="ja-JP" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">日本語</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="ko-KR" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">한국어</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/" locale="ru-RU" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start">Русский (Россия)</Button></Link></DropdownMenuItem>
                    <DropdownMenuItem className="p-0"><Link href="/translate" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start"><Plus />{t("Components.Navbar.LanguageSwitcher.help_translate")}</Button></Link></DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}