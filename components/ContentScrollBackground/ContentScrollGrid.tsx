import { IMap } from "@/app/types"
import ContentScrollCard from "./ContentScrollCard"
import styles from './ContentScrollBackground.module.css'

export default function ContentScrollGrid({content}: {content: IMap[]}) {
    return (
        <div className={styles.content_scroll_grid}>
            {content.map((map: IMap, idx: number) => <ContentScrollCard key={idx} map={map} priority={false} id={""}></ContentScrollCard>)}
        </div>
    )
}