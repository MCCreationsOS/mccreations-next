import { IComment, IContentDoc } from "@/app/api/types"
import CreationCard from "./Cards/Card"
import { Comment } from "./Page/Comments"

export default function FeedGrid({content, linkTo}: {content: (IContentDoc | IComment)[], linkTo?: string}) {
    return (
        <div className="@container">
                <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @4xl:grid-cols-4 gap-2 w-full">
                    {content && content.map((content: IContentDoc | IComment, idx: number) => {
                        if('comment' in content) {
                            return <Comment key={content._id} comment={content} />
                        }
                        if('images' in content) {
                            return <CreationCard key={content._id} creation={content} priority={idx < 4} playlist={"feed"} index={idx} linkTo={linkTo}></CreationCard>
                        }
                    })}
                </div>
            </div>
    )
}
