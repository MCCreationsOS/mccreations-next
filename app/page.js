import Menu from "@components/Menu"
import ContentGrid from "@components/ContentGrid";
import ContentCard from "@components/ContentCard";

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
    let featured = await getFeatured();
    const maps = await getMaps();
    return (
        <>
        <Menu selectedPage='home'></Menu>
        <div className='featuredCard'>
            <img className="featuredBackground" src={featured[0].images[0]}></img>
            <div className="featuredText">
                <img className="featuredImage" src={featured[0].images[0]}></img>
                <h2>{featured[0].title}</h2>
                <p>{featured[0].shortDescription}</p>
                <p>{featured[0].creators[0].username}</p>
            </div>
        </div>
        <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}>
                    
        </ContentGrid>
        </>
    )
}