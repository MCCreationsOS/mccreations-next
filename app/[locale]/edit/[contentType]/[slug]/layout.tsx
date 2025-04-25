import Menu from "@/components/Menu/Navbar";
import EditHeader from "./editHeader";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Link } from "@/app/api/navigation";
import { getTranslations } from "next-intl/server";
import styles from "./edit.module.css"
import { Edit, Globe, Image, Server } from "lucide-react";
import ContentWarnings from "@/components/Content/ContentWarnings";
import EditMenu from "./editMenu";
import { ContentTypes } from "@/app/api/types";

export default async function EditLayout({children, params}: {children: React.ReactElement, params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const t = await getTranslations()
    
    return (
        <div className={styles.edit_page}>
            <div className={styles.edit_layout}>
                <EditMenu params={params} />    
                <div className={styles.edit_content}>
                    <ContentWarnings slug={params.slug} contentType={contentType} />
                    {children}
                </div>
            </div>
        </div>
    )
}