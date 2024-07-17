'use client'

import { getUser } from "@/app/api/auth"
import { fetchDatapack, fetchMap, fetchResourcepack, fetchTags, requestApproval, updateContent, updateTranslation } from "@/app/api/content"
import { FilePreview, IFile, IContentDoc, IUser, MinecraftVersion, Tags, ContentTypes, UserTypes, Locales } from "@/app/api/types"
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
import SecondaryButton from "../Buttons/SecondaryButton"
import { Popup } from "../Popup/Popup"
import WarningButton from "../Buttons/WarningButton"
import Checkbox from "../FormInputs/Checkbox"
import Link from "next/link";

export default function EditContentPage({params, contentType}) {
    const [user, setUser] = useState()
    const [map, setMap] = useState()
    const [tags, setTags] = useState()
    const token = useRef("")
    const t = useI18n();

    useEffect(() => {
        token.current = sessionStorage?.getItem('jwt') + ""
        const getData = async () => {
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
            fetchTags(contentType).then((data) => {
                if('genre' in data) {
                    setTags(data)
                }
            })
        }
        getData();
    }, [])

    let match = false;
    if(map && '_id' in map) {
        map?.creators?.forEach((creator) => {
            if(creator.handle && user && user.handle && creator.handle === user?.handle) {
                match = true
            }
        })
        if(map.status === 0) {
            match = true;
        }
        if(user?.type === UserTypes.Admin) {
            match = true;
        }
    }
    if(match) {
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
                    link: `/${contentType}/${map.slug}`
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
                                newMap.slug = inputs[1]
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
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.description')))
                            }

                            if(inputs[6]) {
                                newMap.tags = inputs[6].concat(inputs[7]).concat(inputs[8]).concat(inputs[9]).concat(inputs[10]).split(',')
                                newMap.tags = newMap.tags.filter((tag) => tag.length > 0)
                                newMap.tags = newMap.tags.filter((tag, index) => {
                                    return newMap.tags.indexOf(tag) === index
                                })
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.edit.general.error.tags')))
                            }

                            updateContent(newMap, token.current, contentType).then((error) => {
                                if(error.message) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, error.message))
                                    return;
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
                                return <Select key={idx} name={t(`tags.${category}`)} options={tags[category].map(tag => {
                                    return {name: t(`tags.${tag}`), value: tag}
                                })} multiSelect={true} value={map.tags?.join(',')}/>
                            }) || undefined}
                        </FormComponent>
                    },{

                    // Images Tbat
                    title: t('content.edit.images'),
                    content: <MediaGallery onImagesUploaded={(files) => {
                        let newMap = {
                            ...map
                        }
                        newMap.images = files.map(f => f.url)
                        updateContent(newMap, token.current, contentType).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('content.edit.images.saved')))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} presetFiles={JSON.stringify(map?.images.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: t('content.edit.versions'),
                    content: <VersionManager contentType={contentType} presetVersions={JSON.stringify(map?.files)} onVersionsChanged={(vString) => {
                        let newMap = {
                            ...map
                        }
                        newMap.files = JSON.parse(vString)
                        
                        newMap.files.sort((a, b) => {
                            return parseFloat(b.contentVersion) - parseFloat(a.contentVersion)
                        })

                        updateContent(newMap, token.current, contentType).then(() => {
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
                                        description: ""
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
                                    let translation = {
                                    }
                                    translation[lang] = {
                                        title: inputs[1],
                                        shortDescription: inputs[2],
                                        description: inputs[3],
                                        approved: (inputs[4] === "true") ? true : false
                                    }
                                    updateTranslation(map.slug, contentType, translation, sessionStorage.getItem('jwt'))
                                }} options={{extraButtons: <WarningButton onClick={() => {
                                    let newMap = {
                                        ...map
                                    }
                                    delete newMap.translations[lang]
                                    setMap(newMap)
                                }}>Delete</WarningButton>}}>
                                    <Select name={t('content.edit.translations.language')} options={[{name: lang}]}/>
                                    <Text name={t('content.create.title')} value={map.translations[lang].title}/>
                                    <Text name={t('content.create.short_description')} value={map.translations[lang].shortDescription}/>
                                    <RichTextInput name={t('content.edit.general.description')} value={map.translations[lang].description}/>
                                    <Checkbox name={t('content.edit.translations.approved')} value={map.translations[lang].approved}/>
                                </FormComponent>
                            })}
                        </>
                    }]} />
            </div>
        )
    }
    return (
        <>
        {(map) ? <p>{t('error')}</p> : ""}
        </>
    )
}