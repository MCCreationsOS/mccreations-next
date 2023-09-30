import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";
import FeaturedCard from "@components/FeaturedCard";

async function getFeatured() {
    let response = await fetch('http://localhost:3001/maps?featured=true')
    let data = await response.json();
    return data.maps;
}

async function getMaps() {
    let response = await fetch('http://localhost:3001/maps')
    let data = await response.json();
    return data.maps
}

export default async function Page() {
    const featured = await getFeatured();
    const maps = await getMaps();
    
    return (
        <>
        <Menu selectedPage='home'></Menu>
        <FeaturedCard featured={featured} />
        <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}>
                    
        </ContentGrid>
        </>
    )
}