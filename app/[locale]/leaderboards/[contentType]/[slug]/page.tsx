import { getLeaderboard } from "@/app/api/community"
import { fetchDatapack, fetchMap } from "@/app/api/content"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import Image from "next/image"
import styles from '../../leaderboard.module.css'
import Rating from "@/components/Rating"
import DownloadButton from "@/components/Buttons/DownloadButton"
import Link from "next/link"
import { getFormatter, getTranslations } from "next-intl/server"

export default async function Page({params}: {params: Params}) {
    const t = await getTranslations();
    const formatter = await getFormatter();
    let leaderboard = await getLeaderboard(params.contentType, params.slug)
    let creation = undefined
    let title = ""
    switch (params.contentType) {
        case 'maps':
            let res = await fetchMap(params.slug)
            if('_id' in res) {
                creation = res
            }
            break;
        case 'datapacks':
            creation = await fetchDatapack(params.slug)
            break;
    }

    if(!creation) {
        let words = params.slug.split("_")
        for(let i = 0; i < words.length; i++) {
            title += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " "
        }
    }

    const formatTime = (time: number) => {
        let hours = Math.floor(time / 60 / 60 / 20)
        let minutes = Math.floor((time / 60 / 20) % 60)
        let seconds = Math.floor((time / 20) % 60)
        let ticks = Math.floor(time % 20)
        return `${hours}h ${minutes}m ${seconds}s ${ticks}t`
    }

    if(!leaderboard) {
        return <div style={{height: "80vh"}}>
        <div className={styles.leaderboard}>
            {(creation) ? <Image priority src={creation?.images[0] ?? "/defaultBanner.png"} width={1920} height={1080} alt="" className={styles.background_image}></Image> : <div className={styles.background_image}></div>}
            <div className={styles.information}>
                <div className={styles.creation_title}>
                    {creation && <Image priority src={creation?.images[0] ?? "/defaultBanner.png"} width={1920} height={1080} alt="" className={styles.image}></Image>}
                    <div>
                        <h1 className={styles.title}>{creation?.title ?? title}</h1>
                        <div className='map_download_stack'>
                            {(creation?.files) ? <DownloadButton slug={creation.slug} contentType={creation.type} file={creation.files[0]} />: <></>}
                            {creation && <Rating value={creation.rating} content={creation} />}
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className={styles.title}>{t('Leaderboards.not_found')}</h3>
                </div>
            </div>

        </div>
    </div>
    }
    return (
        <div style={{height: "80vh"}}>
            <div className={styles.leaderboard}>
                {(creation) ? <Image priority src={creation?.images[0] ?? "/defaultBanner.png"} width={1920} height={1080} alt="" className={styles.background_image}></Image> : <div className={styles.background_image}></div>}
                <div className={styles.information}>
                    <div className={styles.creation_title}>
                        {creation && <Link className={styles.image} href={(creation) ? `/${creation.type}s/${creation.slug}` : ""}><Image priority src={creation?.images[0] ?? "/defaultBanner.png"} width={1920} height={1080} alt="" className={styles.image}></Image></Link>}
                        <div>
                        <Link href={(creation) ? `/${creation.type}s/${creation.slug}` : ""}><h1 className={styles.title}>{creation?.title ?? title}</h1></Link>
                            <div className='map_download_stack'>
                                {(creation?.files) ? <DownloadButton slug={creation.slug} contentType={creation.type} file={creation.files[0]} />: <></>}
                                {creation && <Rating value={creation.rating} content={creation} />}
                            </div>
                        </div>
                    </div>
                    <table className={styles.leaderboard_table}>
                        <thead>
                            <tr>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.rank')}</th>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.player')}</th>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.time')}</th>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.date')}</th>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.device')}</th>
                                <th className={styles.leaderboard_table_data}>{t('Leaderboards.location')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.scores.sort((a, b) => {
                                    if(a.score_type !== "highest_score") return a.score - b.score
                                    return b.score - a.score
                                }).map((entry, index) => (
                                <tr key={index}>
                                    <td className={styles.leaderboard_table_data}>{index + 1}</td>
                                    <td className={styles.leaderboard_table_data}>{entry.username}</td>
                                    <td className={styles.leaderboard_table_data}>{formatTime(entry.score)}</td>
                                    <td className={styles.leaderboard_table_data}>{formatter.dateTime(new Date(entry.date), {
                                        timeStyle: "short",
                                        dateStyle: "medium"
                                    })}</td>
                                    <td className={styles.leaderboard_table_data}>{entry.device}</td>
                                    <td className={styles.leaderboard_table_data}>{entry.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}