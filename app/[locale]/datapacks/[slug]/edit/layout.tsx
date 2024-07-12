import { I18nProviderClient } from "@/locales/client";

export default function ClientLayout({params: {locale}, children}: {params: {locale: string}, children: React.ReactElement}) {
    return (
        <I18nProviderClient locale={locale}>
            {children}
        </I18nProviderClient>
    )
}