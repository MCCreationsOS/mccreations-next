import { IUser } from "@/app/api/types";
import { ProfileLayout } from "@/components/Profile/CustomizableProfileArea";

export async function getUser(authorization?: string) {
    if(authorization) {
        try {
            let res = await fetch(`${process.env.DATA_URL}/user`, {
                headers: {
                    'Authorization': authorization
                },
                cache: 'no-store'
            })
            let data = await res.json();
            if(data) {
                return data as IUser;
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
        fetch(`${process.env.DATA_URL}/user`, {
            method: 'DELETE',
            headers: {
                "Authorization": authorization
            },
            cache: 'no-store'
        })
    } catch(e) {
        console.error(e)
    }
}

// export async function 

export async function updateProfile(authorization: string, banner?: string, icon?: string, username?: string, about?: string) {
    try {
        fetch(`${process.env.DATA_URL}/user/updateProfile`, {
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
            }),
            cache: 'no-store'
        })
    } catch(e) {
        console.error(e)
    }
}

export async function updateProfileLayout(authorization: string, layout: ProfileLayout) {
    try {
        fetch(`${process.env.DATA_URL}/user/updateProfileLayout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({profileLayout: layout}),
            cache: 'no-store'
        })
    } catch(e) {
        console.error(e)
    }
}

export async function sendPasswordResetEmail(email: string) {
    try {
        fetch(`${process.env.DATA_URL}/user/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email}),
            cache: 'no-store'
        })
    } catch(e) {
        console.error(e)
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        let res = await fetch(`${process.env.DATA_URL}/user/updatePassword`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password}),
            cache: 'no-store'
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

export async function updateNotificationSettings(authorization: string, comment: string, like: string, reply: string, follow: string, rating: string, translation: string) {
    fetch(`${process.env.DATA_URL}/user/updateSettings`, {
        method: 'POST',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({notifications: {comment: comment, like: like, reply: reply, follow: follow, rating: rating, translation: translation}}),
            cache: 'no-store'
    })
}

export async function readNotification(authorization: string, notification: string) {
    fetch(`${process.env.DATA_URL}/notification/${notification}`, {
        method: 'PATCH',
        headers: {
            'Authorization': authorization
        },
        cache: 'no-store'
    })
}

export async function readAllNotifications(authorization: string) {
    fetch(`${process.env.DATA_URL}/notifications`, {
        method: 'PATCH',
        headers: {
            'Authorization': authorization
        },
        cache: 'no-store'
    })
}

export async function subscribeToPushNotifications(authorization: string, subscription: PushSubscription) {
    fetch(`${process.env.DATA_URL}/notifications/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription),
        cache: 'no-store'
    })
}

