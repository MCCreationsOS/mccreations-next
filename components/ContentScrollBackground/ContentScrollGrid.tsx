import { IContentDoc } from "@/app/types"
import ContentScrollCard from "./ContentScrollCard"
import styles from './ContentScrollBackground.module.css'

/**
 * A grid of ContentScrollCards used for the content scroll background
 * @param content The content to display
 */
export default function ContentScrollGrid({content}: {content: IContentDoc[]}) {
    return (
        <div className={styles.content_scroll_grid}>
            {content.map((map: IContentDoc, idx: number) => <ContentScrollCard key={idx} map={map} priority={false} id={""}></ContentScrollCard>)}
        </div>
    )
}