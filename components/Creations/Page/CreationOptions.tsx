import { convertToCollection, updateTranslation } from "@/app/api/content";
import { useToken, useUser } from "@/app/api/hooks/users";
import { IContentDoc, UserTypes } from "@/app/api/types";
import RichText from "@/components/RichText/RichText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { routing } from "@/i18n/routing";
import { useForm } from "@tanstack/react-form";
import { EllipsisVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreationOptions({creation}: {creation: IContentDoc}) {
    const {user} = useUser()
    const [open, setOpen] = useState(false)
    const pageLocale = useLocale()
    // Default to the language the visitor is reading the site in
    const [locale, setLocale] = useState(pageLocale)
    const {token} = useToken()
    const t = useTranslations()
    const canEdit = !!user && (creation.creators.some(creator => creator.handle === user.handle) || creation.owner === user.handle || user.type === UserTypes.Admin)

    /** Existing text for a language, falling back to the original */
    const valuesFor = (language: string) => {
        const existing = creation.translations?.[language]
        return {
            language,
            title: existing?.title ?? creation.title,
            shortDescription: existing?.shortDescription ?? creation.shortDescription,
            description: existing?.description ?? creation.description,
        }
    }

    const form = useForm({
        defaultValues: valuesFor(locale),
        onSubmit: async ({value}) => {
            const translation = {
                [value.language]: {
                    title: value.title,
                    shortDescription: value.shortDescription,
                    description: value.description
                }
            }
            const result = await updateTranslation(creation.slug, creation.type, translation, token)
            if (result?.error) {
                toast.error(result.error || t('Components.Creations.Page.CreationOptions.error'))
                return
            }
            // Editors' translations go live; everyone else's wait for the creator to approve them
            toast.success(t(canEdit ? 'Components.Creations.Page.CreationOptions.saved' : 'Components.Creations.Page.CreationOptions.submitted'))
            setOpen(false)
        }
    })

    const changeLanguage = (language: string) => {
        setLocale(language)
        form.reset(valuesFor(language))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Not modal, so the menu doesn't fight the dialog over focus when it opens */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="flex items-center gap-2 py-5">
                        <EllipsisVertical className="h-5 w-5" />
                        <span className="sr-only">{t('Components.Creations.Page.CreationOptions.button')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setOpen(true)}>
                        {t('Components.Creations.Page.CreationOptions.translate')}
                    </DropdownMenuItem>
                    {canEdit && <DropdownMenuItem asChild>
                        <Link href={`/edit/${creation.type}/${creation.slug}`} className="w-full">
                            {t('Components.Creations.Page.CreationOptions.edit')}
                        </Link>
                    </DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('Components.Creations.Page.CreationOptions.translate')}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {t('Components.Creations.Page.CreationOptions.translateDescription')}
                </DialogDescription>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }} className="flex flex-col gap-4 max-w-[29rem]">
                    <form.Field name="language" children={(field) => (
                            <div className="flex flex-col gap-2">
                            <Label htmlFor="language">{t('Components.Creations.Page.CreationOptions.language')}</Label>
                            <Select onValueChange={changeLanguage} value={field.state.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('Components.Creations.Page.CreationOptions.languagePlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {routing.locales.map(locale => (
                                        <SelectItem key={locale} value={locale} className="cursor-pointer hover:bg-black/10">{locale}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}/>
                    <form.Field name="title" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="title">{t('Components.Creations.Page.CreationOptions.title')}</Label>
                            <Input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <form.Field name="shortDescription" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="shortDescription">{t('Components.Creations.Page.CreationOptions.shortDescription')}</Label>
                            <Input type="text" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        </div>
                    )} />
                    <form.Field name="description" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">{t('Components.Creations.Page.CreationOptions.description')}</Label>
                            {/* Remount per language so the editor loads that language's text */}
                            <RichText key={locale} initialValue={valuesFor(locale).description} sendOnChange={(value) => field.handleChange(value)} />
                        </div>
                    )} />
                    <div className="flex flex-row gap-2">
                        <form.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                            <Button type="submit" disabled={isSubmitting}><span>{t('Components.Creations.Page.CreationOptions.submit')}</span></Button>
                        )}/>
                        <Button type="button" variant="secondary" onClick={() => {
                            form.reset()
                            setOpen(false)
                        }}><span>{t('Components.Creations.Page.CreationOptions.cancel')}</span></Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}