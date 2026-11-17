'use server'
import { redirect } from "next/navigation"
import { setSession } from "../session"
import type { AuthResponse } from "@/lib/api/types"
import { apiPost } from "../api/client"

export type LoginState = { error?: string }

export async function login(prev: {error?: string}, data: FormData) {
    const res = await apiPost('/auth/login', {
        login: data.get('login'),
        password: data.get('password'),
    })
    if (!res.ok) return { error: 'Identifiants incorrects'}
    const { token } = (await res.json()) as AuthResponse
    await setSession(token)
    redirect('/')
}