"use client"

import { convertToCollection, createEmptyCreation, importContent, requestApproval } from "@/app/api/content"
import { useToken, useTokenOrKey } from "@/app/api/hooks/users"
import { IContentDoc } from "@/app/api/types"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
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

export default function ImportPage() {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const [activeTab, setActiveTab] = useState("import");
    const { token } = useTokenOrKey();

    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const router = useRouter();
    const t = useTranslations();

    const handleTabChange = (tab: string) => {
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

    const onFinish = () => {
        if (!creation || "error" in creation) return;
        requestApproval(creation.slug, collectionName, token)
            .then(() => {
                setCreation(createEmptyCreation());
                router.push(`/dashboard`);
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <div className="w-1/2 mx-auto mt-5 p-5">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                    <TabsTrigger value="import" className="w-1/4">{t('Pages.Create.Import.title')}</TabsTrigger>
                    <TabsTrigger value="details" className="w-1/4">{t('Pages.Create.Import.details')}</TabsTrigger>
                    <TabsTrigger value="files" className="w-1/4">{t('Pages.Create.Import.files')}</TabsTrigger>
                    <TabsTrigger value="images" className="w-1/4">{t('Pages.Create.Import.images')}</TabsTrigger>
                </TabsList>
                <TabsContent value="import">
                    <Import />
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

function Import() {
    const [importing, setImporting] = useState<boolean>(false)
    const [message, setMessage] = useState<string | null>("Importing...")
    const [options, setOptions] = useState<any>()
    const [progress, setProgress] = useState<number>(0)
    const {token} = useToken()
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const router = useRouter()
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


    const onMapImport = async (link?: string, type?: string) => {
        if(link && type) {
            setImporting(true)
            setMessage(t('Pages.Create.Import.importing'))
            let res = await importContent(link, type, token)
            if(typeof res === 'object' && 'error' in res) {
                toast.error(res.error)
                setImporting(false)
            } else {
                const decoder = new TextDecoder()
                const processChunk = (value: Uint8Array) => {
                    const text = decoder.decode(value)
                    try {
                        // Try parsing as JSON first
                        const json = JSON.parse(text)
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
                            case 'complete':
                                const uploadedCreation = json.data.creation
                                setCreation({...creation, ...uploadedCreation})
                                router.push(`/create/basic_info`)
                                break
                        }
                    } catch {
                    }

                }
                const stream = res.body
                if(stream) {
                    const reader = stream.getReader()
                    while(true) {
                        const {done, value} = await reader.read()
                        if(done) break
                        processChunk(value)
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