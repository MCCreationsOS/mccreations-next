import Menu from "@/components/Menu/Menu";


export default function ClientLayout({params: {locale}, children}: {params: {locale: string}, children: React.ReactElement}) {
    return (
        <>
            <Menu selectedPage="" />
            {children}
        </>
    )
}