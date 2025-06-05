"use client"

import { convertToCollection, createEmptyCreation, updateContent } from "@/app/api/content"
import { useTags } from "@/app/api/hooks/creations"
import { useToken, useTokenOrKey } from "@/app/api/hooks/users"
import { ContentTypes, ExtraFeatureKeys, IContentDoc, ICreator, TagCategories, TagKeys, Tags } from "@/app/api/types"
import { useTranslations } from "next-intl"
import { useSessionStorage } from "usehooks-ts"
import { Link, useRouter } from "@/app/api/navigation";
import { toast } from "sonner"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import RichText from "@/components/RichText/RichText"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupCheckItem, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function CreateBasicInfo() {
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const contentType = creation.type
    const collectionName = convertToCollection(contentType)
    const {token} = useTokenOrKey()
    const { tags } = useTags(contentType)
    const t = useTranslations()
    const router = useRouter()
    const form = useForm({
        defaultValues: {
            slug: creation.slug,
            creators: creation.creators,
            videoUrl: creation.videoUrl,
            description: creation.description,
            tags: creation.tags?.join(',')
        },
        onSubmit: (data) => {
            saveGeneralForm(data.value.slug, data.value.creators, data.value.description, data.value.tags, data.value.videoUrl)
        }
    })

    let showLeaderboardsHelp = creation.extraFeatures?.leaderboards.use !== false

    const saveGeneralForm = (slug: string, creators: ICreator[], description: string, tags: string, videoUrl?: string) => {
        return new Promise<void>((resolve, reject) => {
            if(!creation || 'error' in creation) return;
        if(slug.length < 2) {
            toast.error(t('Content.Warnings.slug_too_short.description'))
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Content.Warnings.slug_too_short.description')))
            return;
        }

        let newCreation = {
            ...creation
        }

        if(slug) {
            newCreation.slug = encodeURI(slug)
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.slug')))
        }

        if(creators) {
            newCreation.creators = creators
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.creator')))
        }

        if(videoUrl) {
            newCreation.videoUrl = videoUrl
        }

        if(description) {
            newCreation.description = description + ""
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.description')))
        }

        if(tags) {
            newCreation.tags = tags.split(',')
            newCreation.tags = newCreation.tags.filter((tag) => tag.length > 0)
            newCreation.tags = newCreation.tags?.filter((tag, index) => {
                return newCreation.tags?.indexOf(tag) === index
            })
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
        }

        // if(inputs[7]) {
        //     if(inputs[7].includes("leaderboards")) {
        //         newCreation.extraFeatures = {
        //                 leaderboards: {
        //                     use: true,
        //                     message: inputs[8],
        //                     messageFormatting: inputs[9]
        //                 },
        //                 translations: {
        //                     use: true
        //                 },
        //                 indexing: {
        //                     use: true
        //                 }
        //             }
        //     } else {
        //         newCreation.extraFeatures = {
        //             leaderboards: {
        //                 use: false,
        //                 message: "",
        //                 messageFormatting: ""
        //             },
        //             translations: {
        //                 use: true
        //             },
        //             indexing: {
        //                 use: true
        //             }
        //         }
        //     }
        // } else {
        //     newCreation.extraFeatures = {
        //         leaderboards: {
        //             use: false,
        //             message: "",
        //             messageFormatting: ""
        //         },
        //         translations: {
        //             use: true
        //         },
        //         indexing: {
        //             use: true
        //         }
        //     }
        // }

        updateContent(newCreation, token, collectionName).then((result) => {
            if(result.error) {
                // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error.toString()))
                return;
            }

            router.push('/create/files')

            setCreation(newCreation)
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.general_saved')))
            resolve()
        }).catch((e) => {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
            reject()
        })
        })
    }
    return <form onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
    }} className="flex flex-col gap-4 max-w-2xl">
        <form.Field name="slug" children={(field) => (
            <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Slug" />
        )} />
        {/* <form.Field name="creators" children={(field) => (
            // <CreatorSelector value={field.state.value} />
        )} /> */}
        <form.Field name="videoUrl" children={(field) => (
            <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(e) => {field.handleChange(e.target.value)}} placeholder="Video URL" />
        )} />
        <form.Field name="description" children={(field) => (
            <RichText sendOnChange={(v) => {field.handleChange(v)}} initialValue={field.state.value} />
        )} />
        <form.Field name="tags" children={(field) => (
            <TagInput tags={tags} creation={creation} onChange={field.handleChange} />
        )} />
        <Button type="submit" className="w-fit"><span>{t('Create.next')}</span><ChevronRight/></Button>
    </form>
    // return <FormComponent id="general" onSave={saveGeneralForm} options={{saveButtonContent: t('Create.next')}}> 
    //             {/* <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={creation?.title} /> */}
    //             <Text type="text" name={t('Content.Edit.slug')}  description={t('Content.Edit.slug_description')} value={creation?.slug}/>
    //             <CreatorSelector value={creation.creators} />
    //             {/* <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={creation?.shortDescription} /> */}
    //             <Text type="text" name={t('Content.Edit.video_url')} description={t('Content.Edit.video_url_description')} value={creation?.videoUrl} />
    //             <RichTextInput id="edit_general" name={t('Content.Edit.description')} description={t('Content.Edit.description_description')} value={creation?.description} />
    //             {tags && 'genre' in tags && Object.keys(tags).map((category) => {
    //                 return <Select key={category} name={t(`Creation.Tags.${category as TagCategories}`)} description={t(`Content.Edit.Tags.${category as TagCategories}_description`)} options={tags[category].map(tag => {
    //                     return {name: t(`Creation.Tags.${tag as TagKeys}`), value: tag}
    //                 })} multiSelect={true} value={creation.tags?.filter(t => tags[category].includes(t)).join(',')}/>
    //             })}
    //             <Select name={t('Content.Edit.extra_features')} options={[{name: t("Content.Edit.ExtraFeatures.Leaderboards.title"), value: "leaderboards"}]} value={(creation.extraFeatures) ? Object.keys(creation.extraFeatures).filter(key => creation.extraFeatures![key as ExtraFeatureKeys].use !== false).join(",") : ""} multiSelect description={t.rich('Content.Edit.ExtraFeatures.Leaderboards.help', {link: (chunks) => <Link target="_blank" href="https://github.com/MCCreationsOS/Java-Leaderboards">{chunks}</Link>})}/>
    //             {showLeaderboardsHelp && <>
    //                 <p></p>
    //             </>}
    //         </FormComponent>
}

