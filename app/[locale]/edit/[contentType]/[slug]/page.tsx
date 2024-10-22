'use client'

import { getUser, useUserStore } from "@/app/api/auth"
import { convertToCollection, errorCheckContent, fetchDatapack, fetchMap, fetchResourcepack, fetchTags, requestApproval, updateContent, updateTranslation } from "@/app/api/content"
import { IContentDoc, Tags, UserTypes, Locales, Translation, TagKeys, TagCategories, ContentTypes, LeaderboardFeature, ICreator, ExtraFeatureKeys } from "@/app/api/types"
import MainButton from "@/components/Buttons/MainButton"
import ContentWarnings from "@/components/Content/ContentWarnings"
import FormComponent from "@/components/Form/Form"
import CreatorSelector from "@/components/FormInputs/CreatorSelector/CreatorSelector"
import { UploadedImageRepresentation } from "@/components/FormInputs/ImageDropzone/ImageDropzone"
import MediaGallery from "@/components/FormInputs/MediaGallery/MediaGallery"
import RichTextInput from "@/components/FormInputs/RichText"
import Select from "@/components/FormInputs/Select"
import Text from "@/components/FormInputs/Text"
import VersionManager from "@/components/FormInputs/VersionUploader/VersionManager"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import Tabs from "@/components/Tabs/Tabs"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { ArrowLeft } from "react-feather"

import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { Popup } from "@/components/Popup/Popup"
import WarningButton from "@/components/Buttons/WarningButton"
import Checkbox from "@/components/FormInputs/Checkbox"
import styles from './edit.module.css'
import { useTranslations } from "next-intl"
import { Link } from "@/app/api/navigation"
import { FormInput } from "@/components/FormInputs"
import { useCreation, useTags } from "@/app/api/hooks/creations"
import { mutate } from "swr"

