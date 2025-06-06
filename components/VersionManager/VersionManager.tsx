'use client'

import { CollectionNames, ContentTypes, IFile } from "@/app/api/types"
import { useEffect, useState } from "react"
import { ArrowLeft, Edit, X } from "lucide-react"
import VersionUploader from "."
import {useTranslations} from 'next-intl';
import { convertToType } from "@/app/api/content"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useForm } from "@tanstack/react-form"
import FileDropzone from "./FileUpload"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function VersionManager({ onVersionsChanged, collectionName, presetVersions }: { onVersionsChanged: (versions: string) => void, collectionName: CollectionNames, presetVersions?: string }) {
    const [versions, setVersions] = useState<IFile[]>([])
    const [renderVersion, setRenderVersion] = useState<IFile>()
    const [idx, setIdx] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [addVersionDialogOpen, setAddVersionDialogOpen] = useState(false)
    const t = useTranslations()
    const uploadForm = useForm({
        defaultValues: {
            url: ""
        },
        onSubmit: (data) => {
            addVersion(data.value.url)
        }
    })
    const editForm = useForm({
        defaultValues: {
            contentVersion: "",
            minecraftVersion: "",
            bedrock: false,
            url: ""
        },
        onSubmit: (data) => {
            saveVersion(data.value.contentVersion, data.value.minecraftVersion, data.value.bedrock, data.value.url)
        }
    })

    useEffect(() => {
        if (versions && loaded && JSON.stringify(versions) !== presetVersions) {
            onVersionsChanged(JSON.stringify(versions))
        }
    }, [versions])

    useEffect(() => {
        if (presetVersions) {
            setVersions(JSON.parse(presetVersions))
        }
        if(versions.length === 0) {
            setAddVersionDialogOpen(true)
        }
        setLoaded(true)
    }, [])

    useEffect(() => {
        setIdx(versions.indexOf(renderVersion!))
        editForm.setFieldValue("contentVersion", renderVersion?.contentVersion || "")
        editForm.setFieldValue("minecraftVersion", renderVersion?.minecraftVersion || "")
        editForm.setFieldValue("url", renderVersion?.url || "")
    }, [renderVersion])

    const saveVersion = (contentVersion: string, minecraftVersion: string, bedrock: boolean, url: string) => {
        let v: IFile = { ...renderVersion! };
        v.contentVersion = contentVersion
        v.minecraftVersion = minecraftVersion
        v.url = url

        if(bedrock) {
            switch(renderVersion?.type) {
                case ContentTypes.Maps:
                    renderVersion.type = ContentTypes.BedrockMaps
                    break
                case ContentTypes.Resourcepacks:
                    renderVersion.type = ContentTypes.BedrockResourcepacks
                    break
            }
        }

        setRenderVersion(v)
        let vs = [...versions]
        vs[idx] = v
        setVersions(vs)
    }

    const deleteVersion = () => {
        let vs = [...versions]
        vs.splice(idx, 1)
        setVersions(vs)
        setRenderVersion(undefined)
    }

    const addVersion = (url: string) => {
        setAddVersionDialogOpen(false)
        let newVersions = (versions) ? [...versions] : []

        let type = convertToType(collectionName)

        switch(url.substring(url.lastIndexOf('.') + 1)) {
            case 'mcpack':
                type = ContentTypes.BedrockResourcepacks
                break
            case 'mcworld':
                type = ContentTypes.BedrockMaps
                break
            case 'mctemplate':
                type = ContentTypes.BedrockMaps
                break
            case 'mcaddon':
                type = ContentTypes.Addons
                break
        }

        newVersions.push({ type: type, contentVersion: "1.0.0", minecraftVersion: "", url: url, extraFiles: [], createdDate: Date.now() })
        newVersions.sort((a, b) => {
            return b.createdDate - a.createdDate
        })
        setVersions(newVersions)
        setRenderVersion(newVersions[0])
    }

    if (renderVersion) {
        return <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">{t('VersionManager.Version.edit', {version: renderVersion.contentVersion})}</h2>
                <Button variant="secondary" onClick={() => {setRenderVersion(undefined)}} className="w-fit"><ArrowLeft /><span>{t('VersionManager.Version.back_to_versions')}</span></Button>
                <form onSubmit={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    editForm.handleSubmit()
                }} className="flex flex-col gap-4 max-w-2xl">
                    <editForm.Field name="contentVersion" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>{t('VersionManager.Version.version_number')}</Label>
                            <Input id={field.name} name={field.name} defaultValue={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                        </div>
                    )}/>
                    <editForm.Field name="minecraftVersion" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>{t('VersionManager.Version.minecraft_version')}</Label>
                            <Input id={field.name} name={field.name} defaultValue={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                        </div>
                    )}/>
                    {/* <editForm.Field name="bedrock" children={(field) => (
                        // <Checkbox {...field.props} />
                    )}/> */}
                    <editForm.Field name="url" children={(field) => (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={field.name}>{t('VersionManager.Version.MainFile.link')}</Label>
                            <Input id={field.name} name={field.name} defaultValue={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                            {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                        </div>
                    )}/>
                    <div className="flex flex-row gap-2">
                        <Button type="submit" className="w-fit"><span>{t('VersionManager.Version.save')}</span></Button>
                        <Button type="button" variant="secondary" className="w-fit" onClick={() => {
                            setRenderVersion(undefined)
                        }}><span>{t('VersionManager.Version.cancel')}</span></Button>
                        <Button type="button" variant="destructive" className="w-fit" onClick={() => {
                            deleteVersion()
                        }}><span>{t('VersionManager.Version.delete')}</span></Button>
                    </div>
                </form>
            </div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">{t('VersionManager.title')}</h2>
            <div className="flex flex-col gap-2">
                <div>
                    <Dialog open={addVersionDialogOpen} onOpenChange={setAddVersionDialogOpen}>
                        <DialogTrigger><Button variant="secondary" type="button"><span>{t('VersionManager.add_version')}</span></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('VersionManager.add_version')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                uploadForm.handleSubmit()
                            }}>
                                <uploadForm.Field name="url" children={(field) => (
                                    <>
                                        <FileDropzone onFilesUploaded={field.handleChange}/>
                                    </>
                                )} listeners={{
                                    onChange: (e) => {
                                        console.log(e)
                                        uploadForm.handleSubmit()
                                    }
                                }}/>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                    {versions && versions.map((version, idx) => {
                        return (
                            <Button variant="secondary" key={`version_${version.createdDate}`} onClick={() => {
                                setRenderVersion(version)
                            }}><span>{version.contentVersion}</span>  <Edit /></Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export function isBedrockType(type: string) {
    return type === "bedrock_map" || type === 'bedrock_resourcepack' || type === "addon" || type === "behavior_pack"
}