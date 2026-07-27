import { FileListOptions, IFileRecord } from "./types"

export async function listFiles(options: FileListOptions = {}): Promise<{ documents: IFileRecord[], totalCount: number }> {
    const params = new URLSearchParams()
    params.set("limit", (options.limit ?? 20).toString())
    params.set("page", (options.page ?? 0).toString())
    if (options.user) {
        params.set("user", options.user)
    }

    try {
        const res = await fetch(`${process.env.DATA_URL}/files?${params}`, { cache: "no-store" })
        if (!res.ok) {
            return { documents: [], totalCount: 0 }
        }
        const data = await res.json()
        return {
            documents: data.documents ?? data.files ?? [],
            totalCount: data.totalCount ?? data.count ?? 0,
        }
    } catch (e) {
        console.error(e)
        return { documents: [], totalCount: 0 }
    }
}

export async function getFile(id: string): Promise<IFileRecord | undefined> {
    try {
        const res = await fetch(`${process.env.DATA_URL}/file/${id}`, { cache: "no-store" })
        if (!res.ok) return undefined
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

export function getFileDownloadUrl(id: string): string {
    return `${process.env.DATA_URL}/file/${id}/download`
}

export async function updateFile(
    id: string,
    data: Pick<IFileRecord, "filename" | "name" | "mimetype" | "type">,
    token: string,
): Promise<IFileRecord | undefined> {
    try {
        const res = await fetch(`${process.env.DATA_URL}/file/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) return undefined
        return await res.json()
    } catch (e) {
        console.error(e)
    }
}

export async function deleteFile(id: string, token: string): Promise<boolean> {
    try {
        const res = await fetch(`${process.env.DATA_URL}/file/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        })
        return res.ok
    } catch (e) {
        console.error(e)
        return false
    }
}
