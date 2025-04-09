import { Download, Filter, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "../ui/button";

export default async function SearchAndFilterSkeleton() {
    const t = await getTranslations()

    return (
        <div className="search_and_filter">
                <div className="search_stack">
                    <input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="search"></input>
                    <Button variant="secondary"><Search /></Button>
                    <Button variant="secondary"><Filter /></Button>
                    <div className="bulk_dl"><Button variant="secondary"><Download /></Button></div>
                </div>
                <div className={`filters`}>
                </div>
        </div>
    )
}