'use client'

import Image from 'next/image';
import { Heart } from 'react-feather';
import { IComment } from '@/app/api/types';
import { getCreator } from '@/app/api/community';
import styles from './Comment.module.css';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';

/**
 * A comment
 * @param comment The comment to display 
 */
export default function CommentCard({comment}: {comment: IComment}) {
    const [image, setImage] = useState("/defaultLogo.png")
    const [expanded, setExpanded] = useState(false)
    const [canExpand, setCanExpand] = useState(false)
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // If the comment is attached to a user, get the user's icon
        if(comment.handle) {
            getCreator(comment.handle).then((creator) => {
                if(creator && creator.iconURL) {
                    setImage(creator.iconURL)
                }
            })
        }
        if(container.current) {
            setCanExpand(container.current.scrollHeight > 100)
        }
    }, [])

    if(!comment.approved) return undefined

    return (
        <div className={`${styles.comment} ${(expanded) ? styles.expanded : ""}`} ref={container}>
            <Image src={image} width={45} height={45} className={styles.logo} alt={`${comment.username}'s logo`}></Image>
            <div className={styles.body}>
                <div className={styles.header}>
                    <h4>{comment.username}</h4>
                    <p>{new Date(comment.date).toLocaleDateString()}</p>
                </div>
                <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.comment)}}></p>
                {/* Likes and replies may eventually go here  */}
            </div>
            {canExpand && <div className={styles.expand} onClick={() => setExpanded(!expanded)}>{(expanded) ? "See Less" : "See More"}</div>}
        </div>
    )
}