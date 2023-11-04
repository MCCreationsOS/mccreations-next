import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";
import FeaturedCard from "@components/FeaturedCard";
import { getMaps } from "./getData";
import Error from "@components/Error";
import ContentSlideshow from "@components/ContentSlideshow";


export default async function Page() {
    const featured = await getMaps({featured: true, limit: 5})
    const newest = await getMaps({limit: 10})
    const updated = await getMaps({sort: "updated", limit: 10})

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
        <h2 className="playlistHeader">New Content</h2>
        {(newest) ? (<ContentSlideshow limit={10} playlist={"newest"} content={newest.map((map, idx) => <ContentCard key={map._id} content={map} playlist={"newest"} index={idx} priority={true}></ContentCard>)}></ContentSlideshow>) : "MCCreations API Error"}
        <h2 className="playlistHeader">Recently Updated</h2>
        {(updated) ? (<ContentSlideshow limit={10} playlist={"updated"} content={updated.map((content, idx) => <ContentCard key={content._id} content={content} playlist={"updated"} index={idx} priority={false}></ContentCard>)}></ContentSlideshow>): "MCCreations API Error"}
        </>
    )
}