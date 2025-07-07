import GridSkeleton from "@/components/skeletons/GridSkeleton";
import SearchAndFilterSkeleton from "@/components/skeletons/SearchAndFilterSkeleton";
import SidebarFiltersSkeleton from "@/components/skeletons/SidebarFiltersSkeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getTranslations } from "next-intl/server";

export default async function Loading() {
    const t = await getTranslations()
    return <div>
        <div className="mb-4 mt-2 p-2">
            <h1 className="text-2xl font-bold">{t(`Components.Creations.Search.Headers.resourcepack.title`)}</h1>
            <Collapsible>
                <CollapsibleTrigger><p className="text-sm text-gray-500">{t(`Components.Creations.Search.Headers.resourcepack.blurb`)}</p></CollapsibleTrigger>
                <CollapsibleContent>
                <p className="text-sm text-gray-500">
                    {t(`Components.Creations.Search.Headers.resourcepack.description`)}
                </p>
                </CollapsibleContent>
            </Collapsible>

        </div>
        <div className="md:grid md:grid-cols-[300px_1fr] gap-4 p-2 @container">
            <SidebarFiltersSkeleton />
            <div>
                <SearchAndFilterSkeleton />
                <GridSkeleton amount={20} />
            </div>
        </div>
    </div>
}