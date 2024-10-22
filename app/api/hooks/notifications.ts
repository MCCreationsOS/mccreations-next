import useSWR from "swr"
import { getNotifications } from "../creators"
import { INotification } from "../types"

const notificationsFetcher = (authorization: string, user_id: string) => {
    return getNotifications(authorization, user_id + "")
}

export const useNotifications = (user_id: string) => {
    const authorization = localStorage.getItem('jwt') + ""
    const {data, error, isLoading} = useSWR(['notifications', user_id], ([key, user_id]) => notificationsFetcher(authorization, user_id))
    return {
        notifications: data as INotification[]|undefined,
        isLoading,
        error
    }
}