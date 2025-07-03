
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
            <DropdownMenuTrigger><Button variant="secondary"><span>{t("Menu.LanguageSwitcher.language")}</span><ChevronDown /></Button></DropdownMenuTrigger>
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
                    <DropdownMenuItem className="p-0"><Link href="/translate" className="w-full"><Button variant="ghost" className="m-0 p-1 h-full w-full justify-start"><Plus />{t("Menu.LanguageSwitcher.helpTranslate")}</Button></Link></DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
        // <DropDown buttonClassName="options_dropdown_button language" buttonLabel={<div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>{t("Navigation.language")}<ChevronDown /></div>} className="option_dropdown" useButtonWidth={false} openOnHover={true}>
        //     <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'en-US'})}}>
        //         English
        //     </DropDownItem>
        //     <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'zh-CN'})}}>
        //         简体中文
        //     </DropDownItem>
        //     <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'ru-RU'})}}>
        //         Русский (Россия)
        //     </DropDownItem>
        //     <DropDownItem className="option_button" onClick={() =>{router.push("/translate")}}>
        //         <Plus />
        //         {t("Navigation.helpTranslate")}
        //     </DropDownItem>
        // </DropDown>

    )
}