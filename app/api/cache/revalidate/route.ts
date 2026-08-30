'use server'

import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get('tag')

    if (tag) {
        revalidateTag(tag, 'max')
        return Response.json({revalidated: true})
    }

    return Response.json({revalidated: false})
}