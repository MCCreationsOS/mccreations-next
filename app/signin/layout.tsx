import Menu from "@/components/Menu/Menu";

export default function SignInLayout({ children }: {children: React.ReactNode}) {
    return (
        <>
        <Menu selectedPage="/" />
            {children}
        </>
    )
}