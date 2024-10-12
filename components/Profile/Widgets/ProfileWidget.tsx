import React, { Suspense, useState } from "react";
import { ProfileWidgetType } from "../CustomizableProfileArea";
import Showcase from "./Showcase";
import { IUser } from "@/app/api/types";
import SupportSite from "./SupportSite";
import FeaturedCreation from "./FeaturedCreation";
import Wall from "./Wall";
import styles from './ProfileWidget.module.css'
import Youtube from "./Youtube";
import TextWidget from "./Text";
import ImageWidget from "./Image";
import Twitch from "./Twitch";
import Discord from "./Discord";

export default function ProfileWidget({type, id, creator, data, canEdit}: {type: ProfileWidgetType, id: string, creator: IUser, data: any, canEdit: boolean}) {

    switch(type) {
        case "Discord":
            return <Discord serverId={data.serverId} canEdit={canEdit} id={id}/>
        case "FeaturedCreation":
            return <FeaturedCreation type={data.type} slug={data.slug} canEdit={canEdit} id={id}/>
        case "Image":
            return <ImageWidget image={data.image} title={data.title} canEdit={canEdit} id={id}/>
        case "Showcase":
            return <Showcase id={id} creator={creator} type={data.type} canEdit={canEdit}/>
        case "SupportSite":
            return <SupportSite canEdit={canEdit} id={id}/>
        case "Text":
            return <TextWidget text={data.text} title={data.title} canEdit={canEdit} id={id}/>
        case "Twitch":
            return <Twitch handle={data.handle} canEdit={canEdit} id={id}/>
        case "YouTube":
            return <Youtube handle={data.handle} canEdit={canEdit} id={id}/>
        case "Wall":
            return <Wall creator={creator} canEdit={canEdit} id={id}/>
    }
}