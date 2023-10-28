import MapCard from "./MapCard"

export default function ContentCard({content, playlist, index}) {
    return (
        <MapCard id={playlist + "_" + index} key={content._id} map={content}></MapCard>
    )
}