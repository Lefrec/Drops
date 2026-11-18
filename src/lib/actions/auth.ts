'use server'
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { setSession } from "../session"
import type { AuthResponse } from "@/lib/api/types"
import { apiPost } from "../api/client"

export type LoginState = { error?: string }

export async function login(prev: {error?: string}, data: FormData) {
    const res = await apiPost('/auth/login', undefined, {
        login: data.get('login'),
        password: data.get('password'),
    })
    if (!res.ok) return { error: 'Identifiants incorrects'}
    const { token } = (await res.json()) as AuthResponse
    await setSession(token)
    redirect('/drops')
}

export async function logout() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (token) {
        const res = await apiPost(`${process.env.API_URL}/auth/logout`, token)

        if (!res.ok && res.status !== 401) {
            throw new Error(`API ${res.status} sur /auth/logout`)
        }
    }

    setSession()
    redirect('/auth/login')
}