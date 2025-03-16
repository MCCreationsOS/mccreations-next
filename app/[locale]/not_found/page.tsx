import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export default function NotFound({ params }: { params: Params}) {
    return (
        <>
            <div className="centered-content">
                <h1>Page not found</h1>
            </div>
        </>
    )
}