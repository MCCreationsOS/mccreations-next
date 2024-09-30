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
import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "react-feather"

import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { Popup } from "@/components/Popup/Popup"
import WarningButton from "@/components/Buttons/WarningButton"
import Checkbox from "@/components/FormInputs/Checkbox"
import styles from './edit.module.css'
import { useTranslations } from "next-intl"
import { Link } from "@/app/api/navigation"
import { FormInput } from "@/components/FormInputs"

export default function EditContentPage({params}: {params: Params}) {
    const user = useUserStore()
    const [map, setMap] = useState<IContentDoc | {error: string}>()
    const [tags, setTags] = useState<Tags>()
    const token = useRef("")
    const t = useTranslations();
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    

    useEffect(() => {
        token.current = localStorage?.getItem('jwt') + ""
        const getData = async () => {
            
            fetchTags(collectionName).then((data) => {
                if('genre' in data) {
                    setTags(data)
                }
            })
            if(token && token.current.length > 0) {
                
                let u = await getUser(token.current)

                if(!u) {
                    token.current = sessionStorage.getItem('temp_key') + ""
                    console.log(token.current)
                    switch(contentType) {
                        case ContentTypes.Maps:
                            setMap(await fetchMap(params.slug, token.current));
                            break;
                        case ContentTypes.Datapacks:
                            setMap(await fetchDatapack(params.slug, token.current));
                            break;
                        case ContentTypes.Resourcepacks:
                            setMap(await fetchResourcepack(params.slug, token.current));
                            break;
                        default:
                            setMap(await fetchMap(params.slug, token.current));
                    
                    }
                }

                switch(contentType) {
                    case ContentTypes.Maps:
                        setMap(await fetchMap(params.slug, token.current));
                        break;
                    case ContentTypes.Datapacks:
                        setMap(await fetchDatapack(params.slug, token.current));
                        break;
                    case ContentTypes.Resourcepacks:
                        setMap(await fetchResourcepack(params.slug, token.current));
                        break;
                    default:
                        setMap(await fetchMap(params.slug, token.current));
                        break;
                }
            } else {
                
                token.current = sessionStorage.getItem('temp_key') + ""
                console.log(token.current)
                switch(contentType) {
                    case ContentTypes.Maps:
                        setMap(await fetchMap(params.slug, token.current));
                        break;
                    case ContentTypes.Datapacks:
                        setMap(await fetchDatapack(params.slug, token.current));
                        break;
                    case ContentTypes.Resourcepacks:
                        setMap(await fetchResourcepack(params.slug, token.current));
                        break;
                    default:
                        setMap(await fetchMap(params.slug, token.current));
                        break;
                }
            }
        }
        getData();
    }, [])

    useEffect(() => {
        if(map && '_id' in map) {
            let allowedToEdit = false;
            if(map.creators) {
                map.creators.forEach((creator) => {
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

            if(map.owner && map.owner.length > 0 && map.owner === user.handle) {
                allowedToEdit = true;
            }

            if(!allowedToEdit) {
                window.location.href = `/${map.type}s/${map.slug}`
            }
        }
    }, [map])

    const saveGeneralForm = (inputs: string[]) => {
        return new Promise<void>((resolve, reject) => {
            if(!map || 'error' in map) return;
        if(inputs[1].length < 2) {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Content.Warnings.slug_too_short.description')))
            return;
        }

        let newMap = {
            ...map
        }
        
        if(inputs[0]) {
            newMap.title = inputs[0]
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.title')))
        }

        if(inputs[1]) {
            newMap.slug = encodeURI(inputs[1])
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.slug')))
        }

        if(FormInput.getFormInput("creators")?.getValue()) {
            newMap.creators = FormInput.getFormInput<ICreator[]>("creators")?.submit()!
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.creator')))
        }

        if(inputs[2]) {
            newMap.shortDescription = inputs[2]
            if(inputs[2].length < 20) {
                // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('content.edit.general.error.short_description_length')))
            }
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.short_description')))
        }

        if(inputs[3]) {
            newMap.videoUrl = inputs[3]
        }

        if(FormInput.getFormInput("edit_general")?.getValue()) {
            newMap.description = FormInput.getFormInput("edit_general")?.submit() + ""
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.description')))
        }

        if(inputs[4]) {
            newMap.tags = inputs[4].concat("," + inputs[5]).concat("," + inputs[6]).concat("," + inputs[7]).concat("," + inputs[8]).split(',')
            newMap.tags = newMap.tags.filter((tag) => tag.length > 0)
            newMap.tags = newMap.tags.filter((tag, index) => {
                return newMap.tags.indexOf(tag) === index
            })
        } else {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
        }

        if(inputs[9]) {
            if(inputs[9].includes("leaderboards")) {
                newMap.extraFeatures = {
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
                newMap.extraFeatures = {
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
            newMap.extraFeatures = {
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

        updateContent(newMap, token.current, collectionName).then((result) => {
            if(result.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error.toString()))
                return;
            }

            if(newMap.slug !== map.slug) {
                window.location.href = `/edit/${newMap.type}s/${newMap.slug}`
            }

            setMap(newMap)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.general_saved')))
            resolve()
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
            reject()
        })
        })
    }

    const saveImagesForm = (files: UploadedImageRepresentation[]) => {
        if(!map || 'error' in map) return;

        let newMap = {
            ...map
        }
        newMap.images = files.map(f => f.url)
        updateContent(newMap, token.current, collectionName).then(() => {
            setMap(newMap)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.images_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    const saveVersionsForm = (versions: string) => {
        if(!map || 'error' in map) return;

        let newMap = {
            ...map
        }
        newMap.files = JSON.parse(versions)
        
        newMap.files.sort((a, b) => {
            return b.createdDate - a.createdDate
        })

        updateContent(newMap, token.current, collectionName).then(() => {
            setMap(newMap)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.versions_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    const publishContent = async () => {
        if(!map || 'error' in map) return;

        let errors = errorCheckContent(map)
        if(errors.length > 0) {
            errors.forEach((error) => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t(error.error)))
            })
        } else {
            requestApproval(map.slug, collectionName, token.current).then(() => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.requested_approval')))
                setMap({...map, status: 1})
            })
        }
    }
    
    if(map && '_id' in map) {
        return (
            <div className="centered_content">
                <ContentWarnings map={map} />
                <h1>{t('Content.Edit.editing', {title: map?.title})}</h1>
                <p>{t('Content.Edit.status')} {(map?.status === 0) ? <span style={{color: "#c73030"}}>{t('Status.draft')}</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>{t('Status.unapproved')}</span> : (map?.status === 2) ? <span style={{color: "#10b771"}}>{t('Status.approved')}</span>: <span style={{color:"#3154f4"}}>{t('Status.featured')}</span>}</p>
                {map?.status === 0 && (<MainButton onClick={publishContent}>{t('Content.Edit.request_approval')}</MainButton>)}
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
                    link: `/${map.type}s/${map.slug}`
                },
                {
                    
                    // General Tab
                    title: t('Content.Edit.general'),
                    content: <FormComponent id="general" onSave={saveGeneralForm} options={{stickyButtons: true}}> 
                            <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} value={map?.title} />
                            <Text type="text" name={t('Content.Edit.slug')}  description={t('Content.Edit.slug_description')} value={map?.slug}/>
                            <CreatorSelector value={map.creators} />
                            <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')} value={map?.shortDescription} />
                            <Text type="text" name={t('Content.Edit.video_url')} description={t('Content.Edit.video_url_description')} value={map?.videoUrl} />
                            <RichTextInput id="edit_general" name={t('Content.Edit.description')} description={t('Content.Edit.description_description')} value={map?.description} />
                            {tags && Object.keys(tags).map((category, idx) => {
                                return <Select key={idx} name={t(`Content.Tags.${category as TagCategories}`)} description={t(`Content.Edit.Tags.${category as TagCategories}_description`)} options={tags[category].map(tag => {
                                    return {name: t(`Content.Tags.${tag as TagKeys}`), value: tag}
                                })} multiSelect={true} value={map.tags?.filter(t => tags[category].includes(t)).join(',')}/>
                            })}
                            <Select name={t('Content.Edit.extra_features')} options={[{name: t("Content.Edit.ExtraFeatures.Leaderboards.title"), value: "leaderboards"}]} value={(map.extraFeatures) ? Object.keys(map.extraFeatures).filter(key => map.extraFeatures![key as ExtraFeatureKeys].use !== false).join(",") : ""} multiSelect/>
                            {((map.extraFeatures?.leaderboards as LeaderboardFeature)?.use !== false && (!map.files || map.files[0].url?.includes("mccreations.s3"))) && <>
                                <p>{t.rich('Content.Edit.ExtraFeatures.Leaderboards.help', {link: (chunks) => <Link target="_blank" href="https://github.com/MCCreationsOS/Java-Leaderboards">{chunks}</Link>})}</p>
                                <Text name={t('Content.Edit.ExtraFeatures.Leaderboards.message_text')} value={(map.extraFeatures && map.extraFeatures.leaderboards) ? (map.extraFeatures?.leaderboards as LeaderboardFeature).message : ""} description={t('Content.Edit.ExtraFeatures.Leaderboards.message_text_description')}/>
                                <Text name={t('Content.Edit.ExtraFeatures.Leaderboards.message_format')} value={(map.extraFeatures && map.extraFeatures.leaderboards) ? (map.extraFeatures?.leaderboards as LeaderboardFeature).messageFormatting : ""} description={t('Content.Edit.ExtraFeatures.Leaderboards.message_format_description')}/>
                            </>}
                            {((map.extraFeatures?.leaderboards as LeaderboardFeature)?.use !== false && (map.files && !map.files[0].url?.includes("mccreations.s3"))) && <>
                                <p>{t.rich('Content.Edit.ExtraFeatures.Leaderboards.help', {link: (chunks) => <Link target="_blank" href="https://github.com/MCCreationsOS/Java-Leaderboards">{chunks}</Link>})}</p>
                            </>}
                        </FormComponent>
                    },{

                    // Images Tbat
                    title: t('Content.Edit.images'),
                    content: <MediaGallery onImagesUploaded={saveImagesForm} presetFiles={JSON.stringify(map?.images?.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: t('Content.Edit.versions'),
                    content: <VersionManager collectionName={collectionName} presetVersions={JSON.stringify(map?.files)} onVersionsChanged={saveVersionsForm} />
                    },
                    {
                        title: t('Content.Edit.translations'),
                        content: <>
                            <SecondaryButton onClick={() => {
                                Popup.createPopup({title: t('Content.Edit.add_translation'), content: <FormComponent id="add_translation" onSave={(inputs) => {
                                    let newMap = {
                                        ...map
                                    }
                                    if(!newMap.translations) {
                                        newMap.translations = {}
                                    }
                                    newMap.translations[inputs[0]] = {
                                        title: "",
                                        shortDescription: "",
                                        description: "",
                                        approved: false
                                    }
                                    setMap(newMap)
                                    Popup.close();
                                }}>
                                    <Select name={t('Content.Edit.translation_languages')} options={Locales.map(lang => {return {name: lang, value: lang}})} description={<Link href="/translate">{t('Content.Edit.translation_languages_description')}</Link>}/>
                                </FormComponent>})
                            }}>{t('Content.Edit.add_translation')}</SecondaryButton>
                            <div className={styles.translations}>
                            {map.translations && Object.keys(map.translations).map((lang) => {
                                return <div className={styles.translation}><FormComponent id={lang} onSave={(inputs) => {
                                    let translation: Translation = {
                                    }
                                    translation[lang] = {
                                        title: inputs[0],
                                        shortDescription: inputs[1],
                                        description: FormInput.getFormInput(`edit_translation_${lang}`)?.submit() + "",
                                        approved: (inputs[3] === "true") ? true : false
                                    }
                                    updateTranslation(map.slug, collectionName, translation, localStorage.getItem('jwt')).then((d) => {
                                        if('error' in d) {
                                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, d.error))
                                        } else {
                                            let newMap = {
                                                ...map
                                            }
                                            if(!newMap.translations) {
                                                newMap.translations = {}
                                            }
                                            newMap.translations[lang] = translation[lang]
                                            setMap(newMap)
                                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.translation_saved')))
                                        }
                                    })
                                }} options={{extraButtons: (<WarningButton onClick={() => {
                                    let newMap = {
                                        ...map
                                    }
                                    delete newMap.translations![lang]
                                    setMap(newMap)
                                }}>{t('Content.Edit.delete_translation')}</WarningButton>)}}>
                                    <h2>{lang}</h2>
                                    <Text name={t('Content.Edit.title')} value={map.translations![lang].title}/>
                                    <Text name={t('Content.Edit.short_description')} value={map.translations![lang].shortDescription}/>
                                    <RichTextInput id={`edit_translation_${lang}`} name={t('Content.Edit.description')} value={map.translations![lang].description}/>
                                    <Checkbox name={t('Content.Edit.translation_approved')} value={`${map.translations![lang].approved}`}/>
                                </FormComponent></div>
                            })}
                            </div>
                        </>
                    }]} />
            </div>
        )
    }
    if(map && 'error' in map) {
        return (
            <div className="centered_content">
                <h1>Something went wrong!</h1>
                <p>{map?.error}</p>
            </div>
        )
    }
    return (
        <div className="centered_content">
            <h1>Loading...</h1>
        </div>
    )
}