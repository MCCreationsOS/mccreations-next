import defaultLogo from 'public/defaultLogo.png'
import Image from 'next/image';
import { Heart } from 'react-feather';

export default function CommentCard({comment}) {
    let image;
    if(comment.icon) {
        image = comment.icon;
    } else {
        image = defaultLogo
    }

    // if(!comment.comment) {
    //     return (<></>)
    // }
    return (
        <div className="comment">
            <Image src={image} width={45} height={45} className='logo'></Image>
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