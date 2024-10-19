import FeaturedSkeleton from "@/components/skeletons/FeaturedSkeleton";
import GridSkeleton from "@/components/skeletons/GridSkeleton";

export default function Loading() {
    return (
        <>
            <FeaturedSkeleton />
            <GridSkeleton amount={20} />
        </>
    )
}