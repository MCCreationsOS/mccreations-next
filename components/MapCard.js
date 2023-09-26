import Link from "next/link";

export default function MapCard({map}) {
    return (

            <div className='mapCard' >
                <div className='mapCardDesc'>
                    {map.shortDescription}
                    <div className='mapStats'>
                        <div className="mapStat"><img src='/download.svg'></img>{map.downloads}</div>
                        <div className="mapStat"><img src='/heart.svg'></img>{map.likes}</div>
                    </div>
                    <div className='version'>{map.files[0].minecraftVersion}</div>
                </div>
                <img className='mapLogo' src='/thetroleyprolem2.png'></img>
                <Link className='mapTitle' href={`/maps/${map.slug}`}>{map.title}</Link>
                <p className='mapAuthor'>by <a className='mapAuthorLink'>{map.creators[0].username}</a></p>
            </div>
    )
}