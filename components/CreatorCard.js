import defaultLogo from 'public/defaultLogo.png'
import Image from 'next/image';

export default function CreatorCard({creator}) {
    let image;
    if(creator.icon) {
        image = creator.icon;
    } else {
        image = defaultLogo
    }

    return (
        <div className="creatorCard">
            <Image src={image} width={50} height={50} className='creatorLogo'></Image>
            <div className="creatorNameStack">
                {creator.username}
            </div>
        </div>
    )
}