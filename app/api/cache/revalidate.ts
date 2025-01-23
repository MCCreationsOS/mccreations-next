import { revalidatePath } from "next/cache"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get('path')
    if(!path) return new Response('No path provided', { status: 400 })
    await revalidatePath(path)
    return new Response('Revalidated', { status: 200 })
}