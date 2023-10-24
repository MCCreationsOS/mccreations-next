import MapCard from "./MapCard"

export default function ContentCard({content}) {
    return (
        <MapCard key={content._id} map={content}></MapCard>
    )
}