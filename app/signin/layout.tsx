import Menu from "@/components/Menu";

export default function SignInLayout({ children }: {children: React.ReactNode}) {
    return (
        <>
        <Menu selectedPage="/" />
            {children}
        </>
    )
}