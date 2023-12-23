import { IMap } from "@/app/types"
import ContentCard from "./cards/ContentCard"

export default function ContentGrid({content, cards}: {content: IMap[], cards?: string}) {
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content.map((map: IMap, idx: number) => <ContentCard key={idx} content={map} priority={true} playlist={"none"} index={idx}></ContentCard>)}
        </div>
    )
}