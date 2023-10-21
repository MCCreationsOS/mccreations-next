import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";
import FeaturedCard from "@components/FeaturedCard";

async function getFeatured() {
    let response = await fetch(`${process.env.DATA_URL}/maps?featured=true`)
    let data = await response.json();
    return data;
}

async function getNewest() {
    let response = await fetch(`${process.env.DATA_URL}/maps`)
    let data = await response.json();
    return data
}

async function getUpdated() {
    let response = await fetch(`${process.env.DATA_URL}/maps?updated=true`)
    let data = await response.json();
    return data;
}

export default async function Page() {
    const featured = await getFeatured();
    const newest = await getNewest();
    const updated = await getUpdated();
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