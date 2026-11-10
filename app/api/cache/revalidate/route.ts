import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

/**
 * Purges a cache tag. Only the API may call this: it must send the shared secret in the
 * `x-revalidate-secret` header (REVALIDATE_SECRET must be set to the same value on both sides).
 * Fails closed if the secret isn't configured.
 */
function isAuthorized(request: NextRequest) {
    const expected = process.env.REVALIDATE_SECRET
    const provided = request.headers.get('x-revalidate-secret')
    if (!expected || !provided) return false

    const a = Buffer.from(provided)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(request: NextRequest) {
    if (!isAuthorized(request)) {
        return Response.json({ revalidated: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tag = request.nextUrl.searchParams.get('tag')

    if (tag) {
        revalidateTag(tag, 'max')
        return Response.json({ revalidated: true })
    }

    return Response.json({ revalidated: false }, { status: 400 })
}
