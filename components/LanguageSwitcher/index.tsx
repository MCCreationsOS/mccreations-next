
import { Link, useRouter } from "@/app/api/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown, Globe, Plus } from "lucide-react";
import DropDown, { DropDownItem } from "../FormInputs/RichText/DropDown";

export default function LanguageSwitcher() {
    const router = useRouter();
    const currentLocale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);


    const saveNewLanguage = (inputs: string[]) => {}

    return (
        <DropDown buttonClassName="options_dropdown_button language" buttonLabel={<div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>{t("Navigation.language")}<ChevronDown /></div>} className="option_dropdown" useButtonWidth={false} openOnHover={true}>
            <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'en-US'})}}>
                English
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'zh-CN'})}}>
                简体中文
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() =>{router.replace("/", {locale: 'ru-RU'})}}>
                Русский (Россия)
            </DropDownItem>
            <DropDownItem className="option_button" onClick={() =>{router.push("/translate")}}>
                <Plus />
                {t("Navigation.helpTranslate")}
            </DropDownItem>
        </DropDown>

    )
}