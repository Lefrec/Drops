import { apiGet } from "@/lib/api/client"
import { Category } from "@/lib/api/types"
import { cacheLife } from "next/cache"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"

export async function Categories({searchParams}: {searchParams: Promise<SearchParams>}) {
    'use cache'
    cacheLife('days')

    const params = await searchParams
    const list = await apiGet<Category[]>('/categories')

    return list.map((c) => (
        <Link key={c.id} href={{pathname: '/drops', query: {...params, cat: c.id}}}>{c.label}</Link>
    ))
}
