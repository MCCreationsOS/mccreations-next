import styles from '@/components/SearchAndFilter/index.module.css'
import { getTranslations } from "next-intl/server";

export default async function SidebarFiltersSkeleton() {
    const t = await getTranslations()

    const Tag = ({tag, tagValue}: {tag: string, tagValue: string}) => {
        return (
            <div className={`${styles.tag}`}>
                {tag}
            </div>
        )
    }
    
    return (
        <div className="sidebar_filters">
            <h3>{t('SearchAndFilter.sort_by')}</h3>
            <button className="options_dropdown_button">{t(`SearchAndFilter.Sort.newest`)}</button>
            <h3>{t('SearchAndFilter.status')}</h3>
            <button className="options_dropdown_button">{t(`Status.unapproved`)}</button>
            <div>
                <h3>{t('SearchAndFilter.tags')}</h3>
                <div className={styles.tags_list}>
                </div>
            </div>
        </div>
    )
}