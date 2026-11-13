'use client'

import { CollectionNames, ContentTypes, IFile } from "@/app/api/types"
import { useEffect, useState } from "react"
import { ArrowLeft, Edit, X } from "lucide-react"
import VersionUploader from "."
import { useTranslations } from 'next-intl';
import { convertToType } from "@/app/api/content"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useForm } from "@tanstack/react-form"
import FileDropzone from "./FileUpload"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { getMinecraftVersions } from "@/app/api/minecraftVersions"
import { useDebounceValue } from "usehooks-ts"

export default function VersionManager({ onVersionsChanged, collectionName, forWhat, presetVersions }: { onVersionsChanged: (versions: string) => void, collectionName: CollectionNames, forWhat: string, presetVersions?: string }) {
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
        editForm.setFieldValue("minecraftVersion", (typeof renderVersion?.minecraftVersion === "string" ? renderVersion.minecraftVersion.split(",") : renderVersion?.minecraftVersion || []).filter((v) => v.length > 0))
        editForm.setFieldValue("url", renderVersion?.url || "")
    }, [renderVersion])

    const saveVersion = (contentVersion: string, minecraftVersion: string | string[], bedrock: boolean, url: string) => {
        let v: IFile = { ...renderVersion! };
        v.contentVersion = contentVersion
        v.minecraftVersion = minecraftVersion
        v.url = url

        if (bedrock) {
            switch (v.type) {
                case ContentTypes.Maps:
                    v.type = ContentTypes.BedrockMaps
                    break
                case ContentTypes.Resourcepacks:
                    v.type = ContentTypes.BedrockResourcepacks
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

        switch (url.substring(url.lastIndexOf('.') + 1)) {
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
            <Label>{t('Components.VersionManager.Version.edit', { version: renderVersion.contentVersion ?? "1.0.0" })}</Label>
            <Button type="button" variant="secondary" onClick={() => { setRenderVersion(undefined) }} className="w-fit"><ArrowLeft /><span>{t('Components.VersionManager.Version.back_to_versions')}</span></Button>
            <div className="flex flex-col gap-4 max-w-2xl" onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
                    e.preventDefault()
                    editForm.handleSubmit()
                }
            }}>
                <editForm.Field name="contentVersion" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>{t('Components.VersionManager.Version.version_number')}</Label>
                        <Input id={field.name} name={field.name} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )} />
                <editForm.Field name="minecraftVersion" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>{t('Components.VersionManager.Version.minecraft_version')}</Label>
                        <MinecraftVersionInput version={renderVersion} onChange={(v) => field.handleChange(v.split(",").filter((version) => version.length > 0))} />
                        {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )} />
                {/* <editForm.Field name="bedrock" children={(field) => (
                        // <Checkbox {...field.props} />
                    )}/> */}
                <editForm.Field name="url" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={field.name}>{t('Components.VersionManager.Version.MainFile.link')}</Label>
                        <Input id={field.name} name={field.name} type="url" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                        {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )} />
                <div className="flex flex-row gap-2">
                    <Button type="button" onClick={() => {
                        editForm.handleSubmit()
                    }} className="w-fit"><span>{t('Components.VersionManager.Version.save')}</span></Button>
                    <Button type="button" variant="secondary" className="w-fit" onClick={() => {
                        setRenderVersion(undefined)
                    }}><span>{t('Components.VersionManager.Version.cancel')}</span></Button>
                    <Button type="button" variant="destructive" className="w-fit" onClick={() => {
                        deleteVersion()
                    }}><span>{t('Components.VersionManager.Version.delete')}</span></Button>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <Label className="mb-2">{t('Components.VersionManager.title')}</Label>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row flex-wrap gap-2">
                    {versions && versions.map((version, idx) => {
                        return (
                            <Button type="button" variant="secondary" key={`version_${version.createdDate}_${idx}`} onClick={() => {
                                setRenderVersion(version)
                            }}><span>{version.contentVersion}</span>  <Edit /></Button>
                        )
                    })}
                </div>
                <div>
                    <Dialog open={addVersionDialogOpen} onOpenChange={setAddVersionDialogOpen}>
                        <DialogTrigger asChild><Button variant="secondary" type="button"><span>{t('Components.VersionManager.add_version')}</span></Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('Components.VersionManager.add_version')}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                uploadForm.handleSubmit()
                            }}>
                                <uploadForm.Field name="url" children={(field) => (
                                    <>
                                        <FileDropzone forWhat={forWhat} onFilesUploaded={field.handleChange} />
                                    </>
                                )} listeners={{
                                    onChange: (e) => {
                                        uploadForm.handleSubmit()
                                    }
                                }} />
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

