import { IMap } from "@/app/types"
import ContentScrollCard from "../cards/ContentScrollCard"

export default function ContentScrollGrid({content}: {content: IMap[]}) {
    return (
        <div className='content_scroll_grid'>
            {content.map((map: IMap, idx: number) => <ContentScrollCard key={idx} map={map} priority={false} id={""}></ContentScrollCard>)}
        </div>
    )
}