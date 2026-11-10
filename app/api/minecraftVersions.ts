export async function getMinecraftVersions(search?: string, types?: string[], sort?: "newest" | "oldest", page?: number, limit?: number) {
    const params = new URLSearchParams({
        search: search ?? "",
        types: types?.join(",") ?? "",
        sort: sort ?? "newest",
        page: String(page ?? 1),
        limit: String(limit ?? 10)
    })
    const res = await fetch(`${process.env.DATA_URL}/minecraftVersions?${params}`)
    if(!res.ok) {
        throw new Error("Failed to fetch minecraft versions")
    }
    return res.json()
}


