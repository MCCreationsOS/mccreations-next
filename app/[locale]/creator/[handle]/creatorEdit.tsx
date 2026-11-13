'use client'

import { ApiResult, updateProfile, updateSocialLinks } from "@/app/api/auth";
import { useToken, useUser } from "@/app/api/hooks/users";
import { IUser } from "@/app/api/types";
import ImageDropzone from "@/components/ImageDropzone";
import RichText from "@/components/RichText/RichText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Shared behavior for the profile edit dialogs
function useProfileSave(handle: string) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit")
    const {user, setUser} = useUser()
    const {token} = useToken()
    const router = useRouter()

    const save = async (request: (token: string) => Promise<ApiResult>, changes: Partial<IUser>) => {
        const result = await request(token)
        if(!result.ok) {
            toast.error(result.error || t("save_error"))
            return false
        }
        setUser({...user!, ...changes})
        toast.success(t("saved"))
        router.refresh()
        return true
    }

    return { user, isOwner: !!user && user.handle === handle, save }
}

function EditDialog({title, buttonLabel, open, setOpen, description, children}: {title: string, buttonLabel: string, open: boolean, setOpen: (open: boolean) => void, description?: string, children: React.ReactNode}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" type="button"><span>{buttonLabel}</span></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

function DialogButtons({form, save, cancel, onCancel}: {form: { Subscribe: any }, save: string, cancel: string, onCancel: () => void}) {
    return (
        <div className="flex flex-row gap-2">
            <form.Subscribe selector={(state: { isSubmitting: boolean }) => state.isSubmitting} children={(isSubmitting: boolean) => (
                <Button type="submit" disabled={isSubmitting}><span>{save}</span></Button>
            )}/>
            <Button type="button" variant="secondary" onClick={onCancel}><span>{cancel}</span></Button>
        </div>
    )
}

export function EditProfileImages({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditProfileImages")
    const [open, setOpen] = useState(false)
    const {user, isOwner, save} = useProfileSave(params.handle)

    const form = useForm({
        defaultValues: { banner: user?.bannerURL ?? "", icon: user?.iconURL ?? "" },
        onSubmit: async ({value}) => {
            if(await save((token) => updateProfile(token, {banner: value.banner, icon: value.icon}), {bannerURL: value.banner, iconURL: value.icon})) {
                setOpen(false)
            }
        }
    })

    if(!isOwner) return null

    // Load saved values
    const onOpenChange = (next: boolean) => {
        if(next) form.reset({ banner: user?.bannerURL ?? "", icon: user?.iconURL ?? "" })
        setOpen(next)
    }

    return (
        <div className="absolute right-3 top-3">
            <EditDialog title={t("title")} buttonLabel={t("button")} open={open} setOpen={onOpenChange}>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }} className="flex flex-col gap-2">
                    <form.Field name="banner" children={(field) => (
                        <>
                            <Label htmlFor={field.name} className="text-md font-medium">{t("banner")}</Label>
                            <ImageDropzone forWhat={user?.handle ?? ""} onImagesUploaded={(files) => {
                                field.handleChange(files[0]?.url ?? "")
                            }} allowMultiple={false} presetImage={field.state.value}/>
                        </>
                    )}/>
                    <form.Field name="icon" children={(field) => (
                        <>
                            <Label htmlFor={field.name} className="text-md font-medium">{t("icon")}</Label>
                            <ImageDropzone forWhat={user?.handle ?? ""} onImagesUploaded={(files) => {
                                field.handleChange(files[0]?.url ?? "")
                            }} allowMultiple={false} presetImage={field.state.value}/>
                        </>
                    )}/>
                    <DialogButtons form={form} save={t("save")} cancel={t("cancel")} onCancel={() => setOpen(false)} />
                </form>
            </EditDialog>
        </div>
    )
}

