import Footer from "@/components/Footer/Footer";
import MenuSkeleton from "@/components/skeletons/MenuSkeleton";
import { Locales } from "../api/types";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { unstable_setRequestLocale } from "next-intl/server";

export const generateStaticParams = async () => {
    return Locales.map(locale => ({ locale: locale }));
}

export default function NotFound({ params }: { params: Params}) {
    unstable_setRequestLocale(params?.locale  ?? "en-US");
    return (
        <>
            <MenuSkeleton />
            <div className="centered-content">
                <h1>Page not found</h1>
            </div>
        </>
    )
}