'use server'
import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
    cookies().set(name, value)
}

export async function getCookie(name: string) {
    const cookieStore = cookies()
    const cookie = cookieStore.get(name)
    return cookie
}