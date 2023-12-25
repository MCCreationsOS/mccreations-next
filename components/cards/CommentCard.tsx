import defaultLogo from 'public/defaultLogo.png'
import Image from 'next/image';
import { Heart } from 'react-feather';
import { IComment } from '@/app/types';
import { getCreator } from '@/app/api/community';

export default async function CommentCard({comment}: {comment: IComment}) {
    let image
    if(comment.handle) {
        image = (await getCreator(comment.handle)).iconURL
    } else {
        image = defaultLogo
    }

    // if(!comment.comment) {
    //     return (<></>)
    // }
    return (
        <div className="comment">
            <Image src={image} width={45} height={45} className='logo' alt={`${comment.username}'s logo`}></Image>
            <div className="body">
                <div className='header'>
                    <h4>{comment.username}</h4>
                    <p>{new Date(comment.date).toLocaleString()}</p>
                </div>
                <p>{comment.comment}</p>
                {/* <div className='commentActions'>
                    <p><Heart /> {comment.likes}</p>
                    <p>Reply</p>
                </div> */}
            </div>
        </div>
    )
}