import Footer from "@/components/Footer/Footer";
import MenuSkeleton from "@/components/skeletons/MenuSkeleton";
import { getStaticParams } from "@/locales/server";


export function generateStaticParams() {
    getStaticParams();
}

export default function NotFound() {
    return (
        <>
            <MenuSkeleton />
            <h1>Page not found</h1>
        </>
    )
}