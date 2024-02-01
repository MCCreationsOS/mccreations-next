import { QueryOptions } from "@/app/types"
import ContentGrid from "../ContentGrid"
import ContentScrollGrid from "../slideshows/ContentScrollGrid"
import { fetchMaps } from "@/app/api/content"
import ContentSlideshow from "../slideshows/ContentSlideshow"

export default async function ContentArea({type, options, playlist, cards}: {type: string, options: QueryOptions, playlist?: string, cards?: string}) {
    let content = (await fetchMaps(options, false)).documents
    if(type === "grid") {
        if(!cards) cards = "four"
        return (
            <>
                <ContentGrid content={content} cards={cards}/>
            </>
        )
    } else if(type === "scroll") {
        return (
            <>
                <ContentSlideshow content={content} playlist={playlist!}/>
            </>
        )
    }
}