/** Orders versions newest last: releases by number (1.20.4 < 1.21), snapshots (24w14a) by year/week */
function compareMinecraftVersions(a: string, b: string) {
    const snapshot = /^(\d+)w(\d+)([a-z]?)$/i
    const sa = a.match(snapshot), sb = b.match(snapshot)
    if (sa && sb) {
        return Number(sa[1]) - Number(sb[1]) || Number(sa[2]) - Number(sb[2]) || sa[3].localeCompare(sb[3])
    }
    if (sa) return 1
    if (sb) return -1
    const pa = a.split(/[.\-]/).map((part) => parseInt(part) || 0)
    const pb = b.split(/[.\-]/).map((part) => parseInt(part) || 0)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
        if (diff !== 0) return diff
    }
    return a.localeCompare(b)
}

function MinecraftVersionInput({
    version,
    onChange,
}: {
    version: IFile;
    onChange: (version: string) => void;
}) {
    const initial = typeof version.minecraftVersion === "string" ? version.minecraftVersion.split(",") : (version.minecraftVersion ?? [])
    const [selected, setSelected] = useState<string[]>(initial.filter((v) => v.length > 0));
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Wait for typing to pause before asking the API
    const [debouncedSearch] = useDebounceValue(search, 300);
    const [results, setResults] = useState<string[]>([]);
    const t = useTranslations();

    useEffect(() => {
        let cancelled = false
        getMinecraftVersions(debouncedSearch, ["release", "snapshot"]).then((versions) => {
            if (cancelled) return
            const ids: string[] = (versions?.documents ?? []).map((v: any) => v.id)
            setResults(ids.filter((id) => id.toLowerCase().includes(debouncedSearch.toLowerCase())))
        }).catch(() => {
            if (!cancelled) setResults([])
        })
        return () => { cancelled = true }
    }, [debouncedSearch])

    // Only suggest results for what's in the box right now, never a stale list
    const matches = debouncedSearch === search ? results.filter((v) => !selected.includes(v)) : []

    const update = (next: string[]) => {
        setSelected(next);
        onChange(next.join(","));
    };

    const addVersion = (value: string) => {
        if (value.length < 2 || selected.includes(value)) return;
        update([...selected, value].sort(compareMinecraftVersions));
        setSearch("");
    };

    const removeVersion = (value: string) => {
        update(selected.filter((v) => v !== value));
    };

    return (
        <Popover onOpenChange={setShowSuggestions} open={showSuggestions}>
            <PopoverTrigger asChild>
                <div className="flex flex-row flex-wrap gap-2 px-2 py-1 border overflow-auto">
                    <Input
                        className="border-none min-w-[100px] flex-1"
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                const value = search.trim();
                                if (!value) return;
                                // Prefer an exact match, then the top suggestion, then what was typed
                                addVersion(matches.includes(value) ? value : matches[0] ?? value);
                            }
                        }}
                        placeholder={t('Components.VersionManager.Version.search_placeholder')}
                        aria-label={t('Components.VersionManager.Version.minecraft_version')}
                    />
                    {selected.map((v) => (
                        <Button
                            type="button"
                            variant="ghost"
                            key={v}
                            className="text-sm border py-0 px-2"
                            onClick={() => removeVersion(v)}
                        >
                            {v} ×
                        </Button>
                    ))}
                </div>
            </PopoverTrigger>
            <PopoverContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="max-h-[25vh] overflow-y-auto"
            >
                <div className="flex flex-wrap gap-2 border-2 border-white/15 p-1">
                    {matches.map((v) => (
                        <Button
                            type="button"
                            variant="ghost"
                            key={v}
                            className="text-sm border py-0 px-2"
                            onClick={() => addVersion(v)}
                        >
                            {v}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