export default function EditContentPage({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    const user = useUserStore()
    const { creation, isLoading, error } = useCreation(params.slug, contentType)
    const {tags, isLoading: tagsLoading, error: tagsError} = useTags(collectionName)
    const t = useTranslations();

    if(creation && 'error' in creation) {
        return (
            <div className="centered_content">
                <h1>Something went wrong!</h1>
                <p>{creation?.error}</p>
            </div>
        )
    } else if(isLoading) {
        return (
            <div className="centered_content">
            <h1>Loading...</h1>
            </div>
        )
    }
    

    if(creation && '_id' in creation) {
        let allowedToEdit = false;
        if(creation.creators) {
            creation.creators.forEach((creator) => {
                if(creator.handle === user.handle && user.handle.length > 0) {
                    allowedToEdit = true;
                }
            })
        } else if (sessionStorage.getItem('temp_key')) {
            allowedToEdit = true;
        }

        if(user.type === UserTypes.Admin) {
            allowedToEdit = true;
        }

        if(creation.owner && creation.owner.length > 0 && creation.owner === user.handle) {
            allowedToEdit = true;
        }

        if(!allowedToEdit) {
            window.location.href = `/${contentType}s/${creation.slug}`
        }
    }

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

        updateContent(newCreation, localStorage.getItem('jwt') + "", collectionName).then((result) => {
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

    const saveImagesForm = (files: UploadedImageRepresentation[]) => {
        if(!creation || 'error' in creation) return;

        let newCreation = {
            ...creation
        }
        newCreation.images = files.map(f => f.url)
        updateContent(newCreation, localStorage.getItem('jwt') + "", collectionName).then(() => {
            mutate(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.images_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    const saveVersionsForm = (versions: string) => {
        if(!creation || 'error' in creation) return;

        let newCreation = {
            ...creation
        }
        newCreation.files = JSON.parse(versions)
        
        newCreation.files.sort((a, b) => {
            return b.createdDate - a.createdDate
        })

        updateContent(newCreation, localStorage.getItem('jwt') + "", collectionName).then(() => {
            mutate(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.versions_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    const publishContent = async () => {
        console.log(creation)
        if(!creation || 'error' in creation) return;

        let errors = errorCheckContent(creation)
        if(errors.length > 0) {
            errors.forEach((error) => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t(error.error)))
            })
        } else {
            requestApproval(creation.slug, collectionName, localStorage.getItem('jwt') + "").then(() => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.requested_approval')))
                mutate({...creation, status: 1})
            })
        }
    }
    
    if(creation && '_id' in creation) {
        return (
            <div className="centered_content">
                <ContentWarnings map={creation} />
                <h1>{t('Content.Edit.editing', {title: creation?.title})}</h1>
                <p>{t('Content.Edit.status')} {(creation?.status === 0) ? <span style={{color: "#c73030"}}>{t('Status.draft')}</span> : (creation?.status === 1) ? <span style={{color: "#f0b432"}}>{t('Status.unapproved')}</span> : (creation?.status === 2) ? <span style={{color: "#10b771"}}>{t('Status.approved')}</span>: <span style={{color:"#3154f4"}}>{t('Status.featured')}</span>}</p>
                {creation?.status === 0 && (<MainButton onClick={publishContent}>{t('Content.Edit.request_approval')}</MainButton>)}
                <Tabs preselectedTab={1} onChangeTabs={(to, from) => {
                    if(from === 1) {
                        let inputs: string[] = []
                        document.querySelector('#general')?.querySelectorAll('input').forEach((input) => {
                            if(input.getAttribute('name') === 'file') return;
                            inputs.push(input.value)
                        })
                        saveGeneralForm(inputs)
                    }
                }} tabs={[
                {
                    title: <ArrowLeft />,
                    content: <></>,
                    link: `/${creation.type}s/${creation.slug}`
                },
                {
                    
                    // General Tab
                    title: t('Content.Edit.general'),
                    content: <FormComponent id="general" onSave={saveGeneralForm} options={{stickyButtons: true}}> 
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
                            <Select name={t('Content.Edit.extra_features')} options={[{name: t("Content.Edit.ExtraFeatures.Leaderboards.title"), value: "leaderboards"}]} value={(creation.extraFeatures) ? Object.keys(creation.extraFeatures).filter(key => creation.extraFeatures![key as ExtraFeatureKeys].use !== false).join(",") : ""} multiSelect/>
                            {((creation.extraFeatures?.leaderboards as LeaderboardFeature)?.use !== false && (creation.files && !creation.files[0].url?.includes("mccreations.s3"))) && <>
                                <p>{t.rich('Content.Edit.ExtraFeatures.Leaderboards.help', {link: (chunks) => <Link target="_blank" href="https://github.com/MCCreationsOS/Java-Leaderboards">{chunks}</Link>})}</p>
                            </>}
                        </FormComponent>
                    },{

                    // Images Tbat
                    title: t('Content.Edit.images'),
                    content: <MediaGallery onImagesUploaded={saveImagesForm} presetFiles={JSON.stringify(creation?.images?.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: t('Content.Edit.versions'),
                    content: <VersionManager collectionName={collectionName} presetVersions={JSON.stringify(creation?.files)} onVersionsChanged={saveVersionsForm} />
                    },
                    {
                        title: t('Content.Edit.translations'),
                        content: <>
                            <SecondaryButton onClick={() => {
                                Popup.createPopup({title: t('Content.Edit.add_translation'), content: <FormComponent id="add_translation" onSave={(inputs) => {
                                    let newCreation = {
                                        ...creation
                                    }
                                    if(!newCreation.translations) {
                                        newCreation.translations = {}
                                    }
                                    newCreation.translations[inputs[0]] = {
                                        title: "",
                                        shortDescription: "",
                                        description: "",
                                        approved: false
                                    }
                                    mutate(newCreation)
                                    Popup.close();
                                }}>
                                    <Select name={t('Content.Edit.translation_languages')} options={Locales.map(lang => {return {name: lang, value: lang}})} description={<Link href="/translate">{t('Content.Edit.translation_languages_description')}</Link>}/>
                                </FormComponent>})
                            }}>{t('Content.Edit.add_translation')}</SecondaryButton>
                            <div className={styles.translations}>
                            {creation.translations && Object.keys(creation.translations).map((lang) => {
                                return <div className={styles.translation}><FormComponent id={lang} onSave={(inputs) => {
                                    let translation: Translation = {
                                    }
                                    translation[lang] = {
                                        title: inputs[0],
                                        shortDescription: inputs[1],
                                        description: FormInput.getFormInput(`edit_translation_${lang}`)?.submit() + "",
                                        approved: (inputs[3] === "true") ? true : false
                                    }
                                    updateTranslation(creation.slug, collectionName, translation, localStorage.getItem('jwt')).then((d) => {
                                        if('error' in d) {
                                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, d.error))
                                        } else {
                                            let newCreation = {
                                                ...creation
                                            }
                                            if(!newCreation.translations) {
                                                newCreation.translations = {}
                                            }
                                            newCreation.translations[lang] = translation[lang]
                                            mutate(newCreation)
                                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.translation_saved')))
                                        }
                                    })
                                }} options={{extraButtons: (<WarningButton onClick={() => {
                                    let newCreation = {
                                        ...creation
                                    }
                                    delete newCreation.translations![lang]
                                    mutate(newCreation)
                                }}>{t('Content.Edit.delete_translation')}</WarningButton>)}}>
                                    <h2>{lang}</h2>
                                    <Text name={t('Content.Edit.title')} value={creation.translations![lang].title}/>
                                    <Text name={t('Content.Edit.short_description')} value={creation.translations![lang].shortDescription}/>
                                    <RichTextInput id={`edit_translation_${lang}`} name={t('Content.Edit.description')} value={creation.translations![lang].description}/>
                                    <Checkbox name={t('Content.Edit.translation_approved')} value={`${creation.translations![lang].approved}`}/>
                                </FormComponent></div>
                            })}
                            </div>
                        </>
                    }]} />
            </div>
        )
    }
}