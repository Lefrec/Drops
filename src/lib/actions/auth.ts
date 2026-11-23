'use server'

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { setSession } from "../session"
import type { ActionState, AuthResponse } from "@/lib/api/types"
import { apiPost, toActionError } from "../api/client"

export type AuthState = ActionState

export async function register(_previousState: AuthState, data: FormData): Promise<AuthState> {
    try {
        const response = await apiPost('/auth/register', undefined, {
            username: data.get('username'),
            displayName: data.get('displayName'),
            email: data.get('email'),
            password: data.get('password'),
            bio: data.get('bio')
        })
        const { token } = (await response.json()) as AuthResponse
        await setSession(token)
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    redirect('/drops')
}

export async function login(_previousState: AuthState, data: FormData): Promise<AuthState> {
    try {
        const response = await apiPost('/auth/login', undefined, {
            login: data.get('login'),
            password: data.get('password'),
        })
        const { token } = (await response.json()) as AuthResponse
        await setSession(token)
    } catch (error) {
        const actionError = toActionError(error)
        if (actionError) return actionError
        throw error
    }

    redirect('/drops')
}

export async function logout() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    let remoteLogoutFailed = false

    try {
        if (token) await apiPost('/auth/logout', token)
    } catch (error) {
        const actionError = toActionError(error)
        if (!actionError) throw error
        remoteLogoutFailed = true
    } finally {
        await setSession()
    }

    redirect(remoteLogoutFailed ? '/auth/login?logout=local' : '/auth/login')
}
