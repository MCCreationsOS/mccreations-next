import useSWR, { mutate } from "swr"
import { listFiles } from "../files"
import { FileListOptions } from "../types"

export const useFiles = (options: FileListOptions) => {
    const { data, error, isLoading } = useSWR(
        ["files", options.page, options.limit, options.user],
        () => listFiles(options),
    )

    return {
        files: data?.documents,
        total: data?.totalCount ?? 0,
        isLoading,
        error,
        refresh: () => mutate(["files", options.page, options.limit, options.user]),
    }
}
