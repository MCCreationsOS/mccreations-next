import Menu from "@/components/Menu/Menu";

export default function SignUpLayout({ children }: {children: React.ReactNode}) {
    return (
        <>
        <Menu selectedPage="/" />
            {children}
        </>
    )
}