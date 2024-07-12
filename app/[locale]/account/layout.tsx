import Menu from "@/components/Menu/Menu";
import { I18nProviderClient } from "@/locales/client";

export default function AccountPageLayout({params: {locale}, children}: {params: {locale: string}, children: React.ReactNode}) {
    return (
        <I18nProviderClient locale={locale} >
            <Menu selectedPage="/"></Menu>
            {children}
        </I18nProviderClient>
    )
}