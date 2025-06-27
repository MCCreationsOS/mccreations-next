import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";

export default function NotFound({ params }: { params: Params}) {
    return (
        <>
            <div className="flex flex-col gap-2 items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Page not found</h1>
                <p className="text-lg">The page you are looking for does not exist.</p>
                <Link href="/" className="text-blue-500">Go back to the home page</Link>
            </div>
        </>
    )
}