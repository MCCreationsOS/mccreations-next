import { IContentDoc } from "@/app/api/types"
import ContentCard from "./ContentSlideshow/ContentCard"

export default function ContentGrid({content, linkTo, cards}: {content: IContentDoc[], linkTo?: string, cards?: string}) {
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content && content.map((map: IContentDoc, idx: number) => <ContentCard key={idx} content={map} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={true}></ContentCard>)}
        </div>
    )
}