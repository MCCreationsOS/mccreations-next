import useSWR from "swr"
import { getNotifications } from "../creators"
import { INotification } from "../types"
import { useToken } from "./users"

const notificationsFetcher = (authorization: string, page: number) => {
    return getNotifications(authorization, page)
}

export const useNotifications = (page: number) => {
    const {token} = useToken()
    const {data, error, isLoading} = useSWR(['notifications', page], ([key, page]) => notificationsFetcher(token, page))
    return {
        notifications: data?.documents as INotification[]|undefined,
        isLoading,
        error
    }
}