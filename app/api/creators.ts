import { create } from "zustand"
import { IComment } from "./types"
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
        let token = localStorage.getItem('jwt')
        updateProfileLayout(token + "", profileLayout).then(() => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, "Profile layout updated"))
        })
        set({profileLayout})
    }
}))

export async function sendWallPost(authorization: string, wallPost: IComment) {
    try {
        await fetch(`${process.env.DATA_URL}/creator/wall/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({wallPost: wallPost})
        })
        return;
    } catch(e) {
        console.error(e)
    }
}

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

export async function postWallComment(authorization: string, id: string, comment: IComment, idx?: number) {
    try {
        await fetch(`${process.env.DATA_URL}/creator/wall/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({
                creator: id,
                comment: comment,
                idx: idx
            })
        })
        return;
    } catch(e) {
        console.error(e)
    }
}