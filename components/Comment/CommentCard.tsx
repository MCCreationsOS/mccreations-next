'use client'

import Image from 'next/image';
import { Heart, Link, MessageSquare } from 'react-feather';
import { CollectionNames, IComment, IUser } from '@/app/api/types';
import { getCreator, likeComment, postReply } from '@/app/api/community';
import styles from './Comment.module.css';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {useTranslations} from 'next-intl';
import FormComponent from '../Form/Form';
import RichTextInput from '../FormInputs/RichText';
import { FormInput } from '../FormInputs';
import { useUserStore } from '@/app/api/auth';
import { postWallComment } from '@/app/api/creators';
import Text from '../FormInputs/Text';

/**
 * A comment
 * @param comment The comment to display 
 */
export default function CommentCard({comment, contentType, handle, canReply}: {comment: IComment, contentType: CollectionNames | "wall", handle: string, canReply?: boolean}) {
    const t = useTranslations()
    const [image, setImage] = useState("/defaultLogo.png")
    const [creator, setCreator] = useState<IUser | null>(null)
    const [expanded, setExpanded] = useState(false)
    const [canExpand, setCanExpand] = useState(false)
    const [replying, setReplying] = useState(false)
    const [replies, setReplies] = useState<IComment[]>(comment.replies || [])
    const [likes, setLikes] = useState(comment.likes || 0)
    const container = useRef<HTMLDivElement>(null)
    const user = useUserStore((state) => state)

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
            setCanExpand(container.current.scrollHeight > 300)
        }
    }, [])

    const handleLike = () => {
        let token = localStorage.getItem("token")
        likeComment(comment._id!, token + "").then((success) => {
            if(success) {
                setLikes(likes + 1)
            }
        })
    }

    const handleReply = () => {
        setReplying(!replying)
    }

    const handleReplySave = (inputs: string[]) => {
        console.log(comment._id)
        postReply(comment._id!, (user.username === "" ? inputs[0] : user.username), FormInput.getFormInput("reply").submit() as string, user.handle)
        setReplies([...replies, {
            content_type: contentType,
            comment: FormInput.getFormInput("reply").submit() as string,
            date: Date.now(),
            handle: user.handle,
            username: user.username === "" ? inputs[0] : user.username,
            approved: true,
            slug: ""
        }])
        setReplying(false)
    }

    if(!comment.approved) return undefined

    return (
        <div className={styles.comment} ref={container}>
            <Image src={image} width={45} height={45} className={styles.logo} alt={t('Creator.logo_alt', {username: ("username" in comment) ? comment.username : creator?.username})}></Image>
            <div className={styles.body}>
                <div className={styles.header}>
                    <h4>{("username" in comment) ? comment.username : creator?.username}</h4>
                    <p>{new Date(comment.date).toLocaleDateString()}</p>
                </div>
                <div className={styles.right_header}>
                    <Link aria-label={t('Comment.permalink')} onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/comments/${comment._id}`)}}/>
                </div>
                <div className={`${styles.comment_text} ${(expanded) ? styles.expanded : ""}`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.comment)}}></div>
                <div className={styles.reactions}>
                    <div className={styles.like}>
                        <Heart aria-label={t('Comment.like')} onClick={handleLike}/>
                        <span>{likes}</span>
                    </div>
                    {canReply && <MessageSquare aria-label={t('Comment.reply')} onClick={handleReply}/>}
                </div>
                {replying && <FormComponent id="replyForm" onSave={handleReplySave} options={{saveButtonContent: t('Comment.reply')}}>
                    {!user || user.username === "" && <Text name="Username" value={user.username}/>}
                    <RichTextInput id="reply" name="Reply" className="compact"/>
                </FormComponent>}
                <div className={styles.replies}>
                    {comment.replies?.map((comment) => {
                        return <CommentCard comment={comment} contentType={contentType} handle={handle}/>
                    })}
                </div>
            </div>
            {canExpand && <div className={styles.expand} onClick={() => setExpanded(!expanded)}>{(expanded) ? t('Comment.collapse') : t('Comment.expand')}</div>}
        </div>
    )
}