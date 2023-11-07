import ContentCard from "./cards/ContentCard"

export default function ContentGrid({content}) {
    return (
        <div className='content_grid'>
            {content.map((map, idx) => <ContentCard key={idx} content={map} priority={true} playlist={"none"} index={idx}></ContentCard>)}
        </div>
    )
}