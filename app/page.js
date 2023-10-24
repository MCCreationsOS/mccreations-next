import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";
import FeaturedCard from "@components/FeaturedCard";
import { getMaps } from "./getData";


export default async function Page() {
    const featured = await getMaps({featured: true, limit: 5})
    const newest = await getMaps({limit: 10})
    const updated = await getMaps({sort: "updated", limit: 10})
    return (
        <>
        <Menu selectedPage='home'></Menu>
        <FeaturedCard allFeatured={featured} />
        <h2 className="playlistHeader">New Content</h2>
        <ContentGrid content={newest.map(map => <ContentCard key={map._id} content={map}></ContentCard>)}></ContentGrid>
        <h2 className="playlistHeader">Recently Updated</h2>
        <ContentGrid content={updated.map(content => <ContentCard key={content._id} content={content}></ContentCard>)}></ContentGrid>
        </>
    )
}