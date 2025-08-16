import { convertToCollection, updateTranslation } from "@/app/api/content";
import { useToken, useUser } from "@/app/api/hooks/users";
import { IContentDoc, UserTypes } from "@/app/api/types";
import RichText from "@/components/RichText/RichText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { routing } from "@/i18n/routing";
import { useForm } from "@tanstack/react-form";
import { EllipsisVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreationOptions({creation}: {creation: IContentDoc}) {
    const {user} = useUser()
    const [open, setOpen] = useState(false)
    const [locale, setLocale] = useState("en-US")
    const {token} = useToken()
    const t = useTranslations()
    const form = useForm({
        defaultValues: {
            language: locale,
            title: creation.translations && creation.translations[locale] ? creation.translations[locale].title : creation.title,
            shortDescription: creation.translations && creation.translations[locale] ? creation.translations[locale].shortDescription : creation.shortDescription,
            description: creation.translations && creation.translations[locale] ? creation.translations[locale].description : creation.description,
        },
        onSubmit: (values) => {
            let translation = {
                [values.value.language]: {
                    title: values.value.title,
                    shortDescription: values.value.shortDescription,
                    description: values.value.description
                }
            }
            updateTranslation(creation.slug, creation.type, translation, token)
            setOpen(false)
        }
    })

    useEffect(() => {
        form.setFieldValue("title", creation.translations && creation.translations[locale] ? creation.translations[locale].title : creation.title)
        form.setFieldValue("shortDescription", creation.translations && creation.translations[locale] ? creation.translations[locale].shortDescription : creation.shortDescription)
        form.setFieldValue("description", creation.translations && creation.translations[locale] ? creation.translations[locale].description : creation.description)
    }, [locale])
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="secondary" className="flex items-center gap-2 py-5">
                        <EllipsisVertical className="h-5 w-5" />
                        <span className="sr-only">{t('Components.Creations.Page.CreationOptions.button')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <DialogTrigger asChild>
                            <Button variant="ghost" type="button">
                                <span>{t('Components.Creations.Page.CreationOptions.translate')}</span>
                            </Button>
                        </DialogTrigger>
                    </DropdownMenuItem>
                    {user && (creation.creators.some(creator => creator.handle === user.handle) || creation.owner === user.handle || user.type === UserTypes.Admin) && <DropdownMenuItem>
                        <Link href={`/edit/${creation.type}/${creation.slug}`} className="w-full">
                            <Button variant="ghost" type="button">
                                <span>{t('Components.Creations.Page.CreationOptions.edit')}</span>
                            </Button>
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
                            <Select onValueChange={(value) => {
                                field.handleChange(value)
                                setLocale(value)
                            }} value={field.state.value}>
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
                    )} listeners={{
                        onChange: (field) => {
                            setLocale(field.value)
                        }
                    }}/>
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
                            <RichText initialValue={creation.translations && creation.translations[locale] ? creation.translations[locale].description : creation.description} sendOnChange={(value) => field.handleChange(value)} />
                        </div>
                    )} />
                    <div className="flex flex-row gap-2">
                        <Button type="submit"><span>{t('Components.Creations.Page.CreationOptions.submit')}</span></Button>
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