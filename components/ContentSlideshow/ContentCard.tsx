import { IMap } from "@/app/types"
import Image from "next/image"
import Link from "next/link"
import { shimmer, toBase64 } from "../skeletons/imageShimmer"
import styles from './ContentCard.module.css'
import { useRouter } from "next/navigation"

/**
 * A card for displaying content
 * @param content The content to display
 * @param playlist The playlist the content is in
 * @param index The index of the content in the playlist
 * @param priority Whether the image should be loaded with priority
 */
export default function ContentCard({content, playlist, index, priority}: {content: IMap, playlist: string, index: number, priority: boolean}) {
    const router = useRouter()

    return (
        <div className={styles.content_card} id={playlist + "_" + index} onClick={() => {router.push(`/maps/${content.slug}`)}} >
            <div className={styles.information}>
                <div className={styles.description}>
                    {content.shortDescription}
                    <div className={styles.stats}>
                        <div className={styles.stat}><img className={styles.in_text_icon} src='/download.svg'></img>{content.downloads}</div>
                        {(content.rating > 0) ? <div className={styles.stat}><img className={styles.in_text_icon} src='/star_white.svg'></img>{(Math.round(content.rating*100)/100) * 5}</div>: <></> }
                        {(content.files && content.files.length > 0) ? <div className={styles.stat}><img className={styles.in_text_icon} src='/map.svg'></img>{content.files[0].minecraftVersion}</div>: <></> }
                    </div>
                </div>
                <Image priority={priority} placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className={styles.logo} src={content.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${content.title}, a Minecraft Map for ${(content.files && content.files.length > 0) ? content.files[0].minecraftVersion : ""} by ${content.creators[0].username}`}></Image>
            </div>
            <Link className={styles.title} href={`/maps/${content.slug}`}>{content.title}</Link>
            <p className={styles.author}>by <span className='cardAuthorLink'>{content.creators[0].username}</span></p>
        </div>
    )
}