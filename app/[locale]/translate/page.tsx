'use client'

import { Link } from "@/app/api/navigation";
import { useTranslations } from "next-intl";
import { Locales } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";


export default function Page() {
    const t = useTranslations()
    const [language, setLanguage] = useState("")

    return (
        <>
            <div className="w-1/2 mx-auto my-5 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{t('Pages.Translate.title')}</h1>
                <p className="text-sm">{t.rich('Pages.Translate.help', { link: (chunks) => <Link target="_blank" rel="noopener noreferrer" className="underline" href="https://youtu.be/lhZTkbkuORI">{chunks}</Link>})}</p>
                <div className="flex flex-row gap-2">
                    {Locales.map((lang) => (
                        <Button key={lang} variant="secondary" onClick={() => {
                            window.location.href = `/translate/${lang}`
                        }}>{lang}</Button>
                    ))}
                </div>
                <Dialog>
                    <DialogTrigger>
                        <Button variant="secondary">{t('Pages.Translate.AddLanguage.title')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Pages.Translate.AddLanguage.title')}</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            {t.rich('Pages.Translate.AddLanguage.language_description', {link: (chunks) => <Link target="_blank" rel="noopener noreferrer" className="underline" href="https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes">{chunks}</Link>, link2: (chunks) => <Link target="_blank" rel="noopener noreferrer" className="underline" href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements">{chunks}</Link>})}
                        </DialogDescription>
                        <Input type="text" placeholder={t('Pages.Translate.AddLanguage.language_placeholder')} value={language} onChange={(e) => setLanguage(e.target.value)} />
                        <Button type="submit" onClick={() => {
                            window.location.href = `/translate/${language}`
                        }}>{t('Pages.Translate.AddLanguage.add')}</Button>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}