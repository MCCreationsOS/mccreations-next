import useSWR from "swr"
import { listFiles } from "../files"
import { FileListOptions } from "../types"
import { useToken } from "./users"

export const useFiles = (options: FileListOptions) => {
    const { token } = useToken()
    const key = token ? ["files", token, options.page, options.limit, options.user] : null
    const { data, error, isLoading, mutate } = useSWR(key, () => listFiles(options, token))

    return {
        files: data?.documents,
        total: data?.totalCount ?? 0,
        isLoading,
        error,
        refresh: () => mutate(),
    }
}
