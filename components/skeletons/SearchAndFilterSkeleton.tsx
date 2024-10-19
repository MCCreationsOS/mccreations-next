import { Download, Filter, Search } from "react-feather";
import IconButton from "../Buttons/IconButton";
import BulkDownloadButton from "../Buttons/BulkDownloadButton";
import { getTranslations } from "next-intl/server";

export default async function SearchAndFilterSkeleton() {
    const t = await getTranslations()

    return (
        <div className="search_and_filter">
                <div className="search_stack">
                    <input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="search"></input>
                    <IconButton><Search /></IconButton>
                    <IconButton className="filter"><Filter /></IconButton>
                    <div className="bulk_dl"><IconButton className="secondary"><Download /></IconButton></div>
                </div>
                <div className={`filters`}>
                </div>
        </div>
    )
}