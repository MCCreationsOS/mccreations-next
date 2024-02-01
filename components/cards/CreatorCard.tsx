import defaultLogo from 'public/defaultLogo.png'
import Image, { StaticImageData } from 'next/image';
import { ICreator } from '@/app/types';
import { getCreator } from '@/app/api/community';

export default async function CreatorCard({creator}: {creator: ICreator}) {
    let image: string | StaticImageData = ""
    if(creator.handle) {
        let realCreator = await getCreator(creator.handle);
        if(realCreator && realCreator.iconURL) {
            image = realCreator.iconURL
        }
    } else {
        image = "/defaultLogo.png"
    }

    return (
        <div className="creator_card">
            <Image src={image} width={50} height={50} className='logo' alt={`${creator.username}'s logo`}></Image>
            <div>
                {creator.username}
            </div>
        </div>
    )
}