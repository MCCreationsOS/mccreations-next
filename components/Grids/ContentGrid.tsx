import { IContentDoc } from "@/app/api/types"
import ContentCard from "../ContentSlideshow/ContentCard"

export default function ContentGrid({content, linkTo, cards, enableSelection, enableAds, showCategory}: {content: IContentDoc[], linkTo?: string, cards?: string, enableSelection?: boolean, enableAds?: boolean, showCategory?: boolean}) {
    let adPosition = Math.floor(Math.random() * 15) + 2

    if(!enableAds) {
        adPosition = -1
    }
    
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content && content.map((map: IContentDoc, idx: number) => {
                return (
                    <ContentCard adPosition={adPosition} key={map._id} content={map} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection} showCategory={showCategory}></ContentCard>
                )
            })}
        </div>
    )
}