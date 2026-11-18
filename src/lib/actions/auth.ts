'use server'
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { setSession } from "../session"
import type { AuthResponse } from "@/lib/api/types"
import { apiPost } from "../api/client"

export type AuthState = { error?: string }

export async function register(prev: {error?: string}, data: FormData) {
    const res = await apiPost('/auth/register', undefined, {
        username: data.get('username'),
        displayName: data.get('displayName'),
        email: data.get('email'),
        password: data.get('password'),
        bio: data.get('bio')
    })
    if (!res.ok) return { error: 'Création d identifiants échouée' }
    const { token } = (await res.json()) as AuthResponse
    await setSession(token)
    redirect('/drops')
}

export async function login(prev: {error?: string}, data: FormData) {
    const res = await apiPost('/auth/login', undefined, {
        login: data.get('login'),
        password: data.get('password'),
    })
    if (!res.ok) return { error: 'Identification échouée' }
    const { token } = (await res.json()) as AuthResponse
    await setSession(token)
    redirect('/drops')
}

export async function logout() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (token) {
        const res = await apiPost(`/auth/logout`, token)
    }

    setSession()
    redirect('/auth/login')
}