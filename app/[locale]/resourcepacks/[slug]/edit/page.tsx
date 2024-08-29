'use client'

import { CollectionNames } from "@/app/api/types"
import EditContentPage from "@/components/Content/Edit"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"

export default function EditPage({params}: {params: Params}) {
    return (
        <>
        <EditContentPage params={params} contentType={CollectionNames.Resourcepacks} />
        </>
    )
}