import { I18nProviderClient } from "@/locales/client";
import Menu from "@/components/Menu/Menu";

export default function SignInLayout({ params: { locale }, children }: { params: { locale: string }, children: React.ReactNode}) {
    return (
        <I18nProviderClient locale={locale}>
        <Menu selectedPage="/" />
            {children}
        </I18nProviderClient>
    )
}