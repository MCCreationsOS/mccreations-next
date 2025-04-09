'use client'

import Image from 'next/image';
import { Heart, Link as LinkIcon, MessageSquare, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { CollectionNames, IComment, IUser, UserTypes } from '@/app/api/types';
import { deleteComment, getCreator, likeComment, postReply } from '@/app/api/community';
import styles from './Comment.module.css';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import {useTranslations} from 'next-intl';
import FormComponent from '../Form/Form';
import RichTextInput from '../FormInputs/RichText';
import { FormInput } from '../FormInputs';
import { follow } from '@/app/api/creators';
import Text from '../FormInputs/Text';
import { useCreator, useToken, useUser } from '@/app/api/hooks/users';
import Link from 'next/link';
import DropDown, { DropDownItem } from '../FormInputs/RichText/DropDown';

/**
 * A comment
 * @param comment The comment to display 
 */
export default function CommentCard({comment, contentType, handle, canReply}: {comment: IComment, contentType: CollectionNames | "wall", handle?: string, canReply?: boolean}) {
    const t = useTranslations()
    const {creator} = useCreator(comment.handle)
    const [expanded, setExpanded] = useState(false)
    const [canExpand, setCanExpand] = useState(false)
    const [replying, setReplying] = useState(false)
    const [replies, setReplies] = useState<IComment[]>(comment.replies || [])
    const [likes, setLikes] = useState(comment.likes || 0)
    const container = useRef<HTMLDivElement>(null)
    const {user} = useUser()
    const {token} = useToken()
    let image = "/defaultLogo.png"

    if(creator && creator.iconURL) {
        image = creator.iconURL
    }

    useEffect(() => {
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
        postReply(comment._id!, (user?.username === "" ? inputs[0] : user!.username), FormInput.getFormInput("reply").submit() as string, user?.handle + "")
        setReplies([...replies, {
            content_type: contentType,
            comment: FormInput.getFormInput("reply").submit() as string,
            date: Date.now(),
            handle: user?.handle,
            username: user?.username === "" ? inputs[0] : user!.username,
            approved: true,
            slug: ""
        }])
        setReplying(false)
    }

    const handleDelete = () => {
        if(token) {
            deleteComment(comment._id!, token + "")
        }
    }

    const handleFollow = () => {
        follow(token, comment!.handle!)
    }

    if(!comment.approved) return undefined

    return (
        <div className={styles.comment} ref={container}>
            <div style={{position: "relative"}}>
                <Link href={(comment.handle) ? `/creator/${comment.handle}` : ""}><Image src={image} width={45} height={45} className={styles.logo} alt={t('Creator.logo_alt', {username: ("username" in comment) ? comment.username : creator?.username})}></Image></Link>
                {user && user.handle !== "" && comment.handle && !user.following?.includes(comment.handle) && user.handle !== comment.handle && <DropDown buttonClassName={styles.follow_button} buttonLabel={<Plus />} className='option_dropdown' useButtonWidth={false}>
                            <DropDownItem onClick={handleFollow} className='option_button'>Follow {comment.username}</DropDownItem>
                        </DropDown>}
            </div>
            <div className={styles.body}>
                <div className={styles.header}>
                    <Link href={(comment.handle) ? `/creator/${comment.handle}` : ""}><h4>{("username" in comment) ? comment.username : creator?.username}</h4></Link>
                    <p>{new Date(comment.date).toLocaleDateString()}</p>
                </div>
                <div className={`${styles.comment_text} ${(expanded) ? styles.expanded : ""}`} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.comment)}}></div>
                <div className={styles.right_header}>
                    <DropDown className='option_dropdown' buttonClassName={`options_dropdown_button ${styles.dropdown_button}`} buttonLabel={<MoreVertical/>} useButtonWidth={false}>
                        <DropDownItem className="option_button" onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/comments/${comment._id}`)}}>
                            <LinkIcon aria-label={t('Comment.permalink')}/>
                            {t('Comment.permalink')}
                        </DropDownItem>
                        {(user?.handle === comment.handle || user?.type === UserTypes.Admin) && <DropDownItem className="option_button" onClick={handleDelete}>
                            <Trash2 aria-label={t('Comment.delete')}/>
                            {t('Comment.delete')}
                        </DropDownItem>}
                    </DropDown>
                </div>
                <div className={styles.reactions}>
                    <div className={styles.like}>
                        <Heart className={styles.comment_icon} aria-label={t('Comment.like')} onClick={handleLike}/>
                        <span>{likes}</span>
                    </div>
                    {canReply && <MessageSquare className={styles.comment_icon} aria-label={t('Comment.reply')} onClick={handleReply}/>}
                </div>
                {replying && <FormComponent id="replyForm" onSave={handleReplySave} options={{saveButtonContent: t('Comment.reply')}}>
                    {!user || user.username === "" && <Text name="Username" value={user.username}/>}
                    <RichTextInput id="reply" name="Reply" className="compact"/>
                </FormComponent>}
                <div className={styles.replies}>
                    {comment.replies?.map((reply) => {
                        return <CommentCard comment={reply} contentType={contentType} handle={handle} key={reply._id}/>
                    })}
                </div>
            </div>
            {canExpand && <div className={styles.expand} onClick={() => setExpanded(!expanded)}>{(expanded) ? t('Comment.collapse') : t('Comment.expand')}</div>}
        </div>
    )
}