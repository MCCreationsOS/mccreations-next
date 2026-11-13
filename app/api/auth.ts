import { IUser } from "@/app/api/types";

export async function getUser(authorization?: string) {
    if(authorization) {
        try {
            let res = await fetch(`${process.env.DATA_URL}/user`, {
                headers: {
                    'Authorization': authorization
                },
                cache: 'no-store'
            })
            // An expired or invalid token returns {error}; don't treat that as a user
            if(!res.ok) return undefined
            let data = await res.json();
            if(data && !data.error && data._id) {
                return data as IUser;
            }
        } catch(e) {
            console.error(e)
        }
    }
}

export async function getCreators(authorization: string): Promise<IUser[] | undefined> {
    try {
        let res = await fetch(`${process.env.DATA_URL}/creators`, {
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

export type ApiResult = { ok: true, error?: undefined } | { ok: false, error: string }

/**
 * Sends a write request to the API and reports whether it worked. Most of these routes reply with an
 * empty body on success and {error} on failure, so the body is only read when the status isn't ok.
 */
async function send(path: string, method: string, authorization?: string, body?: unknown): Promise<ApiResult> {
    try {
        const res = await fetch(`${process.env.DATA_URL}${path}`, {
            method,
            headers: {
                ...(authorization ? { 'Authorization': authorization } : {}),
                ...(body !== undefined ? { 'Content-Type': 'application/json' } : {})
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        })
        if (res.ok) return { ok: true }
        let error = `Request failed (${res.status})`
        try {
            const data = await res.json()
            if (data?.error) error = String(data.error)
        } catch {}
        return { ok: false, error }
    } catch (e) {
        console.error(e)
        return { ok: false, error: String(e) }
    }
}

export async function deleteUser(authorization: string) {
    return send('/user', 'DELETE', authorization)
}

export async function updateProfile(authorization: string, profile: { banner?: string, icon?: string, username?: string, about?: string, customCss?: string }) {
    return send('/user/updateProfile', 'POST', authorization, {
        banner: profile.banner,
        icon: profile.icon,
        username: profile.username,
        about: profile.about,
        customCSS: profile.customCss
    })
}

export async function updateSocialLinks(authorization: string, socialLinks: {link: string, name: string}[]) {
    return send('/user/updateSocialLinks', 'POST', authorization, {links: socialLinks})
}

export async function updateHandle(authorization: string, handle: string) {
    return send('/user/updateHandle', 'POST', authorization, {handle})
}

export async function updateEmail(authorization: string, email: string, currentPassword: string) {
    return send('/user/updateEmail', 'POST', authorization, {email, currentPassword})
}

export async function updatePassword(authorization: string, password: string, currentPassword: string) {
    return send('/user/updatePassword', 'POST', authorization, {password, currentPassword})
}

export async function sendPasswordResetEmail(email: string) {
    return send('/user/forgotPassword', 'POST', undefined, {email})
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
    return send('/user/updateSettings', 'POST', authorization, {notifications: {comment: comment, like: like, reply: reply, follow: follow, rating: rating, translation: translation}})
}

export async function readNotification(authorization: string, notification: string) {
    return send(`/notifications/${encodeURIComponent(notification)}`, 'PATCH', authorization)
}

export async function readAllNotifications(authorization: string) {
    return send('/notifications', 'PATCH', authorization)
}

export async function subscribeToPushNotifications(authorization: string, subscription: PushSubscription) {
    return send('/notifications/subscribe', 'POST', authorization, subscription.toJSON())
}
