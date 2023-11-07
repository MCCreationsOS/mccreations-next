import MapCard from "./MapCard"

export default function ContentCard({content, playlist, index, priority}) {
    return (
        <MapCard id={playlist + "_" + index} key={content._id} map={content} priority={priority}></MapCard>
    )
}