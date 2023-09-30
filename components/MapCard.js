import Link from "next/link";

export default function MapCard({map}) {

    let authorLink = map.creators[0].link;
    if(!authorLink || authorLink.length <= 0 || map.creators[0].hasMatchingUser) {
        authorLink = "/creators/" + map.creators[0].username
    }

    return (

            <div className='contentCard' >
                <div className="cardLogoFloat">
                    <div className='cardDescription'>
                        {map.shortDescription}
                        <div className='cardStats'>
                            <div className="cardStat"><img className="inTextIcon" src='/download.svg'></img>{map.downloads}</div>
                            <div className="cardStat"><img className="inTextIcon" src='/heart.svg'></img>{map.likes}</div>
                            <div className='cardStat'><img className="inTextIcon" src='/map.svg'></img>{map.files[0].minecraftVersion}</div>
                        </div>
                    </div>
                    <img className='cardImage' src='/thetroleyprolem2.png'></img>
                </div>
                <Link className='cardTitle' href={`/maps/${map.slug}`}>{map.title}</Link>
                <p className='cardAuthor'>by <Link href={authorLink} className='cardAuthorLink'>{map.creators[0].username}</Link></p>
            </div>
    )
}