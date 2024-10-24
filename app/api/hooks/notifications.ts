import useSWR from "swr"
import { getNotifications } from "../creators"
import { INotification } from "../types"

const notificationsFetcher = (authorization: string, user_id: string, page: number) => {
    return getNotifications(authorization, user_id + "", page)
}

export const useNotifications = (user_id: string, page: number) => {
    const authorization = localStorage?.getItem('jwt') + ""
    const {data, error, isLoading} = useSWR(['notifications', user_id, page], ([key, user_id, page]) => notificationsFetcher(authorization, user_id, page))
    return {
        notifications: data as INotification[]|undefined,
        isLoading,
        error
    }
}