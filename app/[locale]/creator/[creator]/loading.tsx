import styles from './CreatorPage.module.css'
import Image from "next/image"
import Menu from '@/components/Menu/Menu'
import { shimmer, toBase64 } from '@/components/skeletons/imageShimmer'

export default function ProfileLoading() {
    return (
        <>
        <div className={styles.profile_page}>
            <div className={styles.profile_card}>
                <Image className={styles.banner} width={1920} height={540} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt=""></Image>
                <svg className={styles.icon_container} width={400} height={140} viewBox="0 0 400 140">
                    <circle fill="#272727" r="50" cx="50" cy="50"></circle>
                    <foreignObject width={400} height={90} x="5" y="5">
                        <div className={styles.icon_content}>
                            <Image style={{borderRadius: "50%"}} width={90} height={90} src={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`} alt="" />
                            <div className={styles.creator_info}>
                                <h2></h2>
                                <p></p>
                            </div>
                        </div>
                    </foreignObject>
                </svg>
                <div className={styles.profile_content}>
                    <div className={styles.profile_section}>
                        
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}