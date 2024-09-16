
import { Link, useRouter } from "@/app/api/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Globe, Plus } from "react-feather";

export default function LanguageSwitcher() {
    const router = useRouter();
    const currentLocale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);


    const saveNewLanguage = (inputs: string[]) => {}

    return (
        <div className="select" style={{width:"100%", margin: 0}} onClick={() => {setOpen(!open)}}>
            <button className="selected_option" style={{padding: "0px 8px"}}><Globe /></button>
            <div className="options" style={{display: (open) ? "block": "none", left: "-320%"}}>
                <div className={(currentLocale === 'en-US') ? "option selected" : "option"} style={{fontSize: "0.9rem"}} onClick={() =>{router.replace("/", {locale: 'en-US'})}}>
                    US English
                </div>
                <div className={(currentLocale === 'zh-CN') ? "option selected" : "option"} style={{fontSize: "0.9rem"}} onClick={() =>{router.replace("/", {locale: 'zh-CN'})}}>
                    简体中文
                </div>
                <div className={(currentLocale === 'ru-RU') ? "option selected" : "option"} style={{fontSize: "0.9rem"}} onClick={() =>{router.replace("/", {locale: 'ru-RU'})}}>
                    Русский (Россия)
                </div>
                <div className="option icon" style={{fontSize: "0.9rem"}}>
                    <Link href="/translate"><Plus /></Link> <Link href={"/translate"}> {t('Translate.AddLanguage.title')}</Link>
                </div>
            </div>
        </div>
    )
}