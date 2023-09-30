export default function FeaturedCard({featured}) {
    return (
    <div className='featuredCard'>
            <img className="featuredBackground" src={featured[0].images[0]}></img>
            <div className="featuredText">
                <img className="featuredImage" src={featured[0].images[0]}></img>
                <h2 className="featuredTitle">{featured[0].title}</h2>
                <p className="featuredDescription">{featured[0].shortDescription}</p>
                <p className="featuredAuthor">by {featured[0].creators[0].username}</p>
                <div className='cardStats'>
                            <div className="cardStat"><img className="inTextIcon" src='/download.svg'></img>{featured[0].downloads}</div>
                            <div className="cardStat"><img className="inTextIcon" src='/heart.svg'></img>{featured[0].likes}</div>
                            <div className='cardStat'><img className="inTextIcon" src='/map.svg'></img>{featured[0].files[0].minecraftVersion}</div>
                </div>
                <button className="featuredDownloadButton">Download</button>
            </div>
        </div>
    )
}
