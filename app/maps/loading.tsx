import GridSkeleton from "@/components/skeletons/GridSkeleton";
import MenuSkeleton from "@/components/skeletons/MenuSkeleton";
import { Filter } from "react-feather";


export default function Loading() {
    return (
        <>
        <MenuSkeleton />
        <div className="search_and_filter">
                <div className="search_stack">
                    <input type="text" placeholder="Search" className="search"></input>
                    <button className="secondary_button"><Filter /></button>
                </div>
            </div>
        <GridSkeleton amount={20} />
        </>
    )
}