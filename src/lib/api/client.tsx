import 'server-only'
import { notFound } from 'next/navigation'

export async function apiGet<T>(path: string, token?: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        headers: token ? { 'Authorization': `Bearer ${token}`} : {},
    })
    if (res.status === 404) notFound()
    // 401 plus tard
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return (await res.json()) as T
}

export async function apiPost(path: string, token?: string, data?: Object) {
    let fullHeaders: HeadersInit = {'Content-Type': 'application/json'}
    if (token) fullHeaders['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: fullHeaders,
    })
    const json = await res.json()
    if (res.status === 404) notFound()
    // if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return res
}

export async function apiPatch(path: string, token: string, data: object) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return res
}

export async function apiDelete(path: string, token: string) {
    const res = await fetch(`${process.env.API_URL}${path}`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`},
    })
    if (res.status === 404) notFound()
    if (!res.ok) throw new Error(`API ${res.status} sur ${path}`)
    return res
}