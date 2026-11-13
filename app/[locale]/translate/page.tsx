'use client'

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { routing } from "@/i18n/routing";


export default function Page() {
    const t = useTranslations()
    const [language, setLanguage] = useState("")
    const router = useRouter()
    const openEditor = (lang: string) => {
        const code = lang.trim()
        if (code) router.push(`/translate/${encodeURIComponent(code)}`)
    }

    return (
        <>
            <div className="max-w-3xl w-full mx-auto my-5 px-4 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{t('Pages.Translate.title')}</h1>
                <p className="text-sm">{t.rich('Pages.Translate.help', { link: (chunks) => <a target="_blank" rel="noopener noreferrer" className="underline" href="https://youtu.be/lhZTkbkuORI">{chunks}</a>})}</p>
                <div className="flex flex-row flex-wrap gap-2">
                    {routing.locales.map((lang) => (
                        <Button key={lang} variant="secondary" onClick={() => openEditor(lang)}>{lang}</Button>
                    ))}
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="w-fit">{t('Pages.Translate.AddLanguage.title')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Translate.AddLanguage.title')}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {t.rich('Pages.Translate.AddLanguage.language_description', {link: (chunks) => <a target="_blank" rel="noopener noreferrer" className="underline" href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">{chunks}</a>, link2: (chunks) => <a target="_blank" rel="noopener noreferrer" className="underline" href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">{chunks}</a>})}
                        </DialogDescription>
                        <form onSubmit={(e) => { e.preventDefault(); openEditor(language) }} className="flex flex-col gap-2">
                            <Input type="text" placeholder={t('Pages.Translate.AddLanguage.language_placeholder')} value={language} onChange={(e) => setLanguage(e.target.value)} />
                            <Button type="submit" className="w-fit">{t('Pages.Translate.AddLanguage.add')}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}