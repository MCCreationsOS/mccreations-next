import { IComment, IContentDoc } from "@/app/api/types"
import ContentCard from "../ContentSlideshow/ContentCard"
import CommentCard from "../Comment/CommentCard"

export default function FeedGrid({content, linkTo, cards, enableSelection, enableAds}: {content: IContentDoc[], linkTo?: string, cards?: string, enableSelection?: boolean, enableAds?: boolean}) {
    let adPosition = Math.floor(Math.random() * 15) + 2

    if(!enableAds) {
        adPosition = -1
    }
    
    return (
        <div className={(cards) ? 'content_grid ' + cards : 'content_grid'}>
            {content && content.map((content: IContentDoc | IComment, idx: number) => {
                if('comment' in content) {
                    return <CommentCard key={content._id} comment={content} contentType={content.content_type} handle={content.handle} canReply={true} />
                }
                if('images' in content) {
                    return <ContentCard adPosition={adPosition} key={content._id} content={content} priority={true} playlist={"none"} index={idx} linkTo={linkTo} enableSelection={enableSelection}></ContentCard>
                }
            })}
        </div>
    )
}