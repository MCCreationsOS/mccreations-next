'use client'

import { useFeed } from "@/app/api/hooks/creations"
import FeedGrid from "@/components/Creations/FeedGrid"
import PageNavigator from "@/components/Creations/Search/Navigator"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function Feed() {
    const page = parseInt(useSearchParams().get('page') ?? '0')
    const {feed, count} = useFeed(20, page)
    const t = useTranslations()

    if (!feed || 'error' in feed) {
        return <div className="w-1/2 mx-auto my-10">
            <h1>{t("Pages.Feed.not_found_title")}</h1>
            <p>{t("Pages.Feed.not_found_description")}</p>
        </div>
    }

    if(count === 0) return <div className="w-1/2 mx-auto my-10">
        <h1>{t("Pages.Feed.not_found_title")}</h1>
        <p>{t("Pages.Feed.not_found_description")}</p>
    </div>

    return <>
        <FeedGrid content={feed} />
        <PageNavigator page={page} pages={Math.ceil(count / 20)} />
    </>
}