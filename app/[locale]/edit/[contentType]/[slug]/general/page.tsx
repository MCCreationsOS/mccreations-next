'use client'

import { convertToCollection, updateContent } from "@/app/api/content"
import { useCreation, useTags } from "@/app/api/hooks/creations"
import { ContentTypes, ExtraFeatureKeys, ICreator, LeaderboardFeature, TagCategories, TagKeys } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import { FormInput } from "@/components/FormInputs"
import CreatorSelector from "@/components/FormInputs/CreatorSelector/CreatorSelector"
import RichTextInput from "@/components/FormInputs/RichText"
import Select from "@/components/FormInputs/Select"
import Text from "@/components/FormInputs/Text"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import Link from "next/link"
import { mutate } from "swr"

export default function General({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    const { creation, isLoading } = useCreation(params.slug, contentType)
    const { tags } = useTags(collectionName)
    const t = useTranslations()

    
    if((creation && 'error' in creation)) {
        return <div className="centered_content">
            <h1>Something went wrong!</h1>
            <p>{creation?.error}</p>
        </div>
    } else if(isLoading) {
        return <div className="centered_content">
            <h1>Loading...</h1>
        </div>
    }

    let showLeaderboardsHelp = creation.extraFeatures?.leaderboards.use !== false

    const saveGeneralForm = (inputs: string[]) => {
        return new Promise<void>((resolve, reject) => {
            if(!creation || 'error' in creation) return;
        if(inputs[1].length < 2) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Content.Warnings.slug_too_short.description')))
            return;
        }

        let newCreation = {
            ...creation
        }
        
        if(inputs[0]) {
            newCreation.title = inputs[0]
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.title')))
        }

        if(inputs[1]) {
            newCreation.slug = encodeURI(inputs[1])
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.slug')))
        }

        if(FormInput.getFormInput("creators")?.getValue()) {
            newCreation.creators = FormInput.getFormInput<ICreator[]>("creators")?.submit()!
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.creator')))
        }

        if(inputs[2]) {
            newCreation.shortDescription = inputs[2]
            if(inputs[2].length < 20) {
                // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('content.edit.general.error.short_description_length')))
            }
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.short_description')))
        }

        if(inputs[3]) {
            newCreation.videoUrl = inputs[3]
        }

        if(FormInput.getFormInput("edit_general")?.getValue()) {
            newCreation.description = FormInput.getFormInput("edit_general")?.submit() + ""
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.description')))
        }

        if(inputs[4]) {
            newCreation.tags = inputs[4].concat("," + inputs[5]).concat("," + inputs[6]).concat("," + inputs[7]).concat("," + inputs[8]).split(',')
            newCreation.tags = newCreation.tags.filter((tag) => tag.length > 0)
            newCreation.tags = newCreation.tags?.filter((tag, index) => {
                return newCreation.tags?.indexOf(tag) === index
            })
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
        }

        if(inputs[9]) {
            if(inputs[9].includes("leaderboards")) {
                newCreation.extraFeatures = {
                        leaderboards: {
                            use: true,
                            message: inputs[10],
                            messageFormatting: inputs[11]
                        },
                        translations: {
                            use: true
                        },
                        indexing: {
                            use: true
                        }
                    }
            } else {
                newCreation.extraFeatures = {
                    leaderboards: {
                        use: false,
                        message: "",
                        messageFormatting: ""
                    },
                    translations: {
                        use: true
                    },
                    indexing: {
                        use: true
                    }
                }
            }
        } else {
            newCreation.extraFeatures = {
                leaderboards: {
                    use: false,
                    message: "",
                    messageFormatting: ""
                },
                translations: {
                    use: true
                },
                indexing: {
                    use: true
                }
            }
        }

        updateContent(newCreation, localStorage?.getItem('jwt') + "", collectionName).then((result) => {
            if(result.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error.toString()))
                return;
            }

            if(newCreation.slug !== creation.slug) {
                window.location.href = `/edit/${newCreation.type}s/${newCreation.slug}`
            }

            mutate(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.general_saved')))
            resolve()
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
            reject()
        })
        })
    }
    
    return <FormComponent id="general" onSave={saveGeneralForm} options={{stickyButtons: true}}> 
                <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={creation?.title} />
                <Text type="text" name={t('Content.Edit.slug')}  description={t('Content.Edit.slug_description')} value={creation?.slug}/>
                <CreatorSelector value={creation.creators} />
                <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={creation?.shortDescription} />
                <Text type="text" name={t('Content.Edit.video_url')} description={t('Content.Edit.video_url_description')} value={creation?.videoUrl} />
                <RichTextInput id="edit_general" name={t('Content.Edit.description')} description={t('Content.Edit.description_description')} value={creation?.description} />
                {tags && 'genre' in tags && Object.keys(tags).map((category) => {
                    return <Select key={category} name={t(`Content.Tags.${category as TagCategories}`)} description={t(`Content.Edit.Tags.${category as TagCategories}_description`)} options={tags[category].map(tag => {
                        return {name: t(`Content.Tags.${tag as TagKeys}`), value: tag}
                    })} multiSelect={true} value={creation.tags?.filter(t => tags[category].includes(t)).join(',')}/>
                })}
                <Select name={t('Content.Edit.extra_features')} options={[{name: t("Content.Edit.ExtraFeatures.Leaderboards.title"), value: "leaderboards"}]} value={(creation.extraFeatures) ? Object.keys(creation.extraFeatures).filter(key => creation.extraFeatures![key as ExtraFeatureKeys].use !== false).join(",") : ""} multiSelect description={t.rich('Content.Edit.ExtraFeatures.Leaderboards.help', {link: (chunks) => <Link target="_blank" href="https://github.com/MCCreationsOS/Java-Leaderboards">{chunks}</Link>})}/>
                {showLeaderboardsHelp && <>
                    <p></p>
                </>}
            </FormComponent>
}