export function EditAbout({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditAbout")
    const [open, setOpen] = useState(false)
    const {user, isOwner, save} = useProfileSave(params.handle)
    const form = useForm({
        defaultValues: { about: user?.about ?? "" },
        onSubmit: async ({value}) => {
            if(await save((token) => updateProfile(token, {about: value.about}), {about: value.about})) {
                setOpen(false)
            }
        }
    })

    if(!isOwner) return null

    const onOpenChange = (next: boolean) => {
        if(next) form.reset({ about: user?.about ?? "" })
        setOpen(next)
    }

    return (
        <div className="mt-2">
            <EditDialog title={t("title")} buttonLabel={t("title")} open={open} setOpen={onOpenChange}>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }} className="flex flex-col gap-2 w-full">
                    <form.Field name="about" children={(field) => (
                        <RichText initialValue={user?.about} sendOnChange={(value) => {
                            field.handleChange(value)
                        }}/>
                    )}/>
                    <DialogButtons form={form} save={t("save")} cancel={t("cancel")} onCancel={() => setOpen(false)} />
                </form>
            </EditDialog>
        </div>
    )
}

export function EditSocialLinks({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditSocialLinks")
    const [open, setOpen] = useState(false)
    const {user, isOwner, save} = useProfileSave(params.handle)
    const form = useForm({
        defaultValues: { socialLinks: (user?.socialLinks ?? []) as {link: string, name: string}[] },
        onSubmit: async ({value}) => {
            const links = value.socialLinks
                .map((l) => ({name: l.name.trim(), link: l.link.trim()}))
                .filter((l) => l.link.length > 0)
            if(await save((token) => updateSocialLinks(token, links), {socialLinks: links})) {
                setOpen(false)
            }
        }
    })

    if(!isOwner) return null

    const onOpenChange = (next: boolean) => {
        if(next) form.reset({ socialLinks: user?.socialLinks ?? [] })
        setOpen(next)
    }

    return (
        <div className="mt-2">
            <EditDialog title={t("title")} buttonLabel={t("title")} open={open} setOpen={onOpenChange}>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }} className="flex flex-col gap-2">
                    <form.Field name="socialLinks" mode="array" children={(field) => (
                        <>
                            {field.state.value.map((link, index) => (
                                <div key={index} className="flex flex-row gap-2">
                                    <Input type="text" value={link.name} placeholder={t("name")} aria-label={t("name")} onChange={(e) => {
                                        field.replaceValue(index, {...link, name: e.target.value})
                                    }} />
                                    <Input type="url" value={link.link} placeholder={t("link")} aria-label={t("link")} onChange={(e) => {
                                        field.replaceValue(index, {...link, link: e.target.value})
                                    }} />
                                    <Button type="button" variant="destructive" onClick={() => field.removeValue(index)}><span>{t("remove")}</span></Button>
                                </div>
                            ))}
                            <Button type="button" variant="secondary" onClick={() => field.pushValue({link: "", name: ""})}><span>{t("add")}</span></Button>
                        </>
                    )}/>
                    <DialogButtons form={form} save={t("save")} cancel={t("cancel")} onCancel={() => setOpen(false)} />
                </form>
            </EditDialog>
        </div>
    )
}

export function EditCustomCss({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditCustomCss")
    const [open, setOpen] = useState(false)
    const {user, isOwner, save} = useProfileSave(params.handle)
    const form = useForm({
        defaultValues: { customCss: user?.customCSS ?? "" },
        onSubmit: async ({value}) => {
            if(await save((token) => updateProfile(token, {customCss: value.customCss}), {customCSS: value.customCss})) {
                setOpen(false)
            }
        }
    })

    if(!isOwner) return null

    const onOpenChange = (next: boolean) => {
        if(next) form.reset({ customCss: user?.customCSS ?? "" })
        setOpen(next)
    }

    return (
        <div className="mt-2">
            <EditDialog title={t("title")} buttonLabel={t("title")} description={t("description")} open={open} setOpen={onOpenChange}>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }} className="flex flex-col gap-2">
                    <form.Field name="customCss" children={(field) => (
                        <Editor value={field.state.value ?? ""} onValueChange={(value) => {
                            field.handleChange(value)
                        }} highlight={code => highlight(code, languages.css, "css")} className="w-full h-96 border-1 border-input font-mono text-sm" padding={10}/>
                    )}/>
                    <DialogButtons form={form} save={t("save")} cancel={t("cancel")} onCancel={() => setOpen(false)} />
                </form>
            </EditDialog>
        </div>
    )
}
