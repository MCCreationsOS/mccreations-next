import { getUser, useUserStore } from "../auth"
import useSWR, { mutate } from 'swr'
import { ICreator, IUser } from "../types"
import { getCreator } from "../community"
import { getContent } from "../content"
const getUserFetcher = (token: string) => {
    return getUser(token)
}

const getStoredUserFetcher = () => {
    const user = useUserStore() as IUser
    if(user._id === "") {
        return JSON.parse(localStorage?.getItem('user') + "")
    }
    return user
}

const getCreatorFetcher = (handle?: string) => {
    if(!handle) return undefined
    return getCreator(handle)
}

const getOwnedCreationsFetcher = (handle: string) => {
    if(!handle) return undefined
    return getContent({contentType: "content", creator: handle, status: 0, limit: 20, page: 0})
}

export const useUser = () => {
    const { data, error, isLoading } = useSWR(['stored_user'], getStoredUserFetcher)

    let token = localStorage?.getItem('jwt') + ""
    if(token) {
        getUserFetcher(token).then((user) => {
            if(user) {
                mutate(user)
            } else {
                localStorage.removeItem('jwt')
                localStorage.removeItem('user')
                mutate(null)
            }
        })
    }

    return {
        user: data,
        isLoading,
        error
    }
}

export const useUserAlwaysSecure = () => {
    const token = localStorage?.getItem('jwt') + ""
    const { data, error, isLoading } = useSWR([token, 'always_secure'], ([token]) => getUserFetcher(token))
    const setUser = useUserStore((state) => state.setUser)

    if(data && data._id !== "") {
        localStorage.setItem('user', JSON.stringify(data))
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

export const useOwnedCreations = (handle: string) => {
    let token = localStorage?.getItem('jwt')
    if(!token) {
        token = sessionStorage?.getItem('temp_key') + ""
    }

}
