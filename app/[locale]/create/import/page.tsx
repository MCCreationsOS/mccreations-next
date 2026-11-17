"use client"

import { convertToCollection, createEmptyCreation, errorCheckContent, importContent, requestApproval } from "@/app/api/content"
import { useToken, useTokenOrKey } from "@/app/api/hooks/users"
import { IContentDoc } from "@/app/api/types"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useState } from "react"
import { useSessionStorage } from "usehooks-ts"
import styles from "../create.module.css"
import { toast } from "sonner"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateDetails, Files, Images, Required } from "../formElements"
import { Label } from "@/components/ui/label"

/** Pull complete JSON objects out of a buffered stream (NDJSON lines and/or brace-balanced objects). */
function extractJsonObjects(buffer: string): { objects: any[], rest: string } {
    const objects: any[] = []
    let rest = buffer

    while (rest.length > 0) {
        const trimmedStart = rest.match(/^\s*/)?.[0].length ?? 0
        rest = rest.slice(trimmedStart)
        if (!rest) break

        if (rest[0] !== "{" && rest[0] !== "[") {
            const nl = rest.indexOf("\n")
            if (nl === -1) break
            rest = rest.slice(nl + 1)
            continue
        }

        let depth = 0
        let inString = false
        let escape = false
        let end = -1
        for (let i = 0; i < rest.length; i++) {
            const ch = rest[i]
            if (inString) {
                if (escape) escape = false
                else if (ch === "\\") escape = true
                else if (ch === '"') inString = false
                continue
            }
            if (ch === '"') {
                inString = true
                continue
            }
            if (ch === "{" || ch === "[") depth++
            else if (ch === "}" || ch === "]") {
                depth--
                if (depth === 0) {
                    end = i
                    break
                }
            }
        }

        if (end === -1) break

        const slice = rest.slice(0, end + 1)
        rest = rest.slice(end + 1)
        try {
            objects.push(JSON.parse(slice))
        } catch {
            // Skip malformed complete slices; keep going with the remainder
        }
    }

    return { objects, rest }
}

