'use server'
import { cookies } from 'next/headers'

export async function setCookie(name, value) {
    cookies().set(name, value)
}

export async function getCookie(name) {
    const cookieStore = cookies()
    const cookie = cookieStore.get(name)
    return cookie
}