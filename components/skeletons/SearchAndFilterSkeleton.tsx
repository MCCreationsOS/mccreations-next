import { Filter, List, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default async function SearchAndFilterSkeleton() {
    const t = await getTranslations()

    return (
        <div className="w-full max-w-screen-md mx-auto p-2">
            <div className="flex flex-row gap-2 w-full mb-2">
                <Input type="text" placeholder={t('SearchAndFilter.search_placeholder')} className="w-full"></Input>
                <Button><Search /></Button>
                <Button className="filter md:hidden"><Filter /></Button>
                {/* <BulkDownloadButton /> */}
                <Button variant="secondary"><List /></Button>
            </div>
        </div>
    )
}