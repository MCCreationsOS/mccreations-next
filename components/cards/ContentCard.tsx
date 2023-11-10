import MapCard from "./MapCard"

export default function ContentCard({content, playlist, index, priority}: {content: any, playlist: string, index: number, priority: boolean}) {
    return (
        <MapCard id={playlist + "_" + index} key={content._id} map={content} priority={priority}></MapCard>
    )
}