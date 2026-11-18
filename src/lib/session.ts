import { cookies } from "next/headers";
import { redirect } from "next/navigation"

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

export async function requireSession() {
    const token = (await cookies()).get('session')?.value
    if (!token) redirect('/login')
    return token
}