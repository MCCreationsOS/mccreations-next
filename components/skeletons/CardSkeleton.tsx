import { Link } from "@/app/api/navigation";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";
import styles from "../ContentSlideshow/ContentCard.module.css"

export default function CardSkeleton() {
    return (
        <div className={styles.content_card} >
            <div className={styles.information}>
                <div className={styles.description}>
                    <div className={styles.stats}>
                    </div>
                </div>
                <div className={styles.quick_actions}>
                </div>
                <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} className={styles.logo} width={1920} height={1080} sizes="25vw" alt=""></Image>
            </div>
            <Link className={styles.title} href=""></Link>
            <p className={styles.author}></p>
        </div>
    )
}