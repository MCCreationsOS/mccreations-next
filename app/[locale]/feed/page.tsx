'use client'

import { useFeed } from "@/app/api/hooks/creations"
import { useToken, useUser } from "@/app/api/hooks/users"
import FeedGrid from "@/components/Creations/FeedGrid"
import PageNavigator from "@/components/Creations/Search/Navigator"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

function Message({title, description, action}: {title: string, description: string, action?: React.ReactNode}) {
    return <div className="max-w-xl w-full mx-auto my-10 px-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p>{description}</p>
        {action}
    </div>
}

export default function Feed() {
    const page = parseInt(useSearchParams().get('page') ?? '0') || 0
    const {token} = useToken()
    const {user, isLoading: userLoading} = useUser()
    const {feed, count, isLoading} = useFeed(20, page)
    const t = useTranslations()

    if (userLoading || (token && isLoading)) {
        return <div className="centered_content">{t("Pages.Feed.loading")}</div>
    }

    if (!user) {
        return <Message
            title={t("Pages.Feed.sign_in_title")}
            description={t("Pages.Feed.sign_in_description")}
            action={<Button asChild className="w-fit"><Link href="/signin?redirect=feed">{t("Pages.Feed.sign_in")}</Link></Button>}
        />
    }

    if (!feed || 'error' in feed) {
        return <Message title={t("Pages.Feed.not_found_title")} description={t("Pages.Feed.not_found_description")} />
    }

    if (count === 0 || feed.length === 0) {
        return <Message title={t("Pages.Feed.empty_title")} description={t("Pages.Feed.empty_description")} />
    }

    return <div className="p-2">
        <FeedGrid content={feed} />
        <PageNavigator page={page} pages={Math.ceil(count / 20)} className="mt-4" />
    </div>
}
