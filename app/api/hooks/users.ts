import { getUser, useUserStore } from "../auth"
import useSWR, { mutate } from 'swr'
import { ICreator, IUser, UserTypes } from "../types"
import { getCreator } from "../community"
import { getContent } from "../content"
import { useEffect } from "react"
import { useLocalStorage } from 'usehooks-ts'

const getUserFetcher = (token: string) => {
    return getUser(token)
}

const getCreatorFetcher = (handle?: string) => {
    if(!handle) return undefined
    return getCreator(handle)
}

const getOwnedCreationsFetcher = (handle: string) => {
    if(!handle) return undefined
    return getContent({contentType: "content", creator: handle, status: 0, limit: 20, page: 0})
}

export const useToken = () => {
    const [token, setToken] = useLocalStorage<string>('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    return { token, setToken }
}

export const useUser = () => {
    const user = useUserStore()
    const setUserStore = useUserStore((state) => state.setUser)
    const [storedUser, setStoredUser] = useLocalStorage<IUser>('user', {
        _id: "",
        username: "",
        email: "",
        type: UserTypes.Account
    })
    const [token, setToken] = useLocalStorage<string>('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const { data, error, isLoading } = useSWR([token, 'user'], ([token]) => getUserFetcher(token))

    const setUser = (user: IUser) => {
        setStoredUser(user)
        setUserStore(user)
    }

    if(user && user._id !== "") {
        return {
            user: user as IUser,
            setUser,
            isLoading: false,
            error: undefined
        }
    }

    if(storedUser) {
        try {
            let user = storedUser
            if(user && user._id !== "") {
                return {
                    user: user as IUser,
                    setUser,
                    isLoading: false,
                    error: undefined
                }
            }
        } catch(e) {
            console.error(e)
        }
    }

    if(token) {
        if(data && data._id !== "") {
            setStoredUser(data)
            return {
                user: data as IUser,
                setUser,
                isLoading: false,
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

export const useUserAlwaysSecure = () => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const { data, error, isLoading } = useSWR([token, 'always_secure'], ([token]) => getUserFetcher(token))
    const setUser = useUserStore((state) => state.setUser)

    if(data && data._id !== "") {
        localStorage?.setItem('user', JSON.stringify(data))
        setUser(data)
    }

    return {
        user: data,
        isLoading,
        error
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

// export const useOwnedCreations = (handle: string) => {
//     const [token] = useLocalStorage('jwt', '')
//     if(!token) {
//         token = sessionStorage?.getItem('temp_key') + ""
//     }

// }
