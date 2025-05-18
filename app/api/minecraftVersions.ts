export async function getMinecraftVersions(search?: string, filter?: string[], sort?: "newest" | "oldest", page?: number, limit?: number) {
    const res = await fetch(`${process.env.DATA_URL}/minecraftVersions?search=${search ?? ""}&filter=${filter?.join(",") ?? ""}&sort=${sort ?? "newest"}&page=${page ?? 0}&limit=${limit ?? 10}`)
    if(!res.ok) {
        throw new Error("Failed to fetch minecraft versions")
    }
    return res.json()
}


