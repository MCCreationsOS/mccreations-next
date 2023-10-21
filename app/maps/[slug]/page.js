import Menu from '@components/Menu';
import Rating from '@components/Rating';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import CreatorCard from '@components/CreatorCard';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

async function getMap(slug) {
    let response = await fetch(`${process.env.DATA_URL}/maps/${slug}`)
    let data = await response.json();
    return data
}

export default async function Page({params}) {
    const map = await getMap(params.slug)

    const ratingUpdate = (value) => {
        console.log("Set rating to " + value)
    }

    if(map) {
        return (
            <>
            <Menu></Menu>
            <div className='mapPage'>
                <img className='mapPageBackground' src={map.images[0]}></img>
                <div className='mapPageForeground'>
                    <div className='mapPageLogoContainer'>
                        <img className='mapPageLogo'  src={map.images[0]}></img>
                    </div>
                </div>
                <div className='mapInfo'>
                    <div className='mapPageTitleInfo'>
                        <div className="mapTitleStack">
                            <h1 className='mapPageTitle'>{map.title}</h1>
                        </div>
                        <div className='mapPageDownloadStack'>
                            <Rating value={0.5} contentId={map._id} />
                            <button className='buttonMain'>Download</button>
                        </div>
                    </div>
                    <div className='mapVideo'></div>
                    <div className='mapDescription'>
                        <div className='mapDescriptionContent' dangerouslySetInnerHTML={{__html: purify.sanitize(map.description)}}>       
                        </div>
                        <div className='mapCreators'>
                            <section>
                                <h4 className='mapCreatorsHeader'>Creators</h4>
                                {map.creators.map((creator, idx) => <CreatorCard key={idx} creator={creator} />)}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    } else {
        return (
            <div>
                <h1>Map Not Found</h1>
            </div>
        )
    }

}