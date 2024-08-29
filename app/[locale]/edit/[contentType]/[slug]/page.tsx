'use client'

import { getUser } from "@/app/api/auth"
import { convertToCollection, fetchDatapack, fetchMap, fetchResourcepack, fetchTags, requestApproval, updateContent, updateTranslation } from "@/app/api/content"
import { FilePreview, IFile, IContentDoc, IUser, MinecraftVersion, Tags, CollectionNames, UserTypes, Locales, Translation, TagKeys, TagCategories, ContentTypes } from "@/app/api/types"
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
import { useI18n } from "@/locales/client"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft } from "react-feather"
import Link from "next/link";
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { Popup } from "@/components/Popup/Popup"
import WarningButton from "@/components/Buttons/WarningButton"
import Checkbox from "@/components/FormInputs/Checkbox"

export default function EditContentPage({params}: {params: Params}) {
    const [user, setUser] = useState<IUser>()
    const [map, setMap] = useState<IContentDoc | {error: string}>()
    const [tags, setTags] = useState<Tags>()
    const token = useRef("")
    const t = useI18n();
    const contentType = params.contentType as ContentTypes
    const collectionName = convertToCollection(contentType)
    

    useEffect(() => {
        token.current = sessionStorage?.getItem('jwt') + ""
        const getData = async () => {
            
            fetchTags(collectionName).then((data) => {
                if('genre' in data) {
                    setTags(data)
                }
            })
            if(token && token.current.length > 0) {
                
                let u = await getUser(undefined, token.current)
                setUser(u);

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
    
    if(map && '_id' in map) {
        return (
            <div className="centered_content">
                <ContentWarnings map={map} />
                <h1>{t('content.edit.editing')} {map?.title}</h1>
                <p>{t('content.edit.status')} {(map?.status === 0) ? <span style={{color: "#c73030"}}>{t('status.Draft')}</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>{t('content.edit.status.Unapproved')}</span> : (map?.status === 2) ? <span style={{color: "#10b771"}}>{t('status.Approved')}</span>: <span style={{color:"#3154f4"}}>{t('status.Featured')}</span>}</p>
                {map?.status === 0 && (<MainButton onClick={() => {requestApproval(map.slug, token.current).then(() => {PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Request Sent")); setMap({...map, status: 1})})}}>{t('content.edit.request_approval')}</MainButton>)}
                <Tabs preselectedTab={1} tabs={[
                {
                    title: <ArrowLeft />,
                    content: <></>,
                    link: `/${map.type}s/${map.slug}`
                },
                {
                    
                    // General Tab
                    title: t('content.edit.general'),
                    content: <FormComponent id="general" onSave={(inputs) => {
                            let newMap = {
                                ...map
                            }
                            
                            if(inputs[0]) {
                                newMap.title = inputs[0]
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.title')))
                            }
        
                            if(inputs[1]) {
                                newMap.slug = encodeURI(inputs[1])
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.slug')))
                            }
        
                            if(inputs[2]) {
                                newMap.creators = JSON.parse(inputs[2])
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.creator')))
                            }
        
                            if(inputs[3]) {
                                newMap.shortDescription = inputs[3]
                                if(inputs[3].length < 20) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, t('content.edit.general.error.short_description_length')))
                                }
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.short_description')))
                            }
        
                            if(inputs[4]) {
                                newMap.videoUrl = inputs[4]
                            }
        
                            if(inputs[5]) {
                                newMap.description = inputs[5]
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.description')))
                            }

                            if(inputs[6]) {
                                newMap.tags = inputs[6].concat("," + inputs[7]).concat("," + inputs[8]).concat("," + inputs[9]).concat("," + inputs[10]).split(',')
                                newMap.tags = newMap.tags.filter((tag) => tag.length > 0)
                                newMap.tags = newMap.tags.filter((tag, index) => {
                                    return newMap.tags.indexOf(tag) === index
                                })
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
                            }

                            updateContent(newMap, token.current, collectionName).then((result) => {
                                if(result.error) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, result.error.toString()))
                                    return;
                                }

                                if(newMap.slug !== map.slug) {
                                    window.location.href = `/${newMap.type}s/${newMap.slug}/edit`
                                }

                                setMap(newMap)
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('content.edit.general.saved')))
                            }).catch((e) => {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                            })
                        }}> 
                            <Text type="text" name={t('content.edit.general.title')} value={map?.title} />
                            <Text type="text" name={t('content.edit.general.slug')} value={map?.slug}/>
                            <CreatorSelector value={map.creators} />
                            <Text type="text" name={t('content.edit.general.short_description')} value={map?.shortDescription} />
                            <Text type="text" name={t('content.edit.general.video_url')} value={map?.videoUrl} />
                            <RichTextInput name={t('content.edit.general.description')} value={map?.description} />
                            {tags && Object.keys(tags).map((category, idx) => {
                                return <Select key={idx} name={t(`tags.${category as TagCategories}`)} options={tags[category].map(tag => {
                                    return {name: t(`tags.${tag as TagKeys}`), value: tag}
                                })} multiSelect={true} value={map.tags?.filter(t => tags[category].includes(t)).join(',')}/>
                            })}
                        </FormComponent>
                    },{

                    // Images Tbat
                    title: t('content.edit.images'),
                    content: <MediaGallery onImagesUploaded={(files) => {
                        let newMap = {
                            ...map
                        }
                        newMap.images = files.map(f => f.url)
                        updateContent(newMap, token.current, collectionName).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('content.edit.images.saved')))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} presetFiles={JSON.stringify(map?.images?.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: t('content.edit.versions'),
                    content: <VersionManager collectionName={collectionName} presetVersions={JSON.stringify(map?.files)} onVersionsChanged={(vString) => {
                        let newMap = {
                            ...map
                        }
                        newMap.files = JSON.parse(vString)
                        
                        newMap.files.sort((a, b) => {
                            return b.createdDate - a.createdDate
                        })

                        updateContent(newMap, token.current, collectionName).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('content.edit.versions.saved')))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} />
                    },
                    {
                        title: t('content.edit.translations'),
                        content: <>
                            <SecondaryButton onClick={() => {
                                Popup.createPopup({title: t('content.edit.translations.add'), content: <FormComponent id="add_translation" onSave={(inputs) => {
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
                                    <Select name={t('content.edit.translations.language')} options={Locales.map(lang => {return {name: lang}})} description={<Link href="https://github.com/BenMeie/mccreations-next/blob/main/docs/translating.md">{t('content.edit.translations.missing_language')}</Link>}/>
                                </FormComponent>})
                            }}>{t('content.edit.translations.add')}</SecondaryButton>
                            {map.translations && Object.keys(map.translations).map((lang) => {
                                return <FormComponent id={lang} onSave={(inputs) => {
                                    let lang = inputs[0]
                                    let translation: Translation = {
                                    }
                                    translation[lang] = {
                                        title: inputs[1],
                                        shortDescription: inputs[2],
                                        description: inputs[3],
                                        approved: (inputs[4] === "true") ? true : false
                                    }
                                    updateTranslation(map.slug, collectionName, translation, sessionStorage.getItem('jwt'))
                                }} options={{extraButtons: (<WarningButton onClick={() => {
                                    let newMap = {
                                        ...map
                                    }
                                    delete newMap.translations![lang]
                                    setMap(newMap)
                                }}>Delete</WarningButton>)}}>
                                    <Select name={t('content.edit.translations.language')} options={[{name: lang}]}/>
                                    <Text name={t('content.create.title')} value={map.translations![lang].title}/>
                                    <Text name={t('content.create.short_description')} value={map.translations![lang].shortDescription}/>
                                    <RichTextInput name={t('content.edit.general.description')} value={map.translations![lang].description}/>
                                    <Checkbox name={t('content.edit.translations.approved')} value={`${map.translations![lang].approved}`}/>
                                </FormComponent>
                            })}
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