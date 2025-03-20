"use client"

import { convertToCollection, createEmptyCreation, updateContent } from "@/app/api/content"
import { useTags } from "@/app/api/hooks/creations"
import { useToken, useTokenOrKey } from "@/app/api/hooks/users"
import { ContentTypes, ExtraFeatureKeys, IContentDoc, ICreator, TagCategories, TagKeys } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import { FormInput } from "@/components/FormInputs"
import CreatorSelector from "@/components/FormInputs/CreatorSelector/CreatorSelector"
import RichTextInput from "@/components/FormInputs/RichText"
import Select from "@/components/FormInputs/Select"
import Text from '@/components/FormInputs/Text'
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { useSessionStorage } from "usehooks-ts"
import { Link, useRouter } from "@/app/api/navigation";

export default function CreateBasicInfo() {
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const contentType = creation.type
    const collectionName = convertToCollection(contentType)
    const {token} = useTokenOrKey()
    const { tags } = useTags(contentType)
    const t = useTranslations()
    const router = useRouter()

    let showLeaderboardsHelp = creation.extraFeatures?.leaderboards.use !== false

    const saveGeneralForm = (inputs: string[]) => {
        return new Promise<void>((resolve, reject) => {
            if(!creation || 'error' in creation) return;
        if(inputs[0].length < 2) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Content.Warnings.slug_too_short.description')))
            return;
        }

        let newCreation = {
            ...creation
        }

        if(inputs[0]) {
            newCreation.slug = encodeURI(inputs[0])
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.slug')))
        }

        if(FormInput.getFormInput("creators")?.getValue()) {
            newCreation.creators = FormInput.getFormInput<ICreator[]>("creators")?.submit()!
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.creator')))
        }

        if(inputs[1]) {
            newCreation.videoUrl = inputs[1]
        }

        if(FormInput.getFormInput("edit_general")?.getValue()) {
            newCreation.description = FormInput.getFormInput("edit_general")?.submit() + ""
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.description')))
        }

        if(inputs[2]) {
            newCreation.tags = inputs[2].concat("," + inputs[3]).concat("," + inputs[4]).concat("," + inputs[5]).concat("," + inputs[6]).split(',')
            newCreation.tags = newCreation.tags.filter((tag) => tag.length > 0)
            newCreation.tags = newCreation.tags?.filter((tag, index) => {
                return newCreation.tags?.indexOf(tag) === index
            })
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
        }

        if(inputs[7]) {
            if(inputs[7].includes("leaderboards")) {
                newCreation.extraFeatures = {
                        leaderboards: {
                            use: true,
                            message: inputs[8],
                            messageFormatting: inputs[9]
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

        updateContent(newCreation, token, collectionName).then((result) => {
            if(result.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error.toString()))
                return;
            }

            router.push('/create/files')

            setCreation(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.general_saved')))
            resolve()
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
            reject()
        })
        })
    }
    
    return <FormComponent id="general" onSave={saveGeneralForm} options={{saveButtonContent: t('Create.next')}}> 
                {/* <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={creation?.title} /> */}
                <Text type="text" name={t('Content.Edit.slug')}  description={t('Content.Edit.slug_description')} value={creation?.slug}/>
                <CreatorSelector value={creation.creators} />
                {/* <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={creation?.shortDescription} /> */}
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