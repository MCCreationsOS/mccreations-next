import CardSkeleton from "./CardSkeleton";

export default function GridSkeleton({amount}: {amount: number}) {
    let content = []
    for(let i = 0; i < amount; i++) {
        content[i] = i;
    }
    return (
        <div className='content_grid'>
            {content.map((id) => <CardSkeleton key={id} />)}
        </div>
    )
}