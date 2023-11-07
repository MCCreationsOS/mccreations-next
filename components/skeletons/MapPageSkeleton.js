import Menu from '@components/Menu';
import Rating from '@components/Rating';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import Link from 'next/link';
import { shimmer, toBase64 } from './imageShimmer';

export default async function MapPageSkeleton({params}) {
        return (
            <>
            <Menu></Menu>
            <div className='mapPage'>
                <Image className='mapPageBackground' width={1920} height={1080} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt=""></Image>
                <div className='mapPageForeground'>
                    <div className='mapPageLogoContainer'>
                        <Image className='mapPageLogo' width={1920} height={1080} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt=""></Image>
                    </div>
                </div>
                <div className='mapInfo'>
                    <div className='mapPageTitleInfo'>
                        <div className="mapTitleStack">
                            <h1 className='mapPageTitle'></h1>
                        </div>
                        <div className='mapPageDownloadStack'>
                            <Rating value={0} content={{slug: ""}} />
                            <button className='main_button'>Download</button>
                        </div>
                    </div>
                    <div className='mapDescription'>
                        <div className='mapDescriptionContent'>       
                        </div>
                        <div className='mapSidebar'>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Creators</h4>
                            </section>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Stats</h4>
                                <p className='mapSidebarStatHeader'>Downloads <span className='mapSidebarStat'>-</span></p>
                                <p className='mapSidebarStatHeader'>Ratings <span className='mapSidebarStat'>-</span></p>
                                <p className='mapSidebarStatHeader'>Minecraft Version <span className='mapSidebarStat'>-</span></p>
                                <p className='mapSidebarStatHeader'>Created Date <span className='mapSidebarStat'>-</span></p>
                                <p className='mapSidebarStatHeader'>Updated Date <span className='mapSidebarStat'>-</span></p>
                            </section>
                            <section className='mapSidebarSection'>
                                <h4 className='mapSidebarHeader'>Files</h4>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )

}