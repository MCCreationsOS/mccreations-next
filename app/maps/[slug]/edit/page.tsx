'use client'

import { getUser } from "@/app/api/auth"
import { fetchMap, fetchTags, requestApproval, updateContent } from "@/app/api/content"
import { FilePreview, IFile, IMap, IUser, MinecraftVersion, Tags } from "@/app/types"
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

export default function EditContentPage({params}: {params: Params}) {
    const [user, setUser] = useState<IUser>()
    const [map, setMap] = useState<IMap>()
    const [tags, setTags] = useState<Tags>()
    const token = useRef("")
    useEffect(() => {
        token.current = sessionStorage?.getItem('jwt') + ""
        console.log("Token is " + token.current)
        const getData = async () => {
            if(token && token.current.length > 0) {
                let u = await getUser(undefined, token.current)
                setUser(u);
                let m = await fetchMap(params.slug, token.current)
                setMap(m);
            } else {
                token.current = sessionStorage.getItem('temp_key') + ""
                let m = await fetchMap(params.slug, token + "")
                setMap(m);
            }
            fetchTags().then((data) => {
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
        if(user?.handle === "crazycowmm") {
            match = true;
        }
    }
    if(match) {
        return (
            <div className="centered_content">
                <ContentWarnings map={map!} />
                <h1>Editing {map?.title}</h1>
                <p>Status: {(map?.status === 0) ? <span style={{color: "#c73030"}}>Draft</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>Awaiting Approval</span> : (map?.status === 2) ? <span>Approved</span>: <span style={{color:"#3154f4"}}>Featured</span>}</p>
                {map?.status === 0 && (<MainButton onClick={() => {requestApproval(map!.slug, token.current).then(() => {PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Request Sent"))})}}>Request Approval</MainButton>)}
                <Tabs preselectedTab={1} tabs={[
                {
                    title: <ArrowLeft />,
                    content: <></>,
                    link: `/maps/${map!.slug}`
                },
                {
                    
                    // General Tab
                    title: "General",
                    content: <FormComponent id="general" onSave={(inputs) => {
                            let newMap: IMap = {
                                ...map!
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

                            updateContent(newMap, token.current).then((error) => {
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
                            <CreatorSelector value={map!.creators} />
                            <Text type="text" name="Short Description" value={map?.shortDescription} />
                            <Text type="text" name="Video URL" value={map?.videoUrl} />
                            <RichTextInput name="Description" value={map?.description} />
                            <Select name="Genre" options={tags?.genre.map(tag => {
                                return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                            })} multiSelect={true} value={map!.tags?.join(',')}/>
                            <Select name="Subgenre" options={tags?.subgenre.map(tag => {
                                return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                            })} multiSelect={true} value={map!.tags?.join(',')}/>
                            <Select name="Theme" options={tags?.theme.map(tag => {
                                return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                            })} multiSelect={true} value={map!.tags?.join(',')}/>
                            <Select name="Difficulty" options={tags?.difficulty.map(tag => {
                                return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                            })} multiSelect={true} value={map!.tags?.join(',')}/>
                            <Select name="Length" options={tags?.length.map(tag => {
                                return {name: tag.charAt(0).toUpperCase() + tag.substring(1), value: tag}
                            })} multiSelect={true} value={map!.tags?.join(',')}/>
                        </FormComponent>
                    },{

                    // Images Tab
                    title: "Images",
                    content: <MediaGallery onImagesUploaded={(files) => {
                        let newMap: IMap = {
                            ...map!
                        }
                        newMap.images = files.map(f => f.url)
                        updateContent(newMap, token.current).then(() => {
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
                        let newMap: IMap = {
                            ...map!
                        }
                        newMap.files = JSON.parse(vString)
                        
                        newMap.files.sort((a, b) => {
                            return parseFloat(b.contentVersion) - parseFloat(a.contentVersion)
                        })

                        updateContent(newMap, token.current).then(() => {
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