import { IContentDoc } from "@/app/api/types"
import ContentCard from "./ContentSlideshow/ContentCard"

export default function ContentGrid({content, linkTo, cards, enableSelection}: {content: IContentDoc[], linkTo?: string, cards?: string, enableSelection?: boolean}) {
    const adPosition = Math.floor(Math.random() * 15) + 2
    
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content && content.map((map: IContentDoc, idx: number) => {
                return (
                    <ContentCard adPosition={adPosition} key={idx} content={map} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection}></ContentCard>
                )
            })}
        </div>
    )
}