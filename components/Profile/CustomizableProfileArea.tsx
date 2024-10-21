"use client"

import { WidthProvider, Responsive } from "react-grid-layout"
import React, { useEffect, useState } from "react"
import ProfileWidget from "./Widgets/ProfileWidget"
import styles from "./ProfileStyle.module.css"
import widgetStyles from './Widgets/ProfileWidget.module.css'
import { updateProfileLayout, useUserStore } from "@/app/api/auth"
import { IUser } from "@/app/api/types"
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage"
import { defaultProfileLayout, useProfileLayoutStore } from "@/app/api/creators"
import { getCreator } from "@/app/api/community"
const GridLayout = WidthProvider(Responsive)

export type ProfileWidgetType = "Discord" | "FeaturedCreation" | "Image" | "Showcase" | "SupportSite" | "Text" | "Twitch" | "YouTube" | "Wall"

export interface ProfileWidget {
    type: ProfileWidgetType,
    id: string,
    data: any
}

export interface ProfileLayout {
    widgets: ProfileWidget[]
    layout: ReactGridLayout.Layout[]
}

export default function CustomizableProfileArea({creator}: {creator: IUser}) {
    const user = useUserStore(state => state)
    const {profileLayout, setProfileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        getCreator(creator.handle + "").then((c) => {
            if(c.profileLayout) {
                setProfileLayout(c.profileLayout)
            } else {
                setProfileLayout(defaultProfileLayout)
            }
            setWindowWidth(window.innerWidth)
        })
    }, [])

    const onDragStop = (newLayout: ReactGridLayout.Layout[]) => {
        if(JSON.stringify(profileLayout.layout) === JSON.stringify(newLayout)) return
        if(user.username !== creator.username) return
        if(window.innerWidth !== windowWidth) {
            setWindowWidth(window.innerWidth)
            return
        }
        updateProfileLayout({widgets: profileLayout.widgets, layout: newLayout})
    }

    const onResizeStop = (newLayout: ReactGridLayout.Layout[]) => {
        if(JSON.stringify(profileLayout.layout) === JSON.stringify(newLayout)) return
        if(user.username !== creator.username) return
        if(window.innerWidth !== windowWidth) {
            setWindowWidth(window.innerWidth)
            return
        }
        updateProfileLayout({widgets: profileLayout.widgets, layout: newLayout})
    }

    if(windowWidth === 0) return

    return (
        <div>
            <GridLayout
                className={"layout"}
                cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
                rowHeight={50}
                resizeHandles={["se"]}
                allowOverlap={false}
                draggableHandle={`.${widgetStyles.draggable_handle}`}
                containerPadding={[5, 5]}
                isResizable={user.handle === creator.handle}
                isDroppable={user.handle === creator.handle}
                isDraggable={user.handle === creator.handle}

                onDragStop={onDragStop}
                onResizeStop={onResizeStop}
            >
                {profileLayout.layout.map((widget, index) => (
                     <div key={widget.i} data-grid={widget} className={widgetStyles.widget}>
                       <ProfileWidget type={profileLayout.widgets[index].type} id={profileLayout.widgets[index].id} creator={creator} data={profileLayout.widgets[index].data} canEdit={user.handle === creator.handle}/>
                   </div>
                ))}
            </GridLayout>
        </div>
    )
}