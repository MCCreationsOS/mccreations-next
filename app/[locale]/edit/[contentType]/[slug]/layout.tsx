import Menu from "@/components/Menu/Menu";

export default function EditLayout({children}: {children: React.ReactElement}) {
    return (
        <>
            <Menu selectedPage="" />
            {children}
        </>
    )
}