import CardSkeleton from "./CardSkeleton";

export default function GridSkeleton({amount}: {amount: number}) {
    let content = []
    for(let i = 0; i < amount; i++) {
        content[i] = i;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
            {content && content.map((map, idx) => {
                return (
                    <CardSkeleton key={idx}></CardSkeleton>
                )
            })}
        </div>
    )
}