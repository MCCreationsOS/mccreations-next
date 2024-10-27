'use client'

import { useFeed } from "@/app/api/hooks/creations"
import { useWindowSize } from "usehooks-ts"
import styles from './HomepageFeed.module.css'
import SecondaryButton from "../Buttons/SecondaryButton"
import FeedGrid from "../Grids/FeedGrid"
export default function HomepageFeed() {
    const {width = 0, height = 0} = useWindowSize()
    let limit = 4
    if(width >= 1900) {
        limit = 5
    } else if (width <= 750) {
        limit = 1
    } else if (width <= 1070) {
        limit = 2
    } else if (width <= 1440) {
        limit = 3
    }
    const {feed} = useFeed(limit, 0)


    
    if (!feed || 'error' in feed) {
        return <></>
    }

    return (
        <div className={styles.homepage_feed}>
            <h2 className={styles.feed_header}>Your Feed</h2>
            <SecondaryButton className={styles.feed_see_all}>See All</SecondaryButton>
            <FeedGrid content={feed} />
        </div>
    )
}