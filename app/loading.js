import FeaturedSkeleton from "@components/skeletons/FeaturedSkeleton";
import GridSkeleton from "@components/skeletons/GridSkeleton";
import MenuSkeleton from "@components/skeletons/MenuSkeleton";

export default function Loading() {
    return (
        <>
        <MenuSkeleton></MenuSkeleton>
        <FeaturedSkeleton />
        <h2 className="playlistHeader">New Content</h2>
        <GridSkeleton amount={4} />
        </>
    )
}