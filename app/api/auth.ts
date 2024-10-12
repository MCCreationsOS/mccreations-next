import { IUser, UserTypes } from "@/app/api/types";
import { ProfileLayout } from "@/components/Profile/CustomizableProfileArea";
import { create } from "zustand";

type UserStore = {
    username: string
    type: UserTypes
    email: string
    handle: string
    _id: string
    iconURL: string
    bannerURL: string
    about: string,
    socialLinks?: [{
        link: string,
        name: string
    }]
    profileLayout?: ProfileLayout
    setUser: (user: IUser) => void
    setIcon: (iconURL: string) => void
    setBanner: (bannerURL: string) => void
    setAbout: (about: string) => void
    setSocialLinks: (socialLinks: [{
        link: string,
        name: string
    }]) => void
    setProfileLayout: (profileLayout: ProfileLayout) => void
    logout: () => void
}

export const useUserStore = create<UserStore>(set => ({
    username: "",
    type: UserTypes.Account,
    email: "",
    handle: "",
    _id: "",
    iconURL: "",
    bannerURL: "",
    about: "",
    socialLinks: undefined,
    profileLayout: undefined,
    setUser: (user: IUser) => {
        set({
            username: user.username,
            type: user.type,
            email: user.email,
            handle: user.handle,
            _id: user._id,
            iconURL: user.iconURL,
            bannerURL: user.bannerURL,
            about: user.about,
            socialLinks: user.socialLinks,
            profileLayout: user.profileLayout
        })
    },
    setIcon: (iconURL: string) => {
        set({iconURL: iconURL})
    },
    setBanner: (bannerURL: string) => {
        set({bannerURL: bannerURL})
    },
    setAbout: (about: string) => {
        set({about: about})
    },
    setSocialLinks: (socialLinks: [{
        link: string,
        name: string
    }]) => {
        set({socialLinks: socialLinks})
    },
    setProfileLayout: (profileLayout: ProfileLayout) => {
        set({profileLayout: profileLayout})
    },
    logout: () => {
        set({
            username: "",
            type: UserTypes.Account,
            email: "",
            handle: "",
            _id: "",
            iconURL: "",
            bannerURL: "",
            about: "",
            socialLinks: undefined,
            profileLayout: undefined
        })
    }
}))


export async function getUser(authorization?: string) {
    if(authorization) {
        try {
            let res = await fetch(`${process.env.DATA_URL}/auth/user`, {
                headers: {
                    'Authorization': authorization
                }
            })
            let data = await res.json();
            if(data.user) {
                return data.user as IUser;
            }
        } catch(e) {
            console.error(e)
        }
    }
}

export async function getCreators(authorization: string): Promise<IUser[] | undefined> {
    try {
        let res = await fetch(`${process.env.DATA_URL}/auth/user/creators`, {
            headers: {
                'Authorization': authorization
            }
        })
        let data = await res.json();
        if(data.creators) {
            return data.creators as IUser[]
        } else {
            return data.error
        }
    } catch(e) {
        console.error(e)
    }
}

export async function deleteUser(authorization: string) {
    try {
        fetch(`${process.env.DATA_URL}/auth/user`, {
            method: 'DELETE',
            headers: {
                "Authorization": authorization
            }
        })
    } catch(e) {
        console.error(e)
    }
}

// export async function 

export async function updateProfile(authorization: string, banner?: string, icon?: string, username?: string, about?: string) {
    try {
        fetch(`${process.env.DATA_URL}/auth/user/updateProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({
                banner: banner,
                icon: icon,
                username: username,
                about: about
            })
        })
    } catch(e) {
        console.error(e)
    }
}

export async function updateProfileLayout(authorization: string, layout: ProfileLayout) {
    try {
        fetch(`${process.env.DATA_URL}/auth/user/updateProfileLayout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({profileLayout: layout})
        })
    } catch(e) {
        console.error(e)
    }
}

export async function sendPasswordResetEmail(email: string) {
    try {
        fetch(`${process.env.DATA_URL}/auth/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email})
        })
    } catch(e) {
        console.error(e)
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        let res = await fetch(`${process.env.DATA_URL}/auth/resetPassword`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password})
        })
        try {
            let data = await res.json()
            if(data && data.error) {
                return data.error
            }
            return undefined
        } catch(e) {
            return undefined
        }
    } catch(e) {
        console.error(e)
        return e
    }
}