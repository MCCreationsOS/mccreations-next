"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const LANGUAGES: { locale: string, name: string }[] = [
    { locale: "en-US", name: "English" },
    { locale: "zh-CN", name: "简体中文" },
    { locale: "zh-TW", name: "繁體中文" },
    { locale: "hi-IN", name: "हिंदी" },
    { locale: "fr-FR", name: "Français" },
    { locale: "ja-JP", name: "日本語" },
    { locale: "ko-KR", name: "한국어" },
    { locale: "ru-RU", name: "Русский (Россия)" },
    { locale: "nl-NL", name: "Nederlands" },
]

export default function LanguageSwitcher() {
    const t = useTranslations();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = useLocale();
    // Keep the query string (search, filters, page) when switching language
    const query = Object.fromEntries(searchParams.entries());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="secondary"><span>{t("Components.Navbar.LanguageSwitcher.current_language")}</span><ChevronDown /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="border-2 border-white/15 p-1">
                    {LANGUAGES.map((language) => (
                        <DropdownMenuItem key={language.locale} asChild>
                            <Link href={{ pathname, query }} locale={language.locale} lang={language.locale} aria-current={language.locale === current ? "true" : undefined} className="w-full">
                                {language.name}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                        <Link href="/translate" className="w-full flex items-center gap-2"><Plus />{t("Components.Navbar.LanguageSwitcher.help_translate")}</Link>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
