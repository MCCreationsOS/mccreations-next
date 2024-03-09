'use client'

import { getUser } from "@/app/api/auth"
import { fetchMap, updateContent } from "@/app/api/content"
import { FilePreview, IFile, IMap, IUser, MinecraftVersion } from "@/app/types"
import FormComponent from "@/components/Form/Form"
import { UploadedImageRepresentation } from "@/components/ImageDropzone/ImageDropzone"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useEffect, useState } from "react"

export default function EditContentPage({params}: {params: Params}) {
    const [user, setUser] = useState<IUser>()
    const [map, setMap] = useState<IMap>()
    useEffect(() => {
        let token = sessionStorage?.getItem('jwt')
        const getData = async () => {
            if(token) {
                let u = await getUser(undefined, token)
                setUser(u);
                let m = await fetchMap(params.slug, token)
                setMap(m);
            }
        }
        getData();
    }, [])

    let match = false;
    map?.creators.forEach((creator) => {
        if(creator.handle && user && user.handle && creator.handle === user?.handle) {
            match = true
        }
    })
    if(match) {
        return (
            <div className="centered_content">
               <FormComponent inputs={[
                    { type: 'text', name: 'Title', value: map?.title },
                    { type: 'text', name: 'Slug', value: map?.slug},
                    { type: 'creator', name: 'Creators', value: JSON.stringify(map!.creators) },
                    { type: 'text', name: 'Short Description', value: map?.shortDescription },
                    { type: 'long_text', name: 'Description', value: map?.description },
                    { type: 'multi_image', name: 'Images', value: JSON.stringify(map?.images.map(image => {return {url: image, name: image}})), description: "The first image will be used as your logo. If external images don't load, don't worry. They're still there :p!"},
                    { type: 'file', name: 'Files', value: JSON.stringify(map!.files) }
                ]} onSave={(inputs) => {

                    let newMap: IMap = {
                        ...map!
                    }
                    
                    if(inputs[0].value) {
                        newMap.title = inputs[0].value
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No title entered'))
                        return;
                    }

                    if(inputs[1].value) {
                        newMap.slug = inputs[1].value
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No slug entered'))
                        return;
                    }

                    if(inputs[2].value) {
                        newMap.creators = JSON.parse(inputs[2].value)
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No creator entered'))
                        return;
                    }

                    if(inputs[3].value) {
                        newMap.shortDescription = inputs[3].value
                        if(inputs[3].value.length < 20) {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Warning, "Short description needs to be longer than 20 characters"))
                        }
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No short description entered'))
                        return;
                    }

                    if(inputs[4].value) {
                        newMap.description = inputs[4].value
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "No description entered"))
                    }

                    if(inputs[5].value) {
                        let images = JSON.parse(inputs[5].value) as UploadedImageRepresentation[]
                        if(images.length > 0 && 'url' in images[0]) {
                            newMap.images = images.map((image) => image.url)
                        } else {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'There was an error saving your images'))
                        }
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No images provided'))
                    }

                    if(inputs[6].value) {
                        let files = JSON.parse(inputs[6].value) as IFile[]
                        console.log(files)
                        if(files.length > 0 && 'worldUrl' in files[0]) {
                            newMap.files = files
                        } else {
                            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'There was an error saving your files'))
                        }
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, 'No files provided'))
                        return;
                    }

                    updateContent(newMap)
                    }} />
            </div>
        )
    }
    return (<></>)
}