import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";

async function getFeatured() {
    let response = await fetch('http://localhost:3001/image')
    let data = await response.json();
    return data.image;
}

async function getMaps() {
    let response = await fetch('http://localhost:3001/maps')
    let data = await response.json();
    return data.maps
}

export default async function Page() {
    let image = await getFeatured();
    const maps = await getMaps();
    return (
        <>
        <Menu selectedPage='home'></Menu>
        <div className='featuredCard'>
            <img className="featuredImage" src={"data:image/jpeg;base64," + image}></img>
            <div className="featuredText">
                <h2>Biome Pets 12</h2>
                <p>The epic finale to the titular Minecraft Series</p>
            </div>
        </div>
        <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}>
                    
        </ContentGrid>
        </>
    )
}