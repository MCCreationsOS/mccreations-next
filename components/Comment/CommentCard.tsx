'use client'

import Image from 'next/image';
import { Heart } from 'react-feather';
import { IComment } from '@/app/types';
import { getCreator } from '@/app/api/community';
import styles from './Comment.module.css';
import { useEffect, useState } from 'react';

export default function CommentCard({comment}: {comment: IComment}) {
    const [image, setImage] = useState("/defaultLogo.png")

    useEffect(() => {
        if(comment.handle) {
            getCreator(comment.handle).then((creator) => {
                if(creator && creator.iconURL) {
                    setImage(creator.iconURL)
                }
            })
        }
    }, [])

    // if(!comment.comment) {
    //     return (<></>)
    // }
    return (
        <div className={styles.comment}>
            <Image src={image} width={45} height={45} className={styles.logo} alt={`${comment.username}'s logo`}></Image>
            <div className={styles.body}>
                <div className={styles.header}>
                    <h4>{comment.username}</h4>
                    <p>{new Date(comment.date).toLocaleDateString()}</p>
                </div>
                <p>{comment.comment}</p>
                {/* <div className={styles.actions}>
                    <p><Heart /> {comment.likes}</p>
                    <p>Reply</p>
                </div> */}
            </div>
        </div>
    )
}