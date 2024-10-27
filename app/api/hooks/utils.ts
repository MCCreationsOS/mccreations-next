import { usePathname } from "next/navigation"

export function useCurrentPage() {
    const pathname = usePathname()
    return pathname.split('/')[1]
}