import { QueryOptions } from "@/app/api/types"
import ContentGrid from "../Grids/ContentGrid"
import ContentScrollGrid from "../ContentScrollBackground/ContentScrollGrid"
import { searchContent } from "@/app/api/content"
import ContentSlideshow from "../ContentSlideshow/ContentSlideshow"

/**
 * The Content Area component displays a grid or a scroll of content
 * @param type The type of content to display
 * @param options The options for the content to display
 * @param playlist The playlist identifier if the type is scroll
 * @param cards The number of cards to display if the type is grid
 */
export default async function ContentArea({type, options, filterOptions, playlist, cards, enableSelection, enableAds}: {type: string, options: QueryOptions, filterOptions?: QueryOptions, playlist?: string, cards?: string, enableSelection?: boolean, enableAds?: boolean}) {
    let content = (await searchContent(options, false, filterOptions)).documents
    if(type === "grid") {
        if(!cards) cards = "four"
        return (
            <>
                <ContentGrid content={content} cards={cards} enableSelection={enableSelection} enableAds={enableAds}/>
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