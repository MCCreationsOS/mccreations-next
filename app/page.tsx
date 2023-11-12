import Menu from "@/components/Menu"
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/cards/ContentCard";
import FeaturedCard from "@/components/slideshows/FeaturedSlideshow";
import { fetchMaps } from "@/app/getData";
import Error from "@/components/Error";
import ContentSlideshow from "@/components/slideshows/ContentSlideshow";
import './styles/homepage.css'
import { IMap, SortOptions } from "./types";


export default async function Page() {
    const featured = await fetchMaps({featured: true, limit: 5}, false)
    const newest = await fetchMaps({limit: 10}, false)
    const updated = await fetchMaps({sort: SortOptions.Updated, limit: 10}, false)

    if(featured.error || newest.error || updated.error) {
        let msgBase = "MCCreations API Error! Failed to fetch featured, newest or updated on the homepage. Query was "
        return (
            <>
                <Menu selectedPage='home'></Menu>
                <Error message={(featured.error) ? msgBase + JSON.stringify(featured.query) : (newest.error) ? msgBase + JSON.stringify(newest.query) : msgBase + JSON.stringify(updated.query)}></Error>
            </>
        )
    }
    return (
        <>
        <Menu selectedPage='home'></Menu>
        {(featured) ? (<FeaturedCard allFeatured={featured} />) : "MCCreations API Error"}
        <h2 className="playlist_header">New Content</h2>
        {(newest) ? (<ContentSlideshow playlist={"newest"} content={newest.map((map: IMap, idx: number) => <ContentCard key={map._id} content={map} playlist={"newest"} index={idx} priority={true}></ContentCard>)}></ContentSlideshow>) : "MCCreations API Error"}
        <h2 className="playlist_header">Recently Updated</h2>
        {(updated) ? (<ContentSlideshow playlist={"updated"} content={updated.map((map: IMap, idx: number) => <ContentCard key={map._id} content={map} playlist={"updated"} index={idx} priority={false}></ContentCard>)}></ContentSlideshow>): "MCCreations API Error"}
        </>
    )
}