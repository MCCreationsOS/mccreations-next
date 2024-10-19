import GridSkeleton from "@/components/skeletons/GridSkeleton";
import SearchAndFilterSkeleton from "@/components/skeletons/SearchAndFilterSkeleton";
import SidebarFiltersSkeleton from "@/components/skeletons/SidebarFiltersSkeleton";

export default function Loading() {
    return <div>
        <SearchAndFilterSkeleton />
        <div className="page_with_sidebar">
            <SidebarFiltersSkeleton />
            <GridSkeleton amount={20} />
        </div>
    </div>
}