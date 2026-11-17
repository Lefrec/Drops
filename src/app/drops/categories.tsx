import { apiGet } from "@/lib/api/client"
import { Category } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"

export async function Categories({searchParams}: {searchParams: Promise<SearchParams>}) {
    const params = await searchParams
    const {cat, ...otherParams} = params
    const list = await apiGet<Category[]>('/categories')

    return (
        <>
            <Link href={{pathname: '/drops', query: otherParams}}>Toutes</Link>
            {list.map((c) => (
                <Link key={c.id} href={{pathname: '/drops', query: {...otherParams, cat: c.id}}}>{c.label}</Link>
            ))}
        </>
    )
}
