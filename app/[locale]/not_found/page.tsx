import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function NotFound(props: { params: Promise<Params>}) {
    const params = await props.params;
    setRequestLocale(params.locale)
    const t = await getTranslations("Pages.NotFound")
    return (
        <>
            <div className="flex flex-col gap-2 items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">{t("title")}</h1>
                <p className="text-lg">{t("description")}</p>
                <Link href="/" className="text-blue-500">{t("button")}</Link>
            </div>
        </>
    )
}