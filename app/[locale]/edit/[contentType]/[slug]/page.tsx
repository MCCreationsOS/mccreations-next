'use client'

import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import General from "./general/page"

export default function EditContentPage({params}: {params: Params}) {
    return <General params={params} />
}