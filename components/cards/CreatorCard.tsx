import defaultLogo from 'public/defaultLogo.png'
import Image from 'next/image';
import { ICreator } from '@/app/types';
import { getCreator } from '@/app/api/community';

export default async function CreatorCard({creator}: {creator: ICreator}) {
    console.log(creator)
    let image
    if(creator.handle) {
        image = (await getCreator(creator.handle)).iconURL
    } else {
        image = defaultLogo
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