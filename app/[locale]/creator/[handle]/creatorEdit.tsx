'use client'

import { updateProfile, updateSocialLinks } from "@/app/api/auth";
import { useToken, useUser } from "@/app/api/hooks/users";
import ImageDropzone from "@/components/ImageDropzone";
import RichText from "@/components/RichText/RichText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { useTranslations } from "next-intl";

export function EditProfileImages({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditProfileImages")
    const [open, setOpen] = useState(false)
    const {user, setUser} = useUser()
    const {token} = useToken()
    
    const form = useForm({
        defaultValues: {
            banner: user?.bannerURL,
            icon: user?.iconURL
        },
        onSubmit: async (values) => {
            await updateProfile(token, values.value.banner, values.value.icon, user?.username, user?.about)
            setOpen(false)
            setUser({...user!, bannerURL: values.value.banner, iconURL: values.value.icon})
            form.reset()
        }
    })
    
    if(user?.handle !== params.handle) return null

    return (
        <div className="absolute right-3 top-3">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant="secondary" type="button"><span>{t("button")}</span></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }} className="flex flex-col gap-2">
                        <form.Field name="banner" children={(field) => (
                            <>
                                <Label htmlFor={field.name} className="text-md font-medium">{t("banner")}</Label>
                                <ImageDropzone onImagesUploaded={(files) => {
                                    field.handleChange(files[0].url)
                                }} allowMultiple={false} presetImage={field.state.value}/>
                            </>
                        )}/>
                        <form.Field name="icon" children={(field) => (
                            <>
                                <Label htmlFor={field.name} className="text-md font-medium">{t("icon")}</Label>
                                <ImageDropzone onImagesUploaded={(files) => {
                                    field.handleChange(files[0].url)
                                }} allowMultiple={false} presetImage={field.state.value}/>
                            </>
                        )}/>
                        <div className="flex flex-row gap-2">
                            <Button type="submit"><span>{t("save")}</span></Button>
                            <Button type="button" variant="secondary" onClick={() => {
                                setOpen(false)
                                form.reset()
                            }}><span>{t("cancel")}</span></Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function EditAbout({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditAbout")
    const [open, setOpen] = useState(false)
    const {user} = useUser()
    const {token} = useToken()
    const form = useForm({
        defaultValues: {
            about: user?.about
        },
        onSubmit: async (values) => {
            await updateProfile(token, user?.bannerURL, user?.iconURL, user?.username, values.value.about)
            setOpen(false)
            form.reset()
        }
    })

    if(user?.handle !== params.handle) return null

    return (
        <div className="mt-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant="secondary" type="button"><span>{t("title")}</span></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }} className="flex flex-col gap-2 w-md">
                        <form.Field name="about" children={(field) => (
                            <RichText initialValue={user?.about} sendOnChange={(value) => {
                                field.handleChange(value)
                            }}/>
                        )}/>
                        <div className="flex flex-row gap-2">
                            <Button type="submit"><span>{t("save")}</span></Button>
                            <Button type="button" variant="secondary" onClick={() => {
                                setOpen(false)
                                form.reset()
                            }}><span>{t("cancel")}</span></Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function EditSocialLinks({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditSocialLinks")
    const [open, setOpen] = useState(false)
    const {user} = useUser()
    const {token} = useToken()
    const [socialLinks, setSocialLinks] = useState<{link: string, name: string}[]>(user?.socialLinks ?? [])
    const form = useForm({
        defaultValues: {
            socialLinks: socialLinks
        },
        onSubmit: async (values) => {
            await updateSocialLinks(token, values.value.socialLinks ?? [])
            setOpen(false)
            form.reset()
        }
    })

    if(user?.handle !== params.handle) return null

    return (
        <div className="mt-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant="secondary" type="button"><span>{t("title")}</span></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }} className="flex flex-col gap-2">
                        {socialLinks?.map((link: {link: string, name: string}, index: number) => (
                            <div key={index} className="flex flex-row gap-2">
                                <Input type="text" value={link.name} defaultValue={link.name} placeholder="Name" onChange={(e) => {
                                    setSocialLinks(socialLinks.map((l, i) => i === index ? {link: l.link, name: e.target.value} : l))
                                }} />
                                <Input type="text" value={link.link} defaultValue={link.link} placeholder="Link" onChange={(e) => {
                                    setSocialLinks(socialLinks.map((l, i) => i === index ? {link: e.target.value, name: l.name} : l))
                                }} />
                                <Button type="button" variant="destructive" onClick={() => {
                                    setSocialLinks(socialLinks.filter((_, i) => i !== index))
                                }}><span>{t("remove")}</span></Button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={() => {
                            setSocialLinks([...socialLinks, {link: "", name: ""}])
                        }}><span>{t("add")}</span></Button>
                        <div className="flex flex-row gap-2">
                            <Button type="submit"><span>{t("save")}</span></Button>
                            <Button type="button" variant="secondary" onClick={() => {
                                setOpen(false)
                                form.reset()
                            }}><span>{t("cancel")}</span></Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export function EditCustomCss({params}: {params: {handle: string}}) {
    const t = useTranslations("Pages.Creator.handle.CreatorEdit.EditCustomCss")
    const [open, setOpen] = useState(false)
    const {user} = useUser()
    const {token} = useToken()
    const form = useForm({
        defaultValues: {
            customCss: user?.customCSS
        },
        onSubmit: async (values) => {
            await updateProfile(token, user?.bannerURL, user?.iconURL, user?.username, user?.about, values.value.customCss)
            setOpen(false)
            form.reset()
        }
    })

    if(user?.handle !== params.handle) return null

    return (
        <div className="mt-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                    <Button variant="secondary" type="button"><span>{t("title")}</span></Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("title")}</DialogTitle>
                    </DialogHeader>
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
                        <div className="flex flex-row gap-2">
                            <Button type="submit"><span>{t("save")}</span></Button>
                            <Button type="button" variant="secondary" onClick={() => {
                                setOpen(false)
                                form.reset()
                            }}><span>{t("cancel")}</span></Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}