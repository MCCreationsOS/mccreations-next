import Link from "next/link";

export default function MapCard({map}) {
    return (

            <div className='mapCard' >
                <img className='mapLogo' src='/thetroleyprolem2.png'></img>
                <h4 className='mapCardTitle'>
                    <Link href={`/maps/${map.slug}`}>{map.title}</Link>
                </h4>
                <p className='mapAuthor'>by <a>{map.creators[0].username}</a></p>
                <div className='mapCardDesc'>{map.shortDescription}</div>
                <div className='mapStats'>
                    <div className="mapStat"><img src='/download.svg'></img>{map.downloads}</div>
                    <div className="mapStat"><img src='/heart.svg'></img>{map.likes}</div>
                </div>
                <div className='version'>{map.files[0].minecraftVersion}</div>
            </div>
    )
}