export default function ImportPage() {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const [activeTab, setActiveTab] = useState("import");
    const [tabsDisabled, setTabsDisabled] = useState(true);
    const { token } = useTokenOrKey();

    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const router = useRouter();
    const t = useTranslations();

    const handleTabChange = (tab: string) => {
        if (tabsDisabled && tab !== "import") return;
        setActiveTab(tab);
    };

    const handleNext = () => {
        if (activeTab === "import") {
            setActiveTab("details");
        } else if (activeTab === "details") {
            setActiveTab("files");
        } else if (activeTab === "files") {
            setActiveTab("images");
        } else if (activeTab === "images") {
            onFinish();
        }
    };

    const onImportComplete = () => {
        setTabsDisabled(false);
        setActiveTab("details");
    };

    const onFinish = () => {
        if (!creation || "error" in creation) return;
        const errors = errorCheckContent(creation);
        for (const error of errors) {
            toast.error(t(error.error));
        }
        if (errors.length > 0) return;

        requestApproval(creation.slug, collectionName, token)
            .then(() => {
                toast.success(t('Pages.Create.submitted'));
                setCreation(createEmptyCreation());
                router.push(`/dashboard`);
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <div className="max-w-3xl w-full mx-auto px-4 mt-5 p-5">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="w-full">
                    <TabsTrigger value="import" className="w-1/4">{t('Pages.Create.Import.title')}</TabsTrigger>
                    <TabsTrigger value="details" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Details.title')}</TabsTrigger>
                    <TabsTrigger value="files" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Files.title')}</TabsTrigger>
                    <TabsTrigger value="images" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Images.title')}</TabsTrigger>
                </TabsList>
                <TabsContent value="import">
                    <Import onImportComplete={onImportComplete} />
                </TabsContent>
                <TabsContent value="details">
                    <CreateDetails handleNext={handleNext} />
                </TabsContent>
                <TabsContent value="files">
                    <Files handleNext={handleNext} />
                </TabsContent>
                <TabsContent value="images">
                    <Images handleNext={handleNext} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Import({ onImportComplete }: { onImportComplete: () => void }) {
    const [importing, setImporting] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("Pages.Create.Import.importing")
    const [options, setOptions] = useState<any>()
    const [progress, setProgress] = useState<number>(0)
    const {token} = useToken()
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const [, setTempKey] = useSessionStorage<string>("temp_key", "", { serializer: (value) => value, deserializer: (value) => value })
    const t = useTranslations();
    const form = useForm({
        defaultValues: {
            link: "",
            type: "Maps"
        },
        onSubmit: async (values) => {
            await onMapImport(values.value.link, values.value.type)
        }
    })

    const handleStreamEvent = (json: any) => {
        switch(json.type) {
            case 'progress':
                setMessage(json.data.message)
                setOptions(json.data.options)
                setProgress(json.data.progress)
                break
            case 'error':
                toast.error(json.data)
                setImporting(false)
                break
            case 'complete': {
                const uploadedCreation = json.data.creation
                if (json.data.key) {
                    setTempKey(json.data.key)
                }
                setCreation({...creation, ...uploadedCreation})
                setImporting(false)
                onImportComplete()
                break
            }
        }
    }

    const onMapImport = async (link?: string, type?: string) => {
        if(link && type) {
            setImporting(true)
            setMessage('Pages.Create.Import.importing')
            let res = await importContent(link, type, token)
            if(typeof res === 'object' && 'error' in res) {
                toast.error(res.error)
                setImporting(false)
            } else {
                const decoder = new TextDecoder()
                let buffer = ""
                const stream = res.body
                if(stream) {
                    const reader = stream.getReader()
                    while(true) {
                        const {done, value} = await reader.read()
                        if(done) break
                        buffer += decoder.decode(value, { stream: true })
                        const { objects, rest } = extractJsonObjects(buffer)
                        buffer = rest
                        for (const json of objects) {
                            handleStreamEvent(json)
                        }
                    }
                    buffer += decoder.decode()
                    if (buffer.trim()) {
                        const { objects } = extractJsonObjects(buffer)
                        for (const json of objects) {
                            handleStreamEvent(json)
                        }
                    }
                } else {
                    toast.error(t('Pages.Create.Import.Importing.error'))
                    setImporting(false)
                }
            }

        } else {
            toast.error(t('Pages.Create.Import.missing_link'))
        }


    }

    return <>
        {importing && <div className={styles.importing}>
            <div className={styles.progress_container}>
                <p>{t(message, options)}</p>
                <progress className={styles.progress} value={progress} max={100} />
            </div>
        </div>}
        {!importing && <form onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }}  className="flex flex-col gap-4 max-w-2xl">
            <form.Field name="link" children={(field) => <div className="flex flex-col gap-2">
                <Label>{t('Pages.Create.Import.link_label')} <Required /></Label>
                <Input type="text" defaultValue={field.state.value} onChange={(e) => {
                    field.handleChange(e.target.value)
                }} placeholder={t('Pages.Create.Import.link_placeholder')} />
                <p className="text-sm text-muted-foreground">{t('Pages.Create.Import.link_description')}</p>
            </div>} />
            <form.Field name="type" children={(field) => <Select defaultValue={field.state.value} onValueChange={(value) => {
                field.handleChange(value)
            }}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Maps">{t('map', { count: 1 })}</SelectItem>
                    <SelectItem value="datapacks">{t('datapack', {count: 1})}</SelectItem>
                    <SelectItem value="resourcepacks">{t('resourcepack', {count: 1})}</SelectItem>
                </SelectContent>
            </Select>} />
            <Button type="submit" className="w-fit" disabled={importing}><span>{t('Pages.Create.next')}</span><ChevronRight/></Button>
        </form>}
    </>
}
