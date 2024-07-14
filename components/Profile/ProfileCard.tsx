import defaultLogo from '/public/defaultLogo.png'
import defaultBanner from '/public/defaultBanner.png'
import Image from "next/image"
import Link from "next/link"
import styles from './ProfileStyle.module.css'
import { getCreator } from "@/app/api/community";
import ProfileEditButton from './ProfileEditButton'
import { IUser } from '@/app/api/types'

export default async function ProfileCard({creator}: {creator: IUser}) {
    return (
        <div className={styles.profile_card}>
            <ProfileEditButton creator={creator}/>
            <Image className={styles.banner} width={1920} height={540} src={(creator.bannerURL) ? creator.bannerURL : defaultBanner} alt={`${creator.username}'s banner image`}></Image>
            <svg className={styles.icon_container} width={400} height={140} viewBox="0 0 400 140">
                <circle fill="#272727" r="50" cx="50" cy="50"></circle>
                <foreignObject width={400} height={90} x="5" y="5">
                    <div className={styles.icon_content}>
                        <Image style={{borderRadius: "50%"}} width={90} height={90} src={(creator.iconURL) ? creator.iconURL : defaultLogo} alt="" />
                        <div className={styles.creator_info}>
                            <h2>{creator.username}</h2>
                            <p>@{creator.handle}</p>
                        </div>
                    </div>
                </foreignObject>
            </svg>
            <div className={styles.profile_content}>
                <div className={styles.profile_section}>
                    {creator.about}
                </div>
                {((creator.socialLinks && Object.keys(creator.socialLinks).length > 0))? 
                <div className={styles.profile_section}>
                    {creator.socialLinks.map((link: any) => {
                        return <Link href="link.link">{link.name}</Link>
                    })}
                </div> : 
                <></>}
            </div>
        </div>
    )
}