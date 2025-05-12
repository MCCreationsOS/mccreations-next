import { getUser } from "../auth"
import useSWR, { mutate } from 'swr'
import { CreatorSettings, ICreator, IUser, UserTypes } from "../types"
import { getCreator } from "../community"
import { useEffect } from "react"
import { useIsClient, useLocalStorage, useSessionStorage } from 'usehooks-ts'
import { searchContent } from "../content"
import { getUserSettings } from "../creators"

const getUserFetcher = (token: string) => {
    return getUser(token)
}

const getCreatorFetcher = (handle?: string) => {
    if(!handle) return undefined
    return getCreator(handle)
}

const getOwnedCreationsFetcher = (handle: string) => {
    if(!handle) return undefined
    return searchContent({contentType: "content", creators: [handle], status: 0, limit: 20, page: 0}, false)
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
        if(data && data._id !== "") {
            // setStoredUser(data)
            return {
                user: data as IUser,
                setUser,
                isLoading: isLoading || false,
                error: error || undefined
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

// export const useOwnedCreations = (handle: string) => {
//     const [token] = useLocalStorage('jwt', '')
//     if(!token) {
//         token = sessionStorage?.getItem('temp_key') + ""
//     }

// }
