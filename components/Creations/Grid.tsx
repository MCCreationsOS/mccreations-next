"use client"

import { IContentDoc } from "@/app/api/types"
import CreationCard from "./Cards/Card"
import { useGridView } from "@/app/api/hooks/grids"
import CreationListCard from "./Cards/ListCard"

export default function ContentGrid({content, linkTo, enableSelection, enableAds, showCategory}: {content: IContentDoc[], linkTo?: string, enableSelection?: boolean, enableAds?: boolean, showCategory?: boolean}) {
    const {gridView} = useGridView()
    let adPosition = Math.floor(Math.random() * 15) + 2

    if(!enableAds) {
        adPosition = -1
    }

    if(gridView === "grid") {
        return (
            <div className="@container">
                <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 gap-2 w-full">
                    {content && content.map((map: IContentDoc, idx: number) => {
                        return (
                            <CreationCard adPosition={adPosition} key={map._id} creation={map} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection} showCategory={showCategory}></CreationCard>
                        )
                    })}
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-2 w-full">
            {content && content.map((map: IContentDoc, idx: number) => {
                return <CreationListCard adPosition={adPosition} key={map._id} creation={map} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection} showCategory={showCategory}></CreationListCard>
            })}
        </div>
    )
}