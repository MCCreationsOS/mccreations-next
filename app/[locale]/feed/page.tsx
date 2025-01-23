'use client'

import { useFeed } from "@/app/api/hooks/creations"
import PageNavigator from "@/components/Content/Search/Navigator"
import FeedGrid from "@/components/Grids/FeedGrid"
import { useSearchParams } from "next/navigation"

export default function Feed() {
    const page = parseInt(useSearchParams().get('page') ?? '0')
    const {feed, count} = useFeed(20, page)

    if (!feed || 'error' in feed) {
        return <div className="centered_content">
            <h1>No feed found</h1>
            <p>Sign in and subscribe to creators to see your feed!</p>
        </div>
    }

    if(count === 0) return <div className="centered_content">
        <h1>No feed found</h1>
        <p>Follow creators to see their creations in your feed!</p>
    </div>

    return <>
        <FeedGrid content={feed} />
        <PageNavigator page={page} pages={Math.ceil(count / 20)} />
    </>
}