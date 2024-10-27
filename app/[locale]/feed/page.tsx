'use client'

import { useFeed } from "@/app/api/hooks/creations"
import FeedGrid from "@/components/Grids/FeedGrid"
import { useSearchParams } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function Feed() {
    const page = parseInt(useSearchParams().get('page') ?? '0')
    const {feed} = useFeed(20, page)

    if (!feed || 'error' in feed) {
        return <div className="centered_content">
            <h1>No feed found</h1>
            <p>Sign in and subscribe to creators to see your feed!</p>
        </div>
    }

    return <>
        <FeedGrid content={feed} />
    </>
}