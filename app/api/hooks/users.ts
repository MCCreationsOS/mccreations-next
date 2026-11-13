import { getUser } from "../auth"
import useSWR, { mutate } from 'swr'
import { CreatorSettings, ICreator, IUser, UserTypes } from "../types"
import { getCreator } from "../community"
import { useState } from "react"
import { useIsClient, useLocalStorage, useSessionStorage } from 'usehooks-ts'
import { follow, getUserSettings, unfollow } from "../creators"

const getUserFetcher = (token: string) => {
    return getUser(token)
}

const getCreatorFetcher = (handle?: string) => {
    if(!handle) return undefined
    return getCreator(handle)
}

const getUserSettingsFetcher = (token: string) => {
    return getUserSettings(token)
}

export const useToken = () => {
    const [token, setToken] = useLocalStorage<string>('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    return { token, setToken }
}

export const useTokenOrKey = () => {
    const [token, setToken] = useLocalStorage<string>('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const [tempKey, setTempKey] = useSessionStorage<string>('temp_key', '', {serializer: (value) => value, deserializer: (value) => value})

    if(token && token !== "") {
        return { token, setToken }
    } else {
        return { token: tempKey, setToken: setTempKey }
    }
}

export const useUser = (alwaysSecure: boolean = false) => {
    const {token} = useToken()
    const { data, error, isLoading } = useSWR([token, 'user'], ([token]) => getUserFetcher(token))

    const setUser = (user: IUser) => {
        // setStoredUser(user)
        mutate([token, 'user'], user)
    }

    if(token) {
        if(data && data._id && data._id !== "") {
            return {
                user: data as IUser,
                setUser,
                isLoading: false,
                error: error || undefined
            }
        }

        // Slight trickery to avoid redirecting to signin while the request is in flight
        if(isLoading) {
            return {
                user: undefined,
                setUser,
                isLoading: true,
                error: undefined
            }
        }
    }

    return {
        user: undefined,
        setUser,
        isLoading: false,
        error: undefined
    }
}

export const useCreator = (handle?: string) => {
    const {data, error, isLoading} = useSWR([handle, 'creator'], ([handle]) => getCreatorFetcher(handle))

    return {
        creator: data as IUser|undefined,
        isLoading,
        error
    }
}

export const useUserSettings = () => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const {data, error, isLoading} = useSWR([token, 'user_settings'], ([token]) => getUserSettingsFetcher(token))

    return {
        settings: data,
        setSettings: (settings: CreatorSettings) => {
            mutate([token, 'user_settings'], settings)
        },
        isLoading,
        error
    }
}

export const useFollow = (handle?: string) => {
    const {user, setUser} = useUser()
    const {token} = useToken()
    const [pending, setPending] = useState(false)

    const isFollowing = !!handle && !!user?.following?.includes(handle)
    const isSelf = !!user?.handle && user.handle === handle

    const toggle = async () => {
        if(!handle || !user || pending) return false
        setPending(true)
        try {
            const ok = isFollowing ? await unfollow(token, handle) : await follow(token, handle)
            if(!ok) return false
            const following = isFollowing ? (user.following ?? []).filter((h) => h !== handle) : [...(user.following ?? []), handle]
            setUser({...user, following})
            mutate([handle, 'creator'], (creator: IUser | undefined) => creator && {
                ...creator,
                followers: isFollowing ? (creator.followers ?? []).filter((id) => id !== user._id) : [...(creator.followers ?? []), user._id!]
            }, { revalidate: false })
            return true
        } finally {
            setPending(false)
        }
    }

    return { isFollowing, isSelf, signedIn: !!user, pending, toggle }
}
