import Rating from '@/components/Rating';
import Image from 'next/image';
import Link from 'next/link';
import { shimmer, toBase64 } from './imageShimmer';
import MenuSkeleton from './MenuSkeleton';

export default async function MapPageSkeleton() {
        return (
            <>
            <MenuSkeleton/>
            <div className='map_page'>
                <Image className='image_background' width={1920} height={1080} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt=""></Image>
                <div className='map_logo_foreground'>
                    <div className='map_logo_container'>
                        <Image className='map_logo' width={1920} height={1080} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt=""></Image>
                    </div>
                </div>
                <div className='centered_content'>
                    <div className='map_title_bar'>
                        <div className="map_title_stack">
                            <h1 className='map_title'></h1>
                        </div>
                        <div className='map_download_stack'>
                            <Rating value={0} content={{slug: ""}} />
                            <button className='main_button'>Download</button>
                        </div>
                    </div>
                    <div className='map_information'>
                        <div className='map_description'>       
                        </div>
                        <div className='map_sidebar'>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Creators</h4>
                            </section>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Stats</h4>
                                <p className='stat_header'>Downloads <span className='stat'>-</span></p>
                                <p className='stat_header'>Ratings <span className='stat'>-</span></p>
                                <p className='stat_header'>Minecraft Version <span className='stat'>-</span></p>
                                <p className='stat_header'>Created Date <span className='stat'>-</span></p>
                                <p className='stat_header'>Updated Date <span className='stat'>-</span></p>
                            </section>
                            <section className='map_sidebar_section'>
                                <h4 className='header'>Files</h4>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )

}