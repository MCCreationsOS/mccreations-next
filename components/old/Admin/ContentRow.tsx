import { CollectionNames, IContentDoc } from "@/app/api/types"
import { Link } from "@/app/api/navigation";
import { useState } from "react"
import { Plus } from "lucide-react"
import MainButton from "../Buttons/MainButton"
import { approveContent, convertToCollection } from "@/app/api/content"
import styles from './table.module.css'
import SecondaryButton from "../Buttons/SecondaryButton";

export default function ContentRow({content, addToUpdateQueue}: {content: IContentDoc, addToUpdateQueue: (map: IContentDoc) => void}) {
    const [title, setTitle] = useState(content.title)
    const [slug, setSlug] = useState(content.slug)
    const [tags, setTags] = useState(Creation.Tags)
    const [shortDescription, setShortDescription] = useState(content.shortDescription)
    const [creators, setCreators] = useState(content.creators ?? "")

    const type = (content.type === "map") ? "Maps" : (content.type === "resourcepack") ? "Resourcepacks" : "Datapacks"

    const updateCreator = (idx: number, username: string, handle?: string) => {
        let newCreators = creators
        newCreators[idx] = {username, handle}
        setCreators(newCreators)
    }
    
    return (
        <div key={content.slug} className={styles.table_row}>
            <Link className={styles.table_item} href={`/${content.type}s/${content.slug}`}>View</Link>
            <input type="text" className={`${styles.table_item} ${styles.table_input}`} defaultValue={content.title} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>
            <input type="text" className={`${styles.table_item} ${styles.table_input}`} defaultValue={content.slug} onChange={(e) => {setSlug(e.currentTarget.value)}}></input>
            <input type="text" className={`${styles.table_item} ${styles.table_input}`} defaultValue={Creation.Tags} onChange={(e) => {setTags(e.currentTarget.value.split(","))}}></input>
            <textarea className={`${styles.table_item} ${styles.table_input}`} defaultValue={content.shortDescription} onChange={(e) => {setShortDescription(e.currentTarget.value)}}></textarea>
            <button className={styles.table_item} onClick={() => {
                addToUpdateQueue({
                    ...content,
                    title,
                    slug,
                    tags,
                    shortDescription,
                    creators
                })
            }}><Plus /></button>
            <Link target="_blank" className={styles.table_item} href={(content.files && content.files[0]) ? content.files[0].url ?? "" : ""}><SecondaryButton>Download {(content.files && content.files[0]) ? content.files[0].minecraftVersion : ""}</SecondaryButton></Link>
            {(content.status === 1) ? <MainButton className={styles.table_item} onClick={() => {approveContent(content.slug, CollectionNames[type], localStorage?.getItem('jwt')); content.status = 2}}>Approve</MainButton> : <></> }
            <div>{content.creators?.map((c, idx) => (<div className={styles.creator_group}><input type="text" className={`${styles.table_item} ${styles.table_input}`} defaultValue={c.username} onChange={(e) => {updateCreator(idx, e.currentTarget.value, c.handle)}}></input><input type="text" className={`${styles.table_item} ${styles.table_input}`} defaultValue={c.handle} onChange={(e) => {updateCreator(idx, c.username, e.currentTarget.value)}}></input></div>))}</div>
        </div>
    )
}