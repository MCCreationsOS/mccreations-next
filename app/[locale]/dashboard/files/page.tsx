"use client"

import FilesTable from "@/app/[locale]/dashboard/filesTable"
import { useTranslations } from "next-intl"

export default function FilesPage() {
    const t = useTranslations()

    return (
        <>
            <h3 className="text-2xl font-bold mb-2">{t("Pages.Dashboard.Files.title")}</h3>
            <FilesTable />
        </>
    )
}
