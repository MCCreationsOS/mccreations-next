import { Link } from "@/app/api/navigation";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";
import styles from '@/components/old/FeaturedSlideshow/FeaturedSlideshow.module.css';
import { Button } from "../ui/button";
export default function FeaturedSkeleton() {
    return (
        <div className={styles.slideshow}>
            <div className={`${styles.slide} ${styles.active}`}>
                <Image className={styles.image_background} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080} alt=""></Image>
                <img className={`${styles.nav_arrow} ${styles.left}`} src="/chev-left.svg"></img>
                <img className={`${styles.nav_arrow} ${styles.right}`} src="/chev-right.svg"></img>
                <div className={styles.information}>
                    <Image className={styles.image} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} width={1920} height={1080} alt={""}></Image>
                    <h2 className={styles.title}></h2>
                    <p className={styles.description}></p>
                    <p className={styles.author}></p>
                    <div className={styles.stats}>
                        <div className={styles.cardStat}><Image className={styles.inTextIcon} src={"/download.svg"} alt="" width={16} height={16}></Image></div>
                        <div className={styles.cardStat}><Image className={styles.inTextIcon} src={"/heart.svg"} alt="" width={16} height={16}></Image></div>
                        <div className={styles.cardStat}><Image className={styles.inTextIcon} src={"/map.svg"} alt="" width={16} height={16}></Image></div>
                    </div>
                    <Button>See More!</Button>
                    <div>
                        <div className={`${styles.marker} ${styles.active}`}>
                            <span className={styles.color} style={{margin: `0 -0%`}}></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
