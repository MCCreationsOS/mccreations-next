import defaultLogo from 'public/defaultLogo.png'
import Image from 'next/image';
import { ICreator } from '@/app/types';

export default function CreatorCard({creator}: {creator: ICreator}) {
    let image;
    if(creator.icon) {
        image = creator.icon;
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