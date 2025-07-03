import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import { Metadata } from "next";
import Loading from "./loading";
import { getTranslations } from "next-intl/server";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
    const t = await getTranslations();
    return {
        metadataBase: new URL("https://mccreations.net"),
        title: t("Pages.Datapacks.Metadata.title"),
        description: t("Pages.Datapacks.Metadata.description"),
        twitter: {
            title: t("Pages.Datapacks.Metadata.title"),
            description: t("Pages.Datapacks.Metadata.description"),
            card: "summary_large_image",
            images: ["https://mccreations.net/defaultBanner.png"],
        },
        openGraph: {
            title: t("Pages.Datapacks.Metadata.title"),
            description: t("Pages.Datapacks.Metadata.description"),
            images: ["https://mccreations.net/defaultBanner.png"],
            siteName: "MCCreations",
            type: "website",
            url: "https://mccreations.net/datapacks",
        },
        keywords: [t("Pages.Datapacks.Metadata.Keywords.minecraft"), t("Pages.Datapacks.Metadata.Keywords.games"), t("Pages.Datapacks.Metadata.Keywords.gaming"), t("Pages.Datapacks.Metadata.Keywords.minecraft_datapack"), t("Pages.Datapacks.Metadata.Keywords.minecraft_creations"), t("Pages.Datapacks.Metadata.Keywords.minecraft_version"), t("Pages.Datapacks.Metadata.Keywords.mods"), t("Pages.Datapacks.Metadata.Keywords.minecraft_mods"), t("Pages.Datapacks.Metadata.Keywords.minecraft_but"), t("Pages.Datapacks.Metadata.Keywords.minecraft_survival")],
        publisher: "MCCreations",
    };
}

export default function DatapacksLayout({
    params: { locale },
    children,
}: {
    params: { locale: string };
    children: React.ReactNode;
}) {
    return (
        <>
            <Suspense fallback={<Loading />}>{children}</Suspense>
        </>
    );
}
