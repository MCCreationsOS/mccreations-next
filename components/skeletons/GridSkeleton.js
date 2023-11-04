import CardSkeleton from "./CardSkeleton";

export default function GridSkeleton({amount}) {
    let content = []
    for(let i = 0; i < amount; i++) {
        content[i] = i;
    }
    return (
        <div className='contentGrid'>
            {content.map((id) => <CardSkeleton key={id} />)}
        </div>
    )
}