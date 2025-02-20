import { create } from "zustand"
import { IComment, IContentDoc, IUser, UserTypes } from "./types"
import { ProfileLayout } from "@/components/Profile/CustomizableProfileArea"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { updateProfileLayout } from "./auth"

type ProfileLayoutStore = {
    profileLayout: ProfileLayout
    setProfileLayout: (profileLayout: ProfileLayout) => void
    updateProfileLayout: (profileLayout: ProfileLayout) => void
}

export const defaultProfileLayout: ProfileLayout = {
    widgets: [
        {type: "Showcase", id: "0", data: {type: "content"}},
        {type: "Wall", id: "1", data: {}},
        {type: "SupportSite", id: "2", data: {}},
    ],
    layout: [
        {i: "0", x: 0, y: 0, w: 24, h: 6},
        {i: "1", x: 0, y: 5, w: 12, h: 6},
        {i: "2", x: 12, y: 5, w: 12, h: 6}
    ]
}

export const useProfileLayoutStore = create<ProfileLayoutStore>(set => ({
    profileLayout: defaultProfileLayout,
    setProfileLayout: (profileLayout: ProfileLayout) => {
        set({profileLayout})
    },
    updateProfileLayout: (profileLayout: ProfileLayout) => {
        let token = localStorage?.getItem('jwt')
        updateProfileLayout(token + "", profileLayout).then(() => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Profile layout updated"))
        })
        set({profileLayout})
    }
}))

export async function getWall(authorization: string, handle: string) {
    try {
        const response = await fetch(`${process.env.DATA_URL}/creator/wall/${handle}`, {
            headers: {
                'Authorization': authorization
            }
        })
        return response.json()
    } catch(e) {
        console.error(e)
    }
}

export async function getNotifications(authorization: string, page: number) {
    try {
        const response = await fetch(`${process.env.DATA_URL}/notifications?page=${page}`, {
            headers: {
                'Authorization': authorization
            },
            cache: 'no-store'
        })
        return response.json()
    } catch(e) {
        console.error(e)
    }
}

export async function getUserSettings(authorization: string) {
    try {
        const response = await fetch(`${process.env.DATA_URL}/user/settings`, {
            headers: {
                'Authorization': authorization
            },
            cache: 'no-store'
        })
        return response.json()
    } catch(e) {
        console.error(e)
    }
}

export async function follow(authorization: string, handle: string) {
    try {
        await fetch(`${process.env.DATA_URL}/creator/follow/${handle}`, {
            method: 'GET',
            headers: {
                'Authorization': authorization
            },
            cache: 'no-store'
        })
        return;
    } catch(e) {
        console.error(e)
    }
}

export async function unfollow(authorization: string, handle: string) {
    try {
        await fetch(`${process.env.DATA_URL}/creator/unfollow/${handle}`, {
            method: 'GET',
            headers: {
                'Authorization': authorization
            },
            cache: 'no-store'

        })

        return;
    } catch(e) {
        console.error(e)
    }
}

export function canEdit(creation: IContentDoc, user: IUser) {
    let allowedToEdit = false;
    if(creation.creators) {
        creation.creators.forEach((creator) => {
            if(creator.handle === user?.handle && (user?.handle?.length ?? 0) > 0) {
                allowedToEdit = true;
            }
        })
    } else if (sessionStorage.getItem('temp_key')) {
        allowedToEdit = true;
    }

    if(user?.type === UserTypes.Admin) {
        allowedToEdit = true;
    }

    if(creation.owner && creation.owner.length > 0 && creation.owner === user?.handle) {
        allowedToEdit = true;
    }

    return allowedToEdit;
}