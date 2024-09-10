import { ContentTypes, IContentDoc, ICreator } from "@/app/api/types";
import Tabs from "../Tabs/Tabs";
import styles from "./Content.module.css"
import EditContentButton from "@/components/Buttons/EditContentButton";
import {useTranslations} from 'next-intl';

/**
 * The Tab and Edit Menu that appears on top of content pages
 * @param slug The slug of the content to be passed to the Edit Button
 * @param creators The creators of the content to be passed to the Edit Button
 * @param status The status of the content to be passed to the Edit Button 
 * @returns 
 */
export default function ContentMenu({content, selectedTab}: {content: IContentDoc, selectedTab?: number}) {
    const t = useTranslations();

    let tabs = [
        {title: t('content.info'), content: <></>, link: `../${content.slug}`},
        {title: t('content.files'), content: <></>, link: `./${content.slug}/files`}
    ]

    if(content.type === ContentTypes.Maps && content.extraFeatures && content.extraFeatures.leaderboards.use) {
        tabs.push({title: t('Content.Leaderboards'), content: <></>, link: `/leaderboards/maps/${content.slug}`})
    }
    

    return (
        <div className={styles.content_submenu}>
            <div className={styles.content_tabs}>
                <Tabs tabs={tabs} preselectedTab={selectedTab}/>
                <EditContentButton slug={content.slug} creators={content.creators} status={content.status} contentType={content.type}/>
            </div>
        </div>
    )
}