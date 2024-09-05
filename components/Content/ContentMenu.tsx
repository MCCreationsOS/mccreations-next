import { ContentTypes, ICreator } from "@/app/api/types";
import Tabs from "../Tabs/Tabs";
import styles from "./Content.module.css"
import EditContentButton from "@/components/Buttons/EditContentButton";
import { useI18n } from "@/locales/client";

/**
 * The Tab and Edit Menu that appears on top of content pages
 * @param slug The slug of the content to be passed to the Edit Button
 * @param creators The creators of the content to be passed to the Edit Button
 * @param status The status of the content to be passed to the Edit Button 
 * @returns 
 */
export default function ContentMenu({slug, creators, status, contentType, selectedTab}: {slug: string, creators: ICreator[], status: number, contentType: ContentTypes, selectedTab?: number}) {
    const t = useI18n();
    return (
        <div className={styles.content_submenu}>
            <div className={styles.content_tabs}>
                <Tabs tabs={[
                    {title: t('content.info'), content: <></>, link: `../${slug}`},
                    {title: t('content.files'), content: <></>, link: `./${slug}/files`},
                    {title: t('Content.Leaderboards'), content: <></>, link: `/leaderboards/${contentType}s/${slug}`}
                    ]} preselectedTab={selectedTab}/>
                <EditContentButton slug={slug} creators={creators} status={status} contentType={contentType}/>
            </div>
        </div>
    )
}