import Footer from "@/components/Footer/Footer";
import MenuSkeleton from "@/components/skeletons/MenuSkeleton";


export default function NotFound() {
    return (
        <>
            <MenuSkeleton />
            <div className="centered-content">
                <h1>Page not found</h1>
            </div>
        </>
    )
}