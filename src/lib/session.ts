import 'server-only'
import { cookies } from "next/headers";
import { ApiError, apiGet } from "@/lib/api/client"
import type { PrivateUser } from "@/lib/api/types"

export async function setSession(token?: string) {
    if (token) {
        (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/'
    })
    } else {
        (await cookies()).delete('session')
    }
}

export async function getSessionToken() {
    const token = (await cookies()).get('session')?.value
    if (!token) return null

    try {
        await apiGet<PrivateUser>("/auth/me", token)
        return token
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null
        throw error
    }
}