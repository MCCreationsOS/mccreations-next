import GridSkeleton from "@components/skeletons/GridSkeleton";
import MenuSkeleton from "@components/skeletons/MenuSkeleton";
import { Filter } from "react-feather";


export default function Loading() {
    return (
        <>
        <MenuSkeleton />
        <div className="searchAndFilter">
                <div className="searchStack">
                    <input type="text" placeholder="Search" className="search"></input>
                    <button className="secondaryButton"><Filter /></button>
                </div>
            </div>
        <GridSkeleton amount={20} />
        </>
    )
}