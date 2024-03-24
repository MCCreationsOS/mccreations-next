import Menu from "@/components/Menu/Menu";

export default function AccountPageLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Menu selectedPage="/"></Menu>
            {children}
        </>
    )
}