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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { getMinecraftVersions } from "@/app/api/minecraftVersions"

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
            minecraftVersion: [] as string[],
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
        setLoaded(true)
    }, [])

    useEffect(() => {
        setIdx(versions.indexOf(renderVersion!))
        editForm.setFieldValue("contentVersion", renderVersion?.contentVersion || "")
        editForm.setFieldValue("minecraftVersion", typeof renderVersion?.minecraftVersion === "string" ? [renderVersion.minecraftVersion] : renderVersion?.minecraftVersion || [])
        editForm.setFieldValue("url", renderVersion?.url || "")
    }, [renderVersion])

    const saveVersion = (contentVersion: string, minecraftVersion: string | string[], bedrock: boolean, url: string) => {
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
                <Label>{t('VersionManager.Version.edit', {version: renderVersion.contentVersion})}</Label>
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
                            <MinecraftVersionInput version={renderVersion} onChange={(v) => field.handleChange(v.split(","))} />
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
            <Label className="mb-2">{t('VersionManager.title')}</Label>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap gap-2">
                    {versions && versions.map((version, idx) => {
                        return (
                            <Button variant="secondary" key={`version_${version.createdDate}`} onClick={() => {
                                setRenderVersion(version)
                            }}><span>{version.contentVersion}</span>  <Edit /></Button>
                        )
                    })}
                </div>
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
            </div>
        </div>
    )
}

export function isBedrockType(type: string) {
    return type === "bedrock_map" || type === 'bedrock_resourcepack' || type === "addon" || type === "behavior_pack"
}

function MinecraftVersionInput({
    version,
    onChange,
}: {
    version: IFile;
    onChange: (version: string) => void;
}) {
    const [versionInput, setVersionInput] = useState(typeof version.minecraftVersion === "string" ? version.minecraftVersion : version.minecraftVersion.join(","));
    const [search, setSearch] = useState("");
    const [bestSuggestion, setBestSuggestion] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const t = useTranslations();

    const addTag = (tag: string) => {
        if (versionInput.split(",").includes(tag)) return;
        if (tag.length < 2) return;
        setVersionInput(versionInput + "," + tag);
        setSearch("");
        onChange(versionInput);
    };

    const removeTag = (tag: string) => {
        setVersionInput(versionInput.replace("," + tag, ""));
        onChange(versionInput);
    };

    return (
        <Popover onOpenChange={setShowSuggestions} open={showSuggestions}>
            <PopoverTrigger asChild>
                <div className="flex flex-row gap-2 px-2 py-1 border overflow-auto">
                    <Input
                        className="border-none min-w-[100px]"
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addTag(bestSuggestion);
                            }
                        }}
                        placeholder="Start typing to search for versions..."
                    />
                    <Label className="text-md font-medium">
                        {versionInput.split(",").map((version) => {
                            if (version.length === 0) return null;
                            return (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    key={version}
                                    className="text-sm border py-0 px-2"
                                    onClick={() => {
                                        removeTag(version);
                                    }}
                                >
                                    {version}
                                </Button>
                            );
                        })}
                    </Label>
                </div>
            </PopoverTrigger>
            <PopoverContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="max-h-[25vh] overflow-y-auto"
            >
                <div className="flex flex-col gap-2">
                    <VersionSearch
                        search={search}
                        onSelect={addTag}
                        onBestSuggestionChanged={setBestSuggestion}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

function VersionSearch({
    search,
    onBestSuggestionChanged,
    onSelect,
}: {
    search: string;
    onBestSuggestionChanged: (tag: string) => void;
    onSelect: (tag: string) => void;
}) {
    const t = useTranslations();
    const [versions, setVersions] = useState<string[]>([])

    useEffect(() => {
        getMinecraftVersions(search, ["release", "snapshot"]).then((versions) => {
            setVersions(versions.documents.map((v: any) => v.id))
        })
    }, [search])

    return (
        <div className="flex flex-wrap gap-2 border-2 border-white/15 p-1">
            {versions
                .filter((version) =>
                    version.toLowerCase().includes(search.toLowerCase())
                )
                .map((version, index) => {
                    if (index === 0) {
                        onBestSuggestionChanged(version);
                    }
                    return (
                        <Button
                            type="button"
                            variant="ghost"
                            key={version}
                            className="text-sm border py-0 px-2"
                            onClick={() => {
                                onSelect(version);
                            }}
                        >
                            {version}
                        </Button>
                    );
                })}
        </div>
    );
}