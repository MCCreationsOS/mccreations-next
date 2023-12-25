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

export async function deleteUser(authorization: string) {
    try {
        fetch(`${process.env.DATA_URL}/auth/user`, {
            method: 'DELETE',
            headers: {
                "Authorization": authorization
            }
        })
    } catch(e) {
        console.log(e)
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
        console.log(e)
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
        console.log(e)
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
        console.log(e)
        return e
    }
}