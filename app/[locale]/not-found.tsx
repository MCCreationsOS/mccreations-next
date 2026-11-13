import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations("Pages.NotFound")
    return (
        <div className="flex flex-col gap-2 items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-lg">{t("description")}</p>
            <Link href="/" className="text-blue-500 underline">{t("button")}</Link>
        </div>
    )
}
