
import { UserSettings, UserType } from '@/lib/api'
import { fetcher } from '@/lib/utils'
import useSWR from 'swr'
import { useLocalStorage, useSessionStorage } from 'usehooks-ts'

const getUserFetcher = (token: string) => {
    return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user`, 'GET', null, {
        'Authorization': `${token}`
    })
}

const getCreatorFetcher = (handle?: string) => {
    return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/creator/${handle}`, 'GET', null, {})
}

const getUserSettingsFetcher = (token: string) => {
    return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user/settings`, 'GET', null, {
        'Authorization': `${token}`
    })
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

export const useUser = () => {
    const {token} = useToken()
    const { data, error, isLoading, mutate } = useSWR<UserType>([token, 'user'], ([token]) => getUserFetcher(token))

    const setUser = (user: UserType) => {
        // setStoredUser(user)
        mutate(user)
    }

    if(token) {
        if(data && data._id !== "") {
            // setStoredUser(data)
            return {
                user: data,
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
    const {data, error, isLoading} = useSWR<UserType>([handle, 'creator'], ([handle]) => getCreatorFetcher(handle))

    return {
        creator: data,
        isLoading,
        error
    }
}

export const useUserSettings = () => {
    const [token] = useLocalStorage('jwt', '', {serializer: (value) => value, deserializer: (value) => value})
    const {data, error, isLoading, mutate} = useSWR<UserSettings>([token, 'user_settings'], ([token]) => getUserSettingsFetcher(token))

    return {
        settings: data,
        setSettings: (settings: UserSettings) => {
            mutate(settings)
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
