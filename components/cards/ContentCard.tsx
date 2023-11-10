import { IMap } from "@/app/types"
import MapCard from "./MapCard"

export default function ContentCard({content, playlist, index, priority}: {content: IMap, playlist: string, index: number, priority: boolean}) {
    return (
        <MapCard id={playlist + "_" + index} key={content._id} map={content} priority={priority}></MapCard>
    )
}