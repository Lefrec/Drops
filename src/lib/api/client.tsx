import 'server-only'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'

export async function apiGet<T>(path: string) {
    const token = (await cookies()).get('session')?.value
    const res = await fetch(`${process.env.API_URL}${path}`, {
        headers: token ? { Authorization: `Bearer ${token}`} : {},
    })
    if (res.status === 404) notFound()
    // 401 plus tard
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return (await res.json()) as T
}

export async function apiPost(path: string, data: Object) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return res
}