import ContentCard from "./cards/ContentCard"

export default function ContentGrid({content}: {content: any[]}) {
    return (
        <div className='content_grid'>
            {content.map((map: any, idx: number) => <ContentCard key={idx} content={map} priority={true} playlist={"none"} index={idx}></ContentCard>)}
        </div>
    )
}