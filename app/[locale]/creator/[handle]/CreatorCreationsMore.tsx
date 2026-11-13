'use client'

import { useCreations } from "@/app/api/hooks/creations"
import { CollectionNames } from "@/app/api/types"
import Grid from "@/components/Creations/Grid"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useState } from "react"

export const CREATOR_PAGE_SIZE = 12

function CreatorCreationsPage({handle, contentType, page}: {handle: string, contentType: CollectionNames, page: number}) {
    const {creations} = useCreations({creators: [handle], contentType, limit: CREATOR_PAGE_SIZE, page})
    return <Grid content={creations} />
}

export default function CreatorCreationsMore({handle, contentType, total}: {handle: string, contentType: CollectionNames, total: number}) {
    const t = useTranslations()
    const [pagesShown, setPagesShown] = useState(0)
    const hasMore = (pagesShown + 1) * CREATOR_PAGE_SIZE < total

    return (
        <div className="flex flex-col gap-2 mt-2">
            {Array.from({length: pagesShown}, (_, i) => (
                <CreatorCreationsPage key={i} handle={handle} contentType={contentType} page={i + 1} />
            ))}
            {hasMore && <Button type="button" variant="secondary" className="w-fit mx-auto" onClick={() => setPagesShown(pagesShown + 1)}>
                {t("Pages.Creator.handle.show_more")}
            </Button>}
        </div>
    )
}
