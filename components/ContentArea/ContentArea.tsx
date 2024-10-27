import { QueryOptions } from "@/app/api/types"
import ContentGrid from "../Grids/ContentGrid"
import ContentScrollGrid from "../ContentScrollBackground/ContentScrollGrid"
import { getContent, searchContent } from "@/app/api/content"
import ContentSlideshow from "../ContentSlideshow/ContentSlideshow"

/**
 * The Content Area component displays a grid or a scroll of content
 * @param type The type of content to display
 * @param options The options for the content to display
 * @param playlist The playlist identifier if the type is scroll
 * @param cards The number of cards to display if the type is grid
 */
export default async function ContentArea({type, options, filterOptions, playlist, cards, no_search, enableSelection}: {type: string, options: QueryOptions, filterOptions?: QueryOptions, playlist?: string, cards?: string, no_search?: boolean, enableSelection?: boolean}) {
    let content = (!no_search) ? (await searchContent(options, false, filterOptions)).documents : (await getContent(options)).documents
    if(type === "grid") {
        if(!cards) cards = "four"
        return (
            <>
                <ContentGrid content={content} cards={cards} enableSelection={enableSelection}/>
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