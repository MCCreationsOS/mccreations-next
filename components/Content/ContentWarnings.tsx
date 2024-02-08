'use client'

import { getUser } from "@/app/api/auth"
import { ICreator, IMap, IUser } from "@/app/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import MessageComponent, { IMessage } from "../Message/Message"

export default function ContentWarnings({map}: {map: IMap}) {
    const [user, setUser] = useState<IUser>()
    useEffect(() => {
        let token = sessionStorage?.getItem('jwt')
        const getData = async () => {
            if(token) {
                let u = await getUser(undefined, token)
                setUser(u);
            }
        }
        getData();
    }, [])

    let match = false;
    map.creators.forEach((creator) => {
        if(creator.handle && user && user.handle && creator.handle === user?.handle) {
            match = true
        }
    })
    if(match) {
        let messages: IMessage[] = []
        if(map.shortDescription.length < 20) {
            messages.push({
                type: 'Error',
                title: 'Short Description Too Short',
                message: `Your short description needs to be at least 20 characters`
            })
        }
        if(map.images.length === 0) {
            messages.push({
                type: 'Error',
                title: 'No Images',
                message: `Content is required to have at least one image.`
            })
        }
        if(map.description.length < 20) {
            messages.push({
                type: 'Error',
                title: 'Description Too Short',
                message: `Your description needs to be at least 20 characters`
            })
        }
        if(map.images.length <= 2) {
            messages.push({
                type: 'Warning',
                title: 'Very Few Images',
                message: `More images help people get a better idea of what your content is about. It is recommended you upload at least 4 including your logo.`
            })
        }
        map.images.forEach(image => {
            if(!image.includes('mccreations')) {
                messages.push({
                    type: 'Warning',
                    title: "Images From External Sources",
                    message: `The image ${image.substring(image.lastIndexOf('/') + 1)} is from an external source. This means that MCCreations cannot guarantee it will continue to work in the future, or will be accessible by all users. We highly recommend you upload this image instead.`
                })
            }
        })
        if(!map.creators[0].handle) {
            messages.push({
                type: 'Warning',
                title: 'Not Linked to an Account',
                message: `This map is not linked to an account on MCCreations. This means that your access to edit this content will expire in 24 hours. It is recommended to upload maps with an account so you can retain access to all features.`
            })
        }
        return (
            <MessageComponent messages={messages} />
        )
    }
    return (<></>)
}