function TagInput({tags, creation, onChange}: {tags: Tags | {error: string}, creation: IContentDoc, onChange: (tags: string) => void}) {
    const [tagInput, setTagInput] = useState(creation.tags?.join(',') ?? '')
    const [search, setSearch] = useState('')
    const [bestSuggestion, setBestSuggestion] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const t = useTranslations()

    const addTag = (tag: string) => {
        if(tagInput.split(',').includes(tag)) return;
        if(tag.length < 2) return;
        setTagInput(tagInput + ',' + tag)
        setSearch('')
        onChange(tagInput)
    }

    const removeTag = (tag: string) => {
        setTagInput(tagInput.replace(',' + tag, ''))
        onChange(tagInput)
    }

    return <Popover onOpenChange={setShowSuggestions} open={showSuggestions}>
            <PopoverTrigger asChild>
                <div className="flex flex-row gap-2 px-2 py-1 border">
                    <Label className="text-md font-medium">{tagInput.split(',').map(tag => {
                        if(tag.length === 0) return null;
                        return <Button type="button" variant="ghost" key={tag} className="text-sm border py-0 px-2" onClick={() => {removeTag(tag)}}>{t(`Creation.Tags.${tag as TagKeys}`)}</Button>
                    })}</Label>
                    <Input className="border-none" type="text" value={search} onChange={(e) => {setSearch(e.target.value); setShowSuggestions(true)}} onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            addTag(bestSuggestion)
                        }
                    }} placeholder="Start typing to search for tags..." />
                </div>
            </PopoverTrigger>
            <PopoverContent onOpenAutoFocus={(e) => {e.preventDefault()}} className="max-h-[25vh] overflow-y-auto">
                <div className="flex flex-col gap-2">
                    <TagSearch tags={tags} search={search} onSelect={addTag} onBestSuggestionChanged={setBestSuggestion} />
                </div>
            </PopoverContent>
        </Popover>
}

function TagSearch({tags, search, onBestSuggestionChanged, onSelect}: {tags: Tags | {error: string}, search: string, onBestSuggestionChanged: (tag: string) => void, onSelect: (tag: string) => void}) {
    const t = useTranslations()
    const fTags: string[] = []
    if(tags && 'genre' in tags) {
        Object.keys(tags).forEach(category => {
            tags[category].forEach(tag => {
                fTags.push(tag)
            })
        })
    }
    return <div className="flex flex-wrap gap-2 border-2 border-white/15 p-1">
            {fTags.filter(tag => tag.toLowerCase().includes(search.toLowerCase())).map((tag, index) => {
                    if(index === 0) {
                        onBestSuggestionChanged(tag)
                    }
                    return <Button type="button" variant="ghost" key={tag} className="text-sm border py-0 px-2" onClick={() => {onSelect(tag)}}>{t(`Creation.Tags.${tag as TagKeys}`)}</Button>
                })
            }
        </div>
}