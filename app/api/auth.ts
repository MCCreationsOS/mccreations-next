import { IUser } from "../types";

export async function getUser(id?: object, authorization?: string) {
    if(authorization) {
        try {
            let res = await fetch(`${process.env.DATA_URL}/auth/user`, {
                headers: {
                    'Authorization': authorization
                }
            })
            let data = await res.json();
            return data.user as IUser;
        } catch(e) {
            console.log(e)
        }
    }
}

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
        console.log(e)
    }
}