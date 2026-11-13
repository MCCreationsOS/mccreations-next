"use client"

import { IContentDoc } from "@/app/api/types"
import CreationCard from "./Cards/Card"
import { useGridView } from "@/app/api/hooks/grids"
import CreationListCard from "./Cards/ListCard"

export default function ContentGrid({content, linkTo, showCategory, playlist}: {content: IContentDoc[], linkTo?: string, showCategory?: boolean, playlist?: string}) {
    const {gridView} = useGridView()

    if(gridView === "grid") {
        return (
            <div className="@container">
                <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 gap-2 w-full">
                    {content && content.map((map: IContentDoc, idx: number) => {
                        return (
                            <CreationCard key={map._id} creation={map} priority={idx < 4} playlist={playlist ?? "none"} index={idx} linkTo={linkTo} showCategory={showCategory}></CreationCard>
                        )
                    })}
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-2 w-full">
            {content && content.map((map: IContentDoc, idx: number) => {
                return <CreationListCard key={map._id} creation={map} priority={idx < 4} playlist={playlist ?? "none"} index={idx} linkTo={linkTo} showCategory={showCategory}></CreationListCard>
            })}
        </div>
    )
}
