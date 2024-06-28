'use client'

import { getUser } from "@/app/api/auth"
import { fetchDatapack, fetchMap, fetchResourcepack, fetchTags, requestApproval, updateContent } from "@/app/api/content"
import { FilePreview, IFile, IContentDoc, IUser, MinecraftVersion, Tags, ContentTypes, UserTypes } from "@/app/types"
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

export default function EditContentPage({params, contentType}) {
    const [user, setUser] = useState()
    const [map, setMap] = useState()
    const [tags, setTags] = useState()
    const token = useRef("")
    useEffect(() => {
        token.current = sessionStorage?.getItem('jwt') + ""
        console.log("Token is " + token.current)
        const getData = async () => {
            if(token && token.current.length > 0) {

                let u = await getUser(undefined, token.current)
                setUser(u);

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
                <h1>Editing {map?.title}</h1>
                <p>Status: {(map?.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map?.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                {map?.status === 0 && (<MainButton onClick={() => {requestApproval(map.slug, token.current).then(() => {PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Request Sent"))})}}>Request Approval</MainButton>)}
                <Tabs preselectedTab={1} tabs={[
                {
                    title: <ArrowLeft />,
                    content: <></>,
                    link: `/${contentType}/${map.slug}`
                },
                {
                    
                    // General Tab
                    title: "General",
                    content: <FormComponent id="general" onSave={(inputs) => {
                            let newMap = {
                                ...map
                            }
                            
                            if(inputs[0]) {
                                newMap.title = inputs[0]
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No title entered'))
                            }
        
                            if(inputs[1]) {
                                newMap.slug = inputs[1]
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No slug entered'))
                            }
        
                            if(inputs[2]) {
                                newMap.creators = JSON.parse(inputs[2])
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No creator entered'))
                            }
        
                            if(inputs[3]) {
                                newMap.shortDescription = inputs[3]
                                if(inputs[3].length < 20) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, "Short description needs to be longer than 20 characters"))
                                }
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No short description entered'))
                            }
        
                            if(inputs[4]) {
                                newMap.videoUrl = inputs[4]
                            }
        
                            if(inputs[5]) {
                                newMap.description = inputs[5]
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "No description entered"))
                            }

                            if(inputs[6]) {
                                newMap.tags = inputs[6].concat(inputs[7]).concat(inputs[8]).concat(inputs[9]).concat(inputs[10]).split(',')
                                newMap.tags = newMap.tags.filter((tag) => tag.length > 0)
                                newMap.tags = newMap.tags.filter((tag, index) => {
                                    return newMap.tags.indexOf(tag) === index
                                })
                            } else {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No tags entered'))
                            }

                            updateContent(newMap, token.current, contentType).then((error) => {
                                if(error.message) {
                                    PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, error.message))
                                    return;
                                }
                                setMap(newMap)
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Map info saved successfully'))
                            }).catch((e) => {
                                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                            })
                        }}> 
                            <Text type="text" name="Title" value={map?.title} />
                            <Text type="text" name="Slug" value={map?.slug}/>
                            <CreatorSelector value={map.creators} />
                            <Text type="text" name="Short Description" value={map?.shortDescription} />
                            <Text type="text" name="Video URL" value={map?.videoUrl} />
                            <RichTextInput name="Description" value={map?.description} />
                            {tags && Object.keys(tags).map(category => {
                                return <Select name={category.charAt(0).toUpperCase() + category.substring(1)} options={tags[category].map(tag => {
                                    return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                                })} multiSelect={true} value={map.tags?.join(',')}/>
                            }) || undefined}
                        </FormComponent>
                    },{

                    // Images Tbat
                    title: "Images",
                    content: <MediaGallery onImagesUploaded={(files) => {
                        let newMap = {
                            ...map
                        }
                        newMap.images = files.map(f => f.url)
                        updateContent(newMap, token.current, contentType).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Images saved successfully'))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} presetFiles={JSON.stringify(map?.images.map(image => {return {url: image, name: image}}))}/>
                    }, {

                    // Versions Tab
                    title: "Versions",
                    content: <VersionManager presetVersions={JSON.stringify(map?.files)} onVersionsChanged={(vString) => {
                        let newMap = {
                            ...map
                        }
                        newMap.files = JSON.parse(vString)
                        
                        newMap.files.sort((a, b) => {
                            return parseFloat(b.contentVersion) - parseFloat(a.contentVersion)
                        })

                        updateContent(newMap, token.current, contentType).then(() => {
                            setMap(newMap)
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, 'Versions saved successfully'))
                        }).catch((e) => {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
                        })
                    }} />
                    }]} />
            </div>
        )
    }
    return (
        <>
        {(map) ? <p>Error</p> : ""}
        </>
    )
}