export default function CreatorCard({creator}) {
    return (
        <div className="creatorCard">
            <img src={creator.icon}></img>
            <div className="creatorNameStack">
                {creator.username}
            </div>
        </div>
    )
}