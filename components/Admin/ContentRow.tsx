import { IContentDoc } from "@/app/api/types"
import Link from "next/link"
import { useState } from "react"
import { Plus } from "react-feather"
import MainButton from "../Buttons/MainButton"
import { approveContent } from "@/app/api/content"
import styles from './table.module.css'

export default function ContentRow({content, addToUpdateQueue}: {content: IContentDoc, addToUpdateQueue: (map: IContentDoc) => void}) {
    const [title, setTitle] = useState(content.title)
    const [slug, setSlug] = useState(content.slug)
    const [tags, setTags] = useState(content.tags)
    const [shortDescription, setShortDescription] = useState(content.shortDescription)
    const [creators, setCreators] = useState(content.creators)

    const updateCreator = (idx: number, username: string, handle?: string) => {
        let newCreators = creators
        newCreators[idx] = {username, handle}
        setCreators(newCreators)
    }
    
    return (
        <div key={content.slug} className={styles.table_row}>
            <Link href={`/maps/${content.slug}`}>View</Link>
            <input type="text" className={styles.table_item} defaultValue={content.title} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>
            <input type="text" className={styles.table_item} defaultValue={content.slug} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>
            <input type="text" className={styles.table_item} defaultValue={content.tags} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>
            <textarea className={styles.table_item} defaultValue={content.shortDescription} onChange={(e) => {setTitle(e.currentTarget.value)}}></textarea>
            <div>{content.creators.map((c, idx) => (<div><input type="text" className={styles.table_item} defaultValue={c.username} onChange={(e) => {updateCreator(idx, e.currentTarget.value, c.handle)}}></input><input type="text" className={styles.table_item} defaultValue={c.handle} onChange={(e) => {updateCreator(idx, c.username, e.currentTarget.value)}}></input></div>))}</div>
            <button onClick={() => {
                addToUpdateQueue({
                    ...content,
                    title,
                    slug,
                    tags,
                    shortDescription,
                    creators
                })
            }}><Plus /></button>
            {(content.status === 1) ? <MainButton onClick={() => {approveContent(content.slug, sessionStorage.getItem('jwt'))}}>Approve</MainButton> : <></> }
        </div>
    )
}