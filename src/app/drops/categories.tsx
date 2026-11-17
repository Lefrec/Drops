import { apiGet } from "@/lib/api/client"
import { Category } from "@/lib/api/types"
import { SearchParams } from "next/dist/server/request/search-params"
import Link from "next/link"

export async function Categories({searchParams}: {searchParams: Promise<SearchParams>}) {
    const params = await searchParams
    const {category, ...otherParams} = params
    const selectedCategory = typeof category === "string" ? category : undefined
    const list = await apiGet<Category[]>('/categories')

    return (
        <>
            <Link
                href={{pathname: '/drops', query: otherParams}}
                aria-current={selectedCategory ? undefined : "page"}
            >
                Toutes
            </Link>
            {list.map((c) => (
                <Link
                    key={c.id}
                    href={{pathname: '/drops', query: {...otherParams, category: c.id}}}
                    aria-current={selectedCategory === c.id ? "page" : undefined}
                >
                    {c.label}
                </Link>
            ))}
        </>
    )
}
