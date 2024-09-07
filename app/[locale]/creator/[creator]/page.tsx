import { getCreator } from "@/app/api/community"
import Menu from "@/components/Menu/Menu"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import styles from './CreatorPage.module.css'
import ContentArea from "@/components/ContentArea/ContentArea"
import ProfileCard from "@/components/Profile/ProfileCard"
import { IUser } from "@/app/api/types";
import {useTranslations} from 'next-intl';
import { Metadata, ResolvingMetadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: {params: Params}, parent: ResolvingMetadata): Promise<Metadata> {
    const id = params.creator
    const t = await getTranslations();
   
    // fetch data
    const creator: IUser = await getCreator(id)

    if(!creator) return {
        title: t('Creator.Metadata.not_found_title'),
        openGraph: {
            title: t('Creator.Metadata.not_found_title'),
            description: t('Creator.Metadata.not_found_description'),
            images: [
            {
                url: "https://mccreations.net/defaultBanner.png"
            }
            ],
            siteName: "MCCreations",
            type: "article",
            url: "https://mccreations.net/creator/" + id
        }
    }
   
    return {
      title: t('Creator.Metadata.title', {username: creator.username}),
      description: t('Creator.Metadata.description', {username: creator.username}),
      openGraph: {
        title: t('Creator.Metadata.title', {username: creator.username}),
        description: t('Creator.Metadata.description', {username: creator.username}),
        images: [
          (creator.iconURL) ? creator.iconURL : "https://mccreations.net/defaultBanner.png"
        ],
        siteName: "MCCreations",
        type: "article",
        url: "https://mccreations.net/creator/" + creator.handle
      }
    }
}


export default async function ProfilePage({params}: {params: Params}) {
    let c = await getCreator(params.creator) as IUser
    let t = await getTranslations();

    if(!c) {
        return (
            <div>
                {t('Creator.not_found')}
            </div>
        )
    }
    
    return (
        <>
        <Menu selectedPage="" />
        <div className={styles.profile_page}>
            <ProfileCard creator={c} />
            <ContentArea cards="three" type="grid" options={{contentType: "content", creator:c.handle, limit: 20}} no_search={true} enableSelection={false}/>
        </div>
        {/* <Image className={styles.banner_background} width={1920} height={1080} src={creator.bannerURL || ""} alt=""></Image>
                <div className={styles.banner_foreground}>
                    <div className={styles.banner_container}>
                        <Image className={styles.banner} width={1920} height={540} src={creator.bannerURL || ""} alt={`${creator.username}'s banner image`}></Image>
                        <svg className={styles.icon_container} width={400} height={140} viewBox="0 0 400 140">
                            <circle fill="#171717" r="70" cx="70" cy="70"></circle>
                            <foreignObject width={400} height={120} x="10" y="10">
                                <div className={styles.icon_content}>
                                    <Image style={{borderRadius: "50%"}} width={120} height={120} src={creator.iconURL || ""} alt="" />
                                    <div className={styles.creator_info}>
                                        <h2>{creator.username}</h2>
                                        <p>@{creator.handle}</p>
                                    </div>
                                </div>
                            </foreignObject>
                        </svg>
                    </div>
                </div>
            <div>
                {((creator.about && creator.about.length > 0) || (creator.socialLinks && Object.keys(creator.socialLinks).length > 0)) ? <div className={styles.info_section}>
                    <div className={styles.about_section}>
                        <h2 className={styles.about_header}>About</h2>
                        {creator.about}
                    </div>
                    {((creator.socialLinks && Object.keys(creator.socialLinks).length > 0))? <div className={styles.link_section}>
                        <h2 className={styles.about_header}>Links</h2>
                        {creator.socialLinks.map((link: any) => {
                            return <Link href="link.link">{link.name}</Link>
                        })}
                    </div> : <></>}
                    
                </div>: <></>}
                <h2 className={styles.section_header}>Content</h2>
                {(content) ? <ContentGrid content={content}/>: <></>}
            </div> */}
        </>
    )
}