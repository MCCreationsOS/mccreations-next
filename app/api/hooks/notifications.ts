import useSWR from "swr"
import { getNotifications } from "../creators"
import { INotification } from "../types"
import { useToken } from "./users"

const notificationsFetcher = (authorization: string, page: number) => {
    return getNotifications(authorization, page)
}

export const useNotifications = (page: number) => {
    const {token} = useToken()
    // The token is part of the key so a different account never sees cached notifications
    const {data, error, isLoading, mutate} = useSWR(token ? ['notifications', token, page] : null, ([, token, page]) => notificationsFetcher(token as string, page as number))
    const notifications = data?.documents as INotification[] | undefined
    return {
        notifications,
        total: data?.totalCount as number | undefined,
        /** Updates the loaded notifications locally without refetching */
        setNotifications: (updated: INotification[]) => mutate({...data, documents: updated}, { revalidate: false }),
        refresh: () => mutate(),
        isLoading,
        error
    }
}
