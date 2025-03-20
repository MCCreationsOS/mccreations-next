"use client"

import { useUser } from "@/app/api/hooks/users"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const {user} = useUser()
    const router = useRouter()

    if(user) {
        router.push("/creator/"+user.handle)
    }
    
    return null
}
