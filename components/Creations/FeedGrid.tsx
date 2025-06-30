import { IComment, IContentDoc } from "@/app/api/types"
import CreationCard from "./Cards/Card"
import { Comment } from "./Page/Comments"

export default function FeedGrid({content, linkTo, cards, enableSelection, enableAds}: {content: IContentDoc[], linkTo?: string, cards?: string, enableSelection?: boolean, enableAds?: boolean}) {
    let adPosition = Math.floor(Math.random() * 15) + 2

    if(!enableAds) {
        adPosition = -1
    }
    
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content && content.map((content: IContentDoc | IComment, idx: number) => {
                if('comment' in content) {
                    return <Comment key={content._id} comment={content} />
                }
                if('images' in content) {
                    return <CreationCard adPosition={adPosition} key={content._id} creation={content} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection}></CreationCard>
                }
            })}
        </div>
    )
}