import { fetchMaps } from "@/app/getData";
import ContentScrollGrid from "./slideshows/ContentScrollGrid";

export default async function MapScroll() {
    const maps = (await fetchMaps({status: 3, limit: 60}, false)).documents;

    return (
        <div className="map_scroll">
            <ContentScrollGrid content={maps} />
            <ContentScrollGrid content={maps} />
        </div>
    )
}