import { IComment, IContentDoc } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { useState } from "react"
import styles from './table.module.css'
import RichText from "../FormInputs/RichText/RichText"
import MainButton from "../Buttons/MainButton"
import { Plus } from "react-feather"

export default function CommentRow({comment, addToUpdateQueue}: {comment: IComment, addToUpdateQueue: (map: IComment) => void}) {
    const [username, setUsername] = useState(comment.username)
    const [slug, setSlug] = useState(comment.slug)
    const [handle, setHandle] = useState(comment.handle)
    const [commentText, setCommentText] = useState(comment.comment)
    const [contentType, setContentType] = useState(comment.content_type)
    const [approved, setApproved] = useState(comment.approved)
    
    return (
        <div key={comment._id} className={styles.table_row}>
            <Link href={`/maps/${comment.slug}`}>View</Link>
            <input type="text" className={styles.table_item} defaultValue={comment.username} onChange={(e) => {setUsername(e.currentTarget.value)}}></input>
            <input type="text" className={styles.table_item} defaultValue={comment.slug} onChange={(e) => {setSlug(e.currentTarget.value)}}></input>
            <input type="text" className={styles.table_item} defaultValue={comment.handle} onChange={(e) => {setHandle(e.currentTarget.value)}}></input>
            <RichText initialValue={comment.comment} sendOnChange={(v: string) => {setCommentText(v)}}/>
            <input type="text" className={styles.table_item} defaultValue={comment.content_type} onChange={(e) => {setContentType(JSON.parse(e.currentTarget.value))}}></input>
            <input type="checkbox" className={styles.table_item} defaultChecked={comment.approved} onChange={(e) => {setApproved(JSON.parse(e.currentTarget.value))}}></input>
            <MainButton onClick={() => {
                addToUpdateQueue({
                    ...comment,
                    username,
                    slug,
                    handle,
                    comment: commentText,
                    content_type: contentType,
                    approved
                })
            }}><Plus/></MainButton>
        </div>
    )
}