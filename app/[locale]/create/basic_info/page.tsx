"use client"

import { createEmptyCreation, createNewContent } from "@/app/api/content"
import { useToken } from "@/app/api/hooks/users"
import { ContentTypes, IContentDoc } from "@/app/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "@tanstack/react-form"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSessionStorage } from "usehooks-ts"

export default function CreateBasicInfo() {
    const {token} = useToken()
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const router = useRouter()
    const t = useTranslations()
    const form = useForm({
        defaultValues: {
            title: '',
            type: 'map',
            shortDescription: ''
        },
        onSubmit: (data) => {
            onMapCreate(data.value.title, data.value.type as ContentTypes, data.value.shortDescription)
        }
    })

    const onMapCreate = (title?: string, type?: ContentTypes, shortDescription?: string) => {
        if(!title) toast(t('Navigation.CreateForm.missing_title'))
        if(!type) toast(t('Navigation.CreateForm.missing_type'))
        if(!shortDescription) toast(t('Navigation.CreateForm.missing_short_description'))

        setCreation({...creation, title: title!, type: type!, shortDescription: shortDescription!, slug: creation.slug ?? encodeURIComponent(title!.toLowerCase().replace(/ /g, "-"))})
    
        createNewContent(title!, type!, shortDescription!, token).then((key) => {
            if(key && 'key' in key) {
                sessionStorage.setItem('temp_key', key.key)
            }
            setCreation({...creation, ...key.creation})
            console.log(key)
            if('error' in key) {
                toast(key.error)
            }
        })
        router.push("/create/details")
    }

    return <>
        <form onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
        }} className="flex flex-col gap-4 max-w-2xl">
            <form.Field name="title" children={(field) => (
                <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Title" />
            )} />
            <form.Field name="type" children={(field) => (
                <Select name={t('Navigation.CreateForm.type')} defaultValue="map" value={field.state.value} onValueChange={(value) => {field.handleChange(value)}}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('Navigation.CreateForm.type')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="map" className="hover:bg-white/40 cursor-pointer">{t('map', { count: 1 })}</SelectItem>
                        <SelectItem value="datapack" className="hover:bg-white/40 cursor-pointer">{t('datapack', { count: 1 })}</SelectItem>
                        <SelectItem value="resourcepack" className="hover:bg-white/40 cursor-pointer">{t('resourcepack', { count: 1 })}</SelectItem>
                    </SelectContent>
                </Select>
            )} />
            <form.Field name="shortDescription" children={(field) => (
                <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Short Description" />
            )} />
            <Button type="submit" className="w-fit"><span>{t('Create.next')}</span><ChevronRight/></Button>
        </form>
        {/* <FormComponent id={"createForm"} onSave={(inputs) => {
            onMapCreate(inputs[0], inputs[1] as ContentTypes, inputs[2])
        }} options={{saveButtonContent:t('Create.next')}}>
            <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={creation.title}/>
            <Select name={t('Navigation.CreateForm.type')} defaultValue="map" options={[{name: t('map', { count: 1 }), value: 'map'}, {name: t('datapack', {count: 1}), value: "datapack"}, {name: t('resourcepack', {count: 1}), value: 'resourcepack'}]} value={creation.type}/>
            <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={creation.shortDescription}/>
        </FormComponent> */}
    </>
}