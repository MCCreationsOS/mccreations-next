"use client"

import { createEmptyCreation, importContent } from "@/app/api/content"
import { useToken } from "@/app/api/hooks/users"
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

export default function Import() {
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
            setMessage(t('Create.Import.importing'))
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
                    toast.error(t('Create.Import.Importing.error'))
                    setImporting(false)
                }
            }

        } else {
            toast.error(t('Navigation.ImportForm.missing_link'))
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
            <form.Field name="link" children={(field) => <Input type="text" defaultValue={field.state.value} onChange={(e) => {
                field.handleChange(e.target.value)
            }} placeholder={t('Pages.Create.Import.link_placeholder')} />} />
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
            <Button type="submit"><span>{t('Pages.Create.next')}</span><ChevronRight/></Button>
        </form>}
        {// <FormComponent id={"importForm"}
        // onSave={(inputs) => {
        //     onMapImport(inputs[1], inputs[0])
        // }}  options={{saveButtonContent:t('Create.next')}}>

        //     <Select name={t('Navigation.ImportForm.type')} defaultValue="Maps" options={[{name: t('map', { count: 1 }), value: 'Maps'}, {name: t('datapack', {count: 1}), value: "datapacks"}, {name: t('resourcepack', {count: 1}), value: 'resourcepacks'}]} />
        //     <Text type="text" name={t('Navigation.ImportForm.link')} placeholder={t('Navigation.ImportForm.link_placeholder')} description={t('Create.Import.Link.description')} />
        // </FormComponent>
        }
    